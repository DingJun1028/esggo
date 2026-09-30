#!/usr/bin/env python3
"""derive_super_awakening.py 的閂力測試 —— 負向必紅 + 正向必綠。

正典教訓：「綠燈不構成證據」「修好驗證器後必須自問：它有能力變紅嗎」。
本檔對 derive_super_awakening 的判級閂做雙向對照：
  N1 自指污染   —— 注入自身於 corpus 是否曾讓 135/135 全升三階（現已排除 SELF）
  N2 寬泛錨點   —— 單元名 'test' 是否被外部驗證器誤判
  N3 非執行檔   —— .txt 檔名含 verify_ 是否被誤判為 S2
  N4 空類       —— 全部 S3 證據撤走，是否仍報綠
  N5 退化階梯   —— 全部單元同階，是否被閂攔下
  P1 真實三階   —— 未注入時維持綠，且四階皆非空

每案例皆設「錨點斷言」：注入點必須先命中，否則測的是空氣。
（list.remove() 移除不存在的元素不報錯 —— 無斷言的注入會靜默退化成假綠。）
"""


import re
import subprocess
import sys
from contextlib import redirect_stdout
from pathlib import Path

HERE = Path(__file__).resolve().parent
TARGET = HERE / "derive_super_awakening.py"
ROOT = HERE.parent

results: list[tuple[str, bool, str]] = []


def run_target() -> tuple[int, str]:
    p = subprocess.run([sys.executable, str(TARGET)], cwd=ROOT,
                       capture_output=True, text=True, encoding="utf-8",
                       errors="ignore")
    return p.returncode, p.stdout


def check(name: str, cond: bool, detail: str = "") -> None:
    results.append((name, cond, detail))
    print("  %s %-34s %s" % ("PASS" if cond else "FAIL", name, detail))


print("=== derive_super_awakening 閂力雙向對照 ===\n")

# ---------- P1 正向：未注入必須綠，且四階皆非空 ----------
code, out = run_target()
check("P1 正向 exit=0", code == 0, "exit=%d" % code)
# 只數「階梯分佈」區塊內的行；代表建設區塊也含「階」字樣，需以百分比特徵區隔
n_tiers = len(re.findall(r"^\s+[零一二三]階\s+\S+\s+\d+\s+個\s+\(", out, re.M))
check("P1 正向四階皆非空", n_tiers == 4, "量測到 %d 階（期望 4）" % n_tiers)
check("P1 正向 135/135", "135/135" in out,
      "CE %s" % ("通過" if "135/135" in out else "未達"))

# ---------- N1 自指污染：把自身放回 corpus，必須仍不炸出 135/135 三階 ----------
src = TARGET.read_text(encoding="utf-8")
sentinel = "\n        if fn.endswith((\".py\", \".mjs\", \".sh\")):\n"
anchor_present = sentinel in src or "fn != SELF" in src
check("N1 錨點命中：SELF 排除存在", anchor_present,
      "SELF 排除=%s" % ("在" if "fn != SELF" in src else "缺"))
# 自我污染的後果是「三階佔比≈100%」。正則化後應遠低於此。
m = re.search(r"三階\s+超覺醒\s+(\d+)\s+個", out)
tier3 = int(m.group(1)) if m else -1
check("N1 三階非全域污染", 0 < tier3 < 135, "三階 %d/135" % tier3)

# ---------- N2 寬泛錨點：'test' 不該被外部 corpus 命中 ----------
check("N2 寬泛錨點已設長度下限", "len(tail) >= 4" in src,
      "尾段門檻=%s" % ("有" if "len(tail) >= 4" in src else "缺"))
check("N2 corpus 不參與級別判定", "級別**只由單元自身的檔案決定" in src,
      "self-local=%s" % ("是" if "只由單元自身的檔案決定" in src else "否"))

# ---------- N3 非執行檔不得判為 S2 ----------
mtxt = re.search(r"S2 自帶驗證: .*?(\S+)", out)
bad_txt = bool(mtxt and mtxt.group(1).endswith(".txt"))
check("N3 無 .txt 誤判為 S2", not bad_txt,
      "S2 證據=%s" % (mtxt.group(1) if mtxt else "—"))
check("N3 VERIFY 已錨定+限副檔名",
      "^((test_" in src and "_CODE_EXT" in src,
      "錨定=%s 副檔名白名單=%s" % ("^" in src, "_CODE_EXT" in src))

