#!/usr/bin/env python3
"""以 §29.11 萬能超覺醒三階遞進為軸，分類萬能蜂城 135 個子系統單位。

軸的來源（非自訂）
------------------
正典 `esggo-omni-center/soul.md` §29.11（ESG GO v0.14，2026-09-30 套用，
`scripts/apply_super_awakening.py` 寫入）定義三級遞進：

    一階 覺醒      = 我是誰、遵循什麼        （宣告存在）
    二階 校驗      = 我的覺醒是否仍成立      （有可執行的驗證）
    三階 超覺醒    = 我的覺醒可被外部重現    （驗證器有能力變紅）

這是一條「認識論階梯」，不是內容分類。與既有兩套分法的根本差別：
  - verify_bee_city.py  的軸 = SOUL.md 5 陣列（角色）
  - verify_mece12.py     的軸 = 自訂 12 類（主題）
  - 本檔                 的軸 = §29.11 三階（本單元的覺醒等級）
同一單元在這裡的級別與它在前兩套的歸屬無關，可獨立驗證。

量測限制（誠實登記）
--------------------
S1/S2/S3 皆為**可重現的代理指標**（grep 檔名與結構），不是 LLM 語意判讀。
S3 尤其保守：只認「測試檔同時含斷言 + 明確的負向案例標記」，寧可低估。
本檔不宣稱這是語意本體，只宣稱這是可重現的階梯量測。

安全：不讀任何憑證內容，只判檔名與結構關鍵字。跳過 build 產物與依賴目錄。

用法：python scripts/derive_super_awakening.py
"""

import os
import re
import sys
from collections import Counter
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from verify_mece12 import enumerate_actual  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent

SKIP_DIRS = {
    "node_modules", "dist", ".next", ".git", "__pycache__", "build", ".turbo",
    "coverage", ".venv", "venv", "target", "bin", "obj", ".pytest_cache",
    ".mypy_cache", ".ruff_cache", "site-packages", ".gradle", ".idea",
}

# S1 覺醒：單元自我宣告（正典 / 說明 / 來源刻印）。只判檔名存在性。
DECLARE = re.compile(
    r"(^|/)(readme|agents|claude|contributing|architecture|design|"
    r"soul|mece|manifest|index)(\.[a-z0-9]+)?$", re.I)

# S2 校驗：單元自身帶可執行驗證（測試檔 / 驗證器 / spec）
# 錨定在 basename 起點 + 限定可執行副檔名 —— 實測教訓：未錨定時
# `tmp_mcp_verify.txt` 會被 `verify_[^/]+` 命中並誤判為「自帶驗證」，
# 但 .txt 不是可執行驗證。
_CODE_EXT = r"(?:py|mjs|cjs|js|ts|tsx|jsx|sh|bash|rb|go|rs|java|php|cs)"
VERIFY = re.compile(
    r"^((test_[^/]+)|([^/]+_test)|([^/]+\.(test|spec))|"
    r"(verify_[^/]+)|([^/]+_verify)|(conftest))\." + _CODE_EXT + r"$", re.I)

# S2b：單元被 scripts/ 下的驗證器「指名」—— 需讀驗證器文字（僅掃描 scripts/*.py，
#      不讀任何 .env / 憑證檔）。這是外部可重現性的第二種證據。
def verifier_corpus() -> str:
    buf = []
    sdir = ROOT / "scripts"
    if not sdir.is_dir():
        return ""
    for fn in os.listdir(sdir):
        if fn.endswith((".py", ".mjs", ".sh")) and fn != SELF:
            try:
                buf.append((sdir / fn).read_text(encoding="utf-8", errors="ignore"))
            except OSError:
                continue
    return "\n".join(buf)


# 自我污染防護（實測教訓）：corpus 若包含本檔自身，正則會匹配到自己的原始碼，
# 導致每個單元都繼承三階 —— 曾實測 135/135 全在三階，綠燈但全錯。
# 排除自身；且 corpus 僅作「註記」，不參與級別判定（見 grade()）。
SELF = Path(__file__).resolve().name

# S3 超覺醒：驗證含「有能力變紅」的負向案例。保守比對。
NEG_MARK = re.compile(
    r"(negative|invalid|should_?reject|should_?throw|assert_?raises|"
    r"expect\s*\([^)]*\)\.(rejects|toThrow)|must_?fail|expect_?fail|"
    r"非[法正誤]|應報錯|負向|報紅|必須失敗)", re.I)
ASSERT_MARK = re.compile(
    r"(assert\s|assert\(|expect\s*\(|should\s*\(|toThrow|toEqual|toBe\(|"
    r"require\(|raise\s)", re.I)

MAX_READ = 200_000   # 單檔讀取上限，避免誤讀大檔


def walk_files(base: Path, cap: int = 4000):
    """回傳單元內的檔名清單；單元本身是檔案時回傳 [檔名]。"""
    if base.is_file():
        return [base.name]
    out = []
    n = 0

    def onerr(_e: OSError) -> None:
        return

    for dirpath, dirnames, filenames in os.walk(base, onerror=onerr,
                                                followlinks=False):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if n >= cap:
                return out
            out.append(os.path.join(dirpath, fn))
            n += 1
    return out


