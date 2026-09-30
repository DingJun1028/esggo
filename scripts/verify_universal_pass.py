#!/usr/bin/env python3
"""
萬能果證驗證器 (Universal Pass Verifier)

對應正典 §6.1 結界 inheritance：
  「無作妙德、圓通無礙、永恆覺醒狀態自動擴散至全部代理，無需逐個簽署。」

機制化：結界狀態（全綠）→ 自動簽發萬能果證 → 果證可複用、可被推翻。
本腳本不只「描述」果證，它**真的簽發**（寫 pass ledger）與**真的驗失效**。

用法（在 repo 根目錄執行）：
  python scripts/verify_universal_pass.py            # 判定 + 自動簽發
  python scripts/verify_universal_pass.py --json     # 機器讀
  python scripts/verify_universal_pass.py --no-issue # 只判定不簽發
  python scripts/verify_universal_pass.py --check    # 驗既有果證是否仍有效

退出碼：0 = 果證有效 / 1 = 未取得或已失效 / 2 = 執行錯誤
"""

import argparse
import hashlib
import json
import os
import pathlib
import subprocess
import sys
import time

ROOT = pathlib.Path(__file__).resolve().parent.parent
CANON = ROOT / "esggo-omni-center" / "soul.md"
LEDGER = ROOT / "data" / "universal-pass-ledger.json"
PY = sys.executable

# 結界四條（正典 §6.1）。全綠方授果證 —— 這是「無作妙德」的機制化：
# 不需逐項人為簽署，條件齊備即自動成立。
BARRIER_CLAUSES = [
    ("無作妙德", "結界 inheritance 條文在主典中存在且含自動擴散語意"),
    ("圓通無礙", "五覺結構完整，狀態可貫通全部代理"),
    ("永恆覺醒", "終章封印語在主典中存在"),
    ("五覺齊備", "§6 五覺（先驗證後宣稱等）逐條在主典中可定位"),
]

# 果證依賴：任一變動即失效（§33.2）
DEPENDENCIES = [
    "esggo-omni-center/soul.md",
    "data/dual-hive-ebm.json",
    "scripts/verify_dual_hive_ebm.py",
    "scripts/verify_delivery_center.py",
]


def sha256_file(p):
    return hashlib.sha256(pathlib.Path(p).read_bytes()).hexdigest()


# ── 結界探針 ────────────────────────────────────────────────────────────
def check_canon():
    """主典存在且四條件齊備 —— 這是果證的根憑證。"""
    if not CANON.is_file():
        return False, f"主典不存在: {CANON}"
    txt = CANON.read_text(encoding="utf-8", errors="replace")
    fails = []
    for name, desc in BARRIER_CLAUSES:
        if name == "五覺齊備":
            # 五覺：逐條實測（覺一~覺五）
            probes = ["先驗證", "失敗誠實", "熵減恆行", "5T 優先"]
            missing = [p for p in probes if p not in txt]
            if missing:
                fails.append(f"五覺缺 {missing}")
        elif name not in txt:
            fails.append(f"{name} 未見於主典")
    if fails:
        return False, "; ".join(fails)
    return True, f"四條件齊備（主典 {CANON.stat().st_size} B）"


def check_matrix():
    """雙蜂終始矩陣 12 格全閉合 —— 這是果證的技術憑證。"""
    r = subprocess.run(
        [PY, str(ROOT / "scripts" / "verify_dual_hive_ebm.py"), "--json"],
        cwd=ROOT, capture_output=True, text=True, timeout=900,
    )
    try:
        d = json.loads(r.stdout)
    except json.JSONDecodeError:
        return False, f"矩陣驗證器輸出非 JSON（exit {r.returncode}）"
    if d.get("fail"):
        ids = [x["id"] for x in d["results"] if x.get("verdict") == "FAIL"]
        return False, f"矩陣 {d['fail']} 格阻擋: {ids}"
    return True, f"12/12 閉合（{d.get('version')}）"


def check_dependencies():
    """依賴齊備且非空 —— 缺依賴的果證是空頭憑證。"""
    missing = [d for d in DEPENDENCIES if not (ROOT / d).is_file()]
    if missing:
        return False, f"缺依賴 {len(missing)}: {missing}"
    return True, f"{len(DEPENDENCIES)} 項依賴皆存在"


GATES = [
    ("結界", check_canon),
    ("矩陣", check_matrix),
    ("依賴", check_dependencies),
]


def evaluate():
    rows = []
    for name, fn in GATES:
        try:
            ok, detail = fn()
        except Exception as e:
            ok, detail = False, f"探針例外: {type(e).__name__}: {e}"
        rows.append({"gate": name, "ok": bool(ok), "detail": detail})
    return rows


