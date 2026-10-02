#!/usr/bin/env python3
"""MECE 驗證器的雙向對照矩陣（負向必紅 + 正向必綠）.

為什麼需要這支：verify_mece12.py / verify_bee_city.py 都回報過 EXIT=0。
但依 omni-best-practice 的實測教訓——「正向綠燈在『閂根本不會紅』與『閂正確』
兩種情況下長得一模一樣」。只跑過正向的 EXIT=0 不構成證據。

規則（照抄正典，不可省略）:
  1. 注入前先斷言錨點命中 —— replace/list 移除未命中時不報錯，會造成假綠。
  2. 負向案例逐一對準每個檢查項，不要只做泛用案例。
  3. 不只看 exit code，要看輸出有沒有指名預期的那個單元/類別。
  4. 正向與負向缺一不可。

用法: python scripts/test_mece_verifiers.py
"""
from __future__ import annotations

import copy
import io
import sys
from collections import Counter
from contextlib import redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

import derive_whole_body as dwb          # noqa: E402
import verify_bee_city as vbc           # noqa: E402
import verify_mece12 as vm12            # noqa: E402

results: list[tuple[bool, str, str]] = []


def run(mod, attr: str) -> tuple[int, str]:
    """在 restore 原狀的前提下跑一次 main()，回傳 (exit code, 輸出)."""
    buf = io.StringIO()
    with redirect_stdout(buf):
        code = mod.main()
    return code, buf.getvalue()


def case(label: str, expect_exit: int, expect_in: list[str],
         mutate, mod, attr: str) -> None:
    saved = copy.deepcopy(getattr(mod, attr))
    try:
        mutate(getattr(mod, attr))
        code, out = run(mod, attr)
    finally:
        setattr(mod, attr, saved)          # 必須還原，否則汙染後續案例
    ok = code == expect_exit and all(s in out for s in expect_in)
    detail = "exit=%d(期望%d) 命中=%s" % (
        code, expect_exit, [s for s in expect_in if s in out] or "無")
    results.append((ok, label, detail))
    print("  %s %-46s %s" % ("PASS" if ok else "FAIL", label, detail))
    if not ok:
        print("       輸出片段: %s" % out.strip().replace("\n", " | ")[:300])


print("=== 負向對照：每個檢查項都要有「會紅」的能力 ===")
print("[verify_mece12.py]")

# A. 重複指派 → ME 互斥 必須報紅，且指名 apps/stt
def mut_dupes(cats):
    assert "apps/stt" in cats["C01 語音與即時通訊"], "錨點未命中：apps/stt 不在 C01"
    cats["C03 記憶與知識載體"].append("apps/stt")

case("A 重複指派 → ME互斥 紅", 1, ["失敗", "apps/stt"], mut_dupes, vm12, "CATEGORIES")

# B. 拿掉一個單元 → CE 集盡 必須報紅，且指名該單元
def mut_gap(cats):
    assert "apps/ftg-tools" in cats["C10 產品應用-FTG"], "錨點未命中"
    cats["C10 產品應用-FTG"].remove("apps/ftg-tools")

case("B 漏歸屬 → CE集盡 紅", 1, ["未歸屬", "apps/ftg-tools"], mut_gap, vm12, "CATEGORIES")

# C. 清空一類 → 空類 必須報紅，且指名該類別
def mut_empty(cats):
    assert len(cats["C08 觀測與健康度"]) >= 3, "錨點未命中"
    cats["C08 觀測與健康度"] = []

case("C 清空一類 → 空類 紅", 1, ["C08 觀測與健康度"], mut_empty, vm12, "CATEGORIES")

# D. 幽靈單元 → 存在性 必須報紅，且指名該單元
def mut_ghost(cats):
    cats["C01 語音與即時通訊"].append("apps/__no_such_app__")

case("D 幽靈單元 → 存在性 紅", 1, ["不存在", "apps/__no_such_app__"],
     mut_ghost, vm12, "CATEGORIES")

print("\n[verify_bee_city.py]")

# E. 跨陣列重複 → ME 互斥
def mut_vbc_dup(assign):
    assert "scripts" in assign["守衛組 25-30"], "錨點未命中"
    assign["技術組 07-12"].append("scripts")

case("E 跨陣列重複 → ME互斥 紅", 1, ["不通過", "scripts"],
     mut_vbc_dup, vbc, "ASSIGN")

# F. 漏歸屬 → CE 集盡
def mut_vbc_gap(assign):
    assert "grafana" in assign["技術組 07-12"], "錨點未命中"
    assign["技術組 07-12"].remove("grafana")

case("F 漏歸屬 → CE集盡 紅", 1, ["不通過", "grafana"], mut_vbc_gap, vbc, "ASSIGN")

# G. 空陣列 → 空類
def mut_vbc_empty(assign):
    assert len(assign["營銷組 19-24"]) >= 5, "錨點未命中"
    assign["營銷組 19-24"] = []