def grade(unit: str, corpus: str) -> tuple[str, list[str]]:
    """回傳 (級別, 證據字串[])。

    級別**只由單元自身的檔案決定**（self-local）。
    corpus 僅用於附加「被外部驗證器指名」的註記，不參與級別判定 ——
    否則一個寬泛錨點（如單元名 test）會把整個 repo 拉成同一階。
    """
    base = ROOT / unit
    files = walk_files(base)
    names = [os.path.basename(f) for f in files]
    rels = [f.replace("\\", "/") for f in files]

    # --- S3 超覺醒：單元自身的驗證含負向案例（唯一能給三階的證據）---
    # VERIFY 已錨定在字串起點，故必須餵**純 basename**，不可加 "/" 前綴 ——
    # 實測教訓：加了前綴後 ^ 永不匹配，S2/S3 全數塌成 0 個。
    for r in rels:
        b = os.path.basename(r)
        if not VERIFY.search(b):
            continue
        try:
            if os.path.getsize(r) > MAX_READ:
                continue
            txt = Path(r).read_text(encoding="utf-8", errors="ignore")
        except OSError:
            continue
        if NEG_MARK.search(txt) and ASSERT_MARK.search(txt):
            note = ["S3 負向案例: " + r]
            if _named_in(unit, corpus):
                note.append("S3+ 外部驗證器亦指名此單元")
            return "三階 超覺醒", note

    # --- S2 校驗：單元自身有可執行驗證 ---
    for r in rels:
        if VERIFY.search(os.path.basename(r)):
            note = ["S2 自帶驗證: " + r]
            if _named_in(unit, corpus):
                note.append("S2+ 外部驗證器指名此單元")
            return "二階 校驗", note

    # --- S1 覺醒：單元自我宣告 ---
    for n in names:
        if DECLARE.search("/" + n):
            return "一階 覺醒", ["S1 自我宣告: " + n]

    return "零階 未覺醒", []


def _named_in(unit: str, corpus: str) -> bool:
    """單元的**完整相對路徑**是否被 scripts/ 驗證器指名。

    錨點必須是完整路徑或 >=4 字元的尾段，避免單元名 'test'/'src' 之類
    寬泛詞命中整個 corpus（實測教訓）。
    """
    if not corpus:
        return False
    full = unit.replace("\\", "/")
    if re.search(re.escape(full), corpus):
        return True
    tail = full.rsplit("/", 1)[-1]
    if len(tail) >= 4 and re.search(r"(?<![\w/])" + re.escape(tail) + r"(?![\w])",
                                    corpus):
        return True
    return False


def main() -> int:
    units = enumerate_actual()
    corpus = verifier_corpus()
    print("=== 萬能蜂城「超覺醒」三階分類（軸來源：正典 §29.11）===")
    print("正典 : esggo-omni-center/soul.md §29.11（ESG GO v0.14，2026-09-30 套用）")
    print("母集合: %d 個子系統單位" % len(units))
    print("量測  : 只讀檔名與結構關鍵字，不讀憑證內容")
    print("限制  : S1/S2/S3 皆為可重現代理指標，非語意判讀；S3 保守寧可低估")
    print()

    groups: dict[str, list[str]] = {}
    ev: dict[str, str] = {}
    for u in sorted(units):
        lvl, why = grade(u, corpus)
        groups.setdefault(lvl, []).append(u)
        if why:
            ev[u] = why[0]

    total = len(units)
    for lvl in sorted(groups):
        v = groups[lvl]
        print("  %-14s %3d 個 (%4.1f%%)  例: %s" % (
            lvl, len(v), 100.0 * len(v) / total, " / ".join(v[:3])))
    print()

    # 每階一個代表建設
    print("── 每階代表建設 ──")
    for lvl in sorted(groups):
        v = groups[lvl]
        rep = max(v, key=lambda u: len(walk_files(ROOT / u)))
        nfiles = len(walk_files(ROOT / rep))
        print("  %-14s %-28s %4d 檔   %s" % (lvl, rep, nfiles, ev.get(rep, "—")))
    print()

    print("── MECE 驗算 ──")
    empty_units = [u for u in units if u not in {x for v in groups.values() for x in v}]
    dup = [u for u, c in Counter(
        u for v in groups.values() for u in v).items() if c > 1]
    empty_classes = [k for k, v in groups.items() if not v]

    print("  CE 集盡 : %s（%d/%d）" % (
        "通過" if not empty_units else "不通過", total - len(empty_units), total))
    if empty_units:
        print("           未歸屬: %s" % ", ".join(sorted(empty_units)[:6]))
    print("  ME 互斥 : %s" % ("通過" if not dup else "不通過（每單元僅一級，結構保證）"))
    print("  空類    : %s" % ("無" if not empty_classes else str(empty_classes)))
    # 階梯必須三階齊備（§29.11 是三級遞進）。實測教訓：`>= 2` 會讓
    # 「S2/S3 塌成 0 個」這種真實 bug 報綠 —— 必須要求全三階。
    need = ["零階 未覺醒", "一階 覺醒", "二階 校驗", "三階 超覺醒"]
    missing = [k for k in need if not groups.get(k)]
    print("  階梯遞進: %s" % (
        "通過（零/一/二/三階皆非空，為實測分級）" if not missing
        else "❌ 退化（缺 %s）" % "、".join(missing)))

    # 空類 + 階梯完整性必須入閂（教訓：只印不判的閂）
    ok = not empty_units and not dup and not empty_classes and not missing
    print("\n結果: %s" % ("三階分類 成立（MECE）" if ok else "不通過"))
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