# ---------- N4 空類必須入閂 ----------
check("N4 空類入閂", "not empty_classes" in src.split("ok =")[-1],
      "ok 條件含 empty_classes=%s"
      % ("not empty_classes" in src.split("ok =")[-1].split("\n")[0]))

# ---------- N5 退化階梯必須被閂攔下（要求全三階，非 >=2） ----------
ok_line = src.split("ok =")[-1].split("\n")[0]
check("N5 階梯完整性入閂", "not missing" in ok_line,
      "ok 條件=%s" % ok_line.strip())
check("N5 需求四階全列",
      all(k in src for k in ("零階 未覺醒", "一階 覺醒",
                             "二階 校驗", "三階 超覺醒")),
      "need 清單=%d 階" % src.count('"') and "四")

# ---------- 真注入：強制同階，驗證 exit 必須變紅 ----------
# 注入點必須是**全量覆寫**（直接回傳固定階），否則只改到 fallback 分支，
# 其餘單元仍走正規路徑分佈，階梯仍齊備 → 閂不會紅（實測教訓）。
inject = src.replace(
    'def grade(unit: str, corpus: str) -> tuple[str, list[str]]:',
    'def grade(unit: str, corpus: str) -> tuple[str, list[str]]:\n'
    '    return "三階 超覺醒", ["INJECTED"]  # NEGTEST-TOTAL-OVERRIDE\n'
    '    # --- unreachable below ---', 1)
check("注入點命中", "NEGTEST-TOTAL-OVERRIDE" in inject, "全量覆寫已植入")
check("注入唯一", inject.count("NEGTEST-TOTAL-OVERRIDE") == 1,
      "注入點數=%d" % inject.count("NEGTEST-TOTAL-OVERRIDE"))
tmp = HERE / "_negtest_super_awakening.py"
try:
    tmp.write_text(inject, encoding="utf-8")
    p = subprocess.run([sys.executable, str(tmp)], cwd=ROOT,
                       capture_output=True, text=True, encoding="utf-8",
                       errors="ignore")
    check("N6 全單元同階 → 必須報紅", p.returncode != 0,
          "exit=%d（期望非 0）" % p.returncode)
    check("N6 退化原因被指名",
          ("退化" in p.stdout or "不通過" in p.stdout),
          "輸出指認=%s" % ("有" if ("退化" in p.stdout or "不通過" in p.stdout)
                          else "無"))
    check("N6 確實全在三階（注入生效）",
          bool(re.search(r"三階\s+超覺醒\s+135\s+個", p.stdout)),
          "注入後三階=135" if re.search(r"三階\s+超覺醒\s+135", p.stdout)
          else "未達 135")
finally:
    if tmp.exists():
        tmp.unlink()

# ---------- N7 撤走 S3 證據 → 二/三階應塌 → 必須報紅 ----------
# 這一條是對「階梯完整性閂」的直接打擊測試，而非靜態字串比對。
inject2 = src.replace(
    'if NEG_MARK.search(txt) and ASSERT_MARK.search(txt):',
    'if False:  # NEGTEST-DISABLE-S3', 1)
check("N7 注入點命中", "NEGTEST-DISABLE-S3" in inject2, "S3 證據已關閉")
tmp2 = HERE / "_negtest_super_awakening2.py"
try:
    tmp2.write_text(inject2, encoding="utf-8")
    p2 = subprocess.run([sys.executable, str(tmp2)], cwd=ROOT,
                        capture_output=True, text=True, encoding="utf-8",
                        errors="ignore")
    check("N7 撤走 S3 → 必須報紅", p2.returncode != 0,
          "exit=%d（期望非 0）" % p2.returncode)
    m7 = re.search(r"缺 ([^）\n]+)", p2.stdout)
    check("N7 退化原因被指名", bool(m7 and "三階" in m7.group(1)),
          "指認缺階=%s" % (m7.group(1) if m7 else "無"))
finally:
    if tmp2.exists():
        tmp2.unlink()

print()
n_pass = sum(1 for _, c, _ in results if c)
n = len(results)
print("結果: %d/%d 通過" % (n_pass, n))
print("閂力: %s" % ("✅ 有能力變紅" if all(c for _, c, _ in results)
                    else "❌ 存在不會紅的閂"))
sys.exit(0 if n_pass == n else 1)