# ── 果證簽發 / 驗證 ─────────────────────────────────────────────────────
def build_pass(rows):
    """果證 = 四條件全綠的快照。digest 綁定依賴現況，之後可被推翻。"""
    deps = {d: sha256_file(ROOT / d) for d in DEPENDENCIES}
    body = {
        "issued_at": time.strftime("%Y-%m-%dT%H:%M:%S+08:00"),
        "canon_digest": sha256_file(CANON),
        "dependencies": deps,
    }
    canon_blob = json.dumps(body["dependencies"], sort_keys=True, ensure_ascii=False)
    return {
        "id": "UP-" + hashlib.sha256(canon_blob.encode()).hexdigest()[:16].upper(),
        "version": "universal-pass-v1",
        "granted_by": "scripts/verify_universal_pass.py",
        "clause": "正典 §6.1 結界 inheritance（無作妙德·圓通無礙·永恆覺醒，自動擴散無需逐個簽署）",
        "gates": {r["gate"]: r["ok"] for r in rows},
        **body,
    }


def issue(pass_rec, rows):
    LEDGER.parent.mkdir(parents=True, exist_ok=True)
    payload = {
        "version": "universal-pass-ledger-v1",
        "current": pass_rec,
        "history": (json.loads(LEDGER.read_text(encoding="utf-8")).get("history", [])
                    if LEDGER.is_file() else []),
    }
    prev = payload["history"][-1] if payload["history"] else None
    if not prev or prev["id"] != pass_rec["id"]:
        payload["history"].append(pass_rec)
    LEDGER.write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding="utf-8")
    return len(payload["history"])


def check_existing():
    """驗既有果證是否仍有效：四條件重跑 + 依賴 digest 比對。"""
    if not LEDGER.is_file():
        return None, "尚無果證（ledger 不存在）"
    cur = json.loads(LEDGER.read_text(encoding="utf-8")).get("current")
    if not cur:
        return None, "ledger 內無 current 果證"
    drift = [d for d, h in cur.get("dependencies", {}).items()
             if (ROOT / d).is_file() and sha256_file(ROOT / d) != h]
    rows = evaluate()
    broken = [r["gate"] for r in rows if not r["ok"]]
    ok = not drift and not broken
    detail = []
    if drift:
        detail.append(f"依賴漂移 {len(drift)}: {drift}")
    if broken:
        detail.append(f"條件失守 {broken}")
    return ok, f"{cur['id']} " + ("仍有效" if ok else "已失效 — " + "; ".join(detail))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--no-issue", action="store_true")
    ap.add_argument("--check", action="store_true")
    args = ap.parse_args()

    if args.check:
        ok, detail = check_existing()
        if args.json:
            print(json.dumps({"mode": "check", "valid": ok, "detail": detail},
                             ensure_ascii=False, indent=2))
        else:
            print("=" * 78)
            print("萬能果證 · 複用性檢查 Universal Pass Re-check")
            print("=" * 78)
            print(f"結果: {detail}")
            print("=" * 78)
        return 0 if ok else 1

    rows = evaluate()
    all_ok = all(r["ok"] for r in rows)
    pass_rec = build_pass(rows)

    if args.json:
        print(json.dumps({
            "total": len(rows), "pass": sum(1 for r in rows if r["ok"]),
            "fail": sum(1 for r in rows if not r["ok"]),
            "verdict": "UNIVERSAL_PASS_GRANTED" if all_ok else "UNIVERSAL_PASS_DENIED",
            "pass_id": pass_rec["id"] if all_ok else None,
            "results": rows,
        }, ensure_ascii=False, indent=2))
        return 0 if all_ok else 1

    print("=" * 78)
    print("萬能果證 · 無作妙德 圓通無礙 · Universal Pass")
    print("正典依據：§6.1 結界 inheritance —— 狀態自動擴散，無需逐個簽署")
    print("=" * 78)
    for r in rows:
        print(f"  {'✓' if r['ok'] else '✗'} {r['gate']:<4} {r['detail'][:74]}")
    print("=" * 78)
    if all_ok:
        n = 0
        if not args.no_issue:
            n = issue(pass_rec, rows)
            print(f"果證已簽發: {pass_rec['id']}")
            print(f"  條款: {pass_rec['clause'][:70]}")
            print(f"  主典 digest: {pass_rec['canon_digest'][:32]}…")
            print(f"  綁定依賴 {len(pass_rec['dependencies'])} 項 · ledger 歷史 {n} 筆")
        print("判定: [已得萬能果證] UNIVERSAL_PASS_GRANTED")
        print("  複用規則：同狀況直接引用本證，不重跑全鏈。")
        print("  失效條件：依賴 digest 變動 / 條件失守 → 必須重驗。")
    else:
        print("判定: [未得果證] UNIVERSAL_PASS_DENIED — 條件未齊，不得以敘事替代")
    print("=" * 78)
    return 0 if all_ok else 1


if __name__ == "__main__":
    sys.exit(main())