case("G 空陣列 → 空類 紅", 1, ["不通過", "營銷組 19-24"],
     mut_vbc_empty, vbc, "ASSIGN")

# H. 幽靈單元 → 存在性
def mut_vbc_ghost(assign):
    assign["守衛組 25-30"].append("scripts/__not_here__")

case("H 幽靈單元 → 存在性 紅", 1, ["不通過", "scripts/__not_here__"],
     mut_vbc_ghost, vbc, "ASSIGN")

print("\n[derive_whole_body.py]  （量測函式以 stub 取代，僅驗分類閘的判紅能力）")

# 固定 stub：3 體各給固定單元數，避免每次重掃整棵樹
_STUB = {
    "u1": Counter({"正典體 Canon": 10, "資料體 Record": 2}),
    "u2": Counter({"介面體 Interface": 8}),
    "u3": Counter({"執行體 Engine": 6}),
    "tie1": Counter({"正典體 Canon": 5, "資料體 Record": 5}),   # 併流
    "void1": Counter(),                                          # 無構成
}
_real_measure = dwb.measure


def with_stub(fn):
    dwb.measure = fn
    try:
        return fn()
    finally:
        dwb.measure = _real_measure


# I. 全域無構成 → CE 集盡 紅
def case_i():
    dwb.measure = lambda u, cap=4000: Counter()
    try:
        return run(dwb, None)
    finally:
        dwb.measure = _real_measure

code, out = case_i()
ok = code == 1 and "CE 集盡" in out and "不通過" in out
results.append((ok, "I 全域無構成 → CE集盡 紅", "exit=%d" % code))
print("  %s %-46s %s" % ("PASS" if ok else "FAIL", "I 全域無構成 → CE集盡 紅",
                         "exit=%d(期望1)" % code))

# J. 併流 → ME 互斥 紅，且指名併流的單元
def case_j():
    dwb.measure = lambda u, cap=4000: _STUB.get(u, Counter({"正典體 Canon": 1}))
    dwb.enumerate_actual = lambda: ["u1", "u2", "u3", "tie1"]
    try:
        return run(dwb, None)
    finally:
        dwb.measure = _real_measure
        dwb.enumerate_actual = sys.modules["verify_mece12"].enumerate_actual

_real_enum = dwb.enumerate_actual
code, out = case_j()
ok = (code == 1 and "ME 互斥" in out and "不通過" in out and "tie1" in out)
results.append((ok, "J 併流 → ME互斥 紅(指名 tie1)", "exit=%d" % code))
print("  %s %-46s %s" % ("PASS" if ok else "FAIL", "J 併流 → ME互斥 紅(指名 tie1)",
                         "exit=%d(期望1) 指名tie1=%s" % (code, "tie1" in out)))

# K. 空體系（某體無任何單元歸入）→ 空類 紅
def case_k():
    dwb.measure = lambda u, cap=4000: Counter({"介面體 Interface": 3})
    dwb.enumerate_actual = lambda: ["u1", "u2", "u3"]
    try:
        return run(dwb, None)
    finally:
        dwb.measure = _real_measure
        dwb.enumerate_actual = _real_enum

code, out = case_k()
ok = code == 1 and "空" in out and "未被量測到" in out
results.append((ok, "K 5 種體缺席 → 空類 紅", "exit=%d" % code))
print("  %s %-46s %s" % ("PASS" if ok else "FAIL", "K 5 種體缺席 → 空類 紅",
                         "exit=%d(期望1)" % code))

print("\n=== 正向對照：未改動時的當前真實狀態 ===")
for name, mod, want in (("verify_mece12", vm12, 0), ("verify_bee_city", vbc, 0)):
    code, out = run(mod, None)
    ok = code == want
    results.append((ok, "P %s 未改動" % name, "exit=%d(期望%d)" % (code, want)))
    print("  %s %-46s %s" % ("PASS" if ok else "FAIL", "P %s 未改動" % name,
                            "exit=%d(期望%d)" % (code, want)))
code, out = run(dwb, None)
ok = code == 1 and "ME 互斥" in out and "11" in out
results.append((ok, "P derive_whole_body 未改動（真實真相=紅）", "exit=%d" % code))
print("  %s %-46s %s" % ("PASS" if ok else "FAIL",
                        "P derive_whole_body 未改動（真實真相=紅）",
                        "exit=%d(期望1)" % code))

passed = sum(1 for r in results if r[0])
print("\n=== 結論：%d / %d 通過 ===" % (passed, len(results)))
if passed != len(results):
    print("未通過：")
    for ok, label, detail in results:
        if not ok:
            print("  - %s (%s)" % (label, detail))
    sys.exit(1)
print("三支驗證器均證明「有能力報紅」，其綠燈才具有證據力。")
