#!/usr/bin/env python3
"""
萬能樣式 · OmniUI 樣貌稽核器 (OmniUI Style Conformance Audit)

為何需要這個腳本：
  OmniUI v1.0 (packages/omni-ui/src/index.ts) 自稱「樣貌唯一來源」(SSOT)，
  但既有守門只覆蓋單一消費端 (apps/omnilive/public/index.html)，
  全庫其餘消費端無任何機械化檢查。這是典型的「新增欄位只寫不驗 =
  空宣稱」——SSOT 的權威性若不覆蓋全庫，就只是文件上的形容詞。

  本腳本把「OmniUI 是全庫樣貌 SSOT」這句話變成可證偽的量測:
    A1 SSOT 可讀且自我一致 — renderStyle 的值必須由 config 推導，不得硬寫死
    A2 消費端對齊         — 引用 OmniUI 的消費端必須用 token，不得散寫硬編碼
    A3 樣貌漂移盤點       — 全庫 backdrop-filter blur 分佈，列出離散值
    A4 設計系統併存盤點   — 全庫 DESIGN_TOKENS 定義點（多套 = 樣貌分裂）

  A3/A4 是「盤點」不阻擋（不同 app 本可有不同意圖），
  但 A3/A4 產出的漂移量會寫進輸出，讓分裂程度無法被敘事掩蓋。

安全設計（不可篡改 / Trustworthy）:
  - 唯讀：本腳本不寫入、不刪除、不 commit 任何檔案，只報告
  - 退出碼：0 = A1/A2 全部通過（SSOT 自身健全且已宣告對齊的消費端無硬編碼）
           1 = 有阻擋項
           2 = 執行錯誤（找不到 SSOT）
  - 不推論：每項附實際觀測值（檔案、行號、數值）

用法:
  python scripts/verify_omniui_style.py
  python scripts/verify_omniui_style.py --json
"""

import argparse
import json
import os
import re
import sys
from datetime import datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SSOT = os.path.join(ROOT, "packages", "omni-ui", "src", "index.ts")

# 掃描時必須排除的目錄（否則全庫 grep 會掃進依賴與建置產物而逾時）
SKIP_DIRS = {
    "node_modules", ".next", ".git", "dist", "build", "coverage",
    ".turbo", ".vercel", "out", ".pnpm-store", "__pycache__", ".venv", "venv",
}

# OmniUI 官方樣貌值（若 SSOT 改版，此處應同步更新並連同測試一起改）
CANON_BLUR = 20
CANON_RADIUS = 12
CANON_SHADOW = "0 8px 32px rgba(0, 0, 0, 0.2)"
CANON_BORDER = "1px solid rgba(201, 162, 75, 0.3)"

# 已知且已宣告對齊 OmniUI 的消費端（token 化）
KNOWN_ALIGNED = {
    os.path.join("apps", "omnilive", "public", "index.html"),
}

findings = []


def record(gate, level, check, detail, observed=None):
    findings.append(
        {"gate": gate, "level": level, "check": check, "detail": detail, "observed": observed}
    )


def walk_source_files():
    """走訪 repo 內的樣式相關檔案。

    以 `git ls-files` 為準，而非 os.walk：os.walk 會鑽進
    apps/ftg-tours-website/dist 等建置產物，實測讓全庫稽核從秒級
    變成 >300s 逾時（且掃到的還是同一份碼字的副本）。
    版控清單天然排除 node_modules/.next/dist 且只含真實來源檔。
    git 不可用時退回 os.walk（此時仍跳過 SKIP_DIRS）。
    """
    import subprocess

    exts = (".ts", ".tsx", ".html", ".css", ".mjs", ".js", ".jsx")
    try:
        out = subprocess.run(
            ["git", "ls-files"],
            cwd=ROOT,
            capture_output=True,
            text=True,
            timeout=120,
        )
        files = [ln.strip() for ln in out.stdout.splitlines() if ln.strip().endswith(exts)]
        if out.returncode == 0 and files:
            for relpath in files:
                yield os.path.join(ROOT, relpath)
            return
    except (OSError, subprocess.TimeoutExpired):
        pass  # 落到 os.walk

    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for name in filenames:
            if name.endswith(exts):
                yield os.path.join(dirpath, name)


def iter_source_texts():
    """單次讀取所有來源檔，回傳 (repo 相對路徑, 內容)。

    A3/A4 兩項盤點都要掃全庫；各自獨立開檔會讓 1442 個檔案被讀兩次。
    實測在 Windows 上逐檔 open 是本稽核的主要耗時來源，
    故在此一次讀完並重複利用。
    """
    for path in walk_source_files():
        try:
            with open(path, encoding="utf-8", errors="ignore") as fh:
                yield rel(path), fh.read()
        except OSError:
            continue


def rel(path):
    return os.path.relpath(path, ROOT).replace("\\", "/")


# ── A1 SSOT 自我一致 ──────────────────────────────────────────────────────
def gate_ssot_self_consistent():
    if not os.path.isfile(SSOT):
        record("A1", "FAIL", "ssot.readable", "找不到 OmniUI SSOT", rel(SSOT))
        return False

    src = open(SSOT, encoding="utf-8").read()
    rows, all_ok = [], True

    # DEFAULT_GLASS.blur 必為 CANON_BLUR
    m = re.search(r"DEFAULT_GLASS[^=]*=\s*\{[^}]*?blur:\s*(\d+)", src, re.S)
    if not m:
        rows.append({"check": "DEFAULT_GLASS.blur", "ok": False, "observed": "解析不到"})
        all_ok = False
    else:
        ok = int(m.group(1)) == CANON_BLUR
        all_ok = all_ok and ok
        rows.append(
            {
                "check": "DEFAULT_GLASS.blur",
                "declared_in_ssot": int(m.group(1)),
                "canon": CANON_BLUR,
                "ok": ok,
            }
        )

    # renderStyle 不得把樣貌值硬寫死，必須由 this.config 推導
    rs = re.search(r"renderStyle\(\)[^{]*\{(.*?)\n  \}", src, re.S)
    if not rs:
        rows.append({"check": "renderStyle.body", "ok": False, "observed": "解析不到 renderStyle"})
        all_ok = False
    else:
        body = rs.group(1)
        # border-radius / box-shadow 是固定樣貌，允許硬寫（但須等於 canon）
        for prop, canon in (("border-radius", f"{CANON_RADIUS}px"), ("box-shadow", CANON_SHADOW)):
            found = re.search(rf"'{prop}':\s*'([^']+)'", body)
            got = found.group(1) if found else None
            ok = got == canon
            all_ok = all_ok and ok
            rows.append({"check": f"renderStyle.{prop}", "declared": got, "canon": canon, "ok": ok})

        # blur 必須由 config 推導，不可硬寫數字
        blur_hardcoded = re.search(r"'backdrop-filter':\s*`blur\(\d+px\)`", body)
        ok = blur_hardcoded is None
        all_ok = all_ok and ok
        rows.append(
            {
                "check": "renderStyle.backdrop-filter",
                "rule": "必須由 this.config.blur 推導，不得硬寫數值",
                "hardcoded": bool(blur_hardcoded),
                "ok": ok,
            }
        )

    level = "PASS" if all_ok else "FAIL"
    detail = (
        "SSOT 自我一致（樣貌值由 config 推導，無硬寫）"
        if all_ok
        else "SSOT 內部有不一致或硬寫的樣貌值"
    )
    record("A1", level, "ssot.self_consistent", detail, rows)
    return all_ok


# ── A2 已宣告對齊的消費端必須 token 化 ──────────────────────────────────
def gate_aligned_consumers_tokenized():
    rows, all_ok = [], True
    for relpath in sorted(KNOWN_ALIGNED):
        abspath = os.path.join(ROOT, relpath)
        if not os.path.isfile(abspath):
            rows.append({"consumer": relpath, "ok": False, "observed": "檔案不存在"})
            all_ok = False
            continue
        html = open(abspath, encoding="utf-8").read()
        # 已宣告對齊卻仍散寫 blur 數值 = 假對齊
        hardcoded = sorted(set(re.findall(r"blur\((\d+)px\)", html)))
        uses_token = "var(--omni-blur)" in html
        ok = uses_token and not hardcoded
        all_ok = all_ok and ok
        rows.append(
            {
                "consumer": relpath,
                "uses_token": uses_token,
                "hardcoded_blur_values": hardcoded,
                "ok": ok,
            }
        )

    level = "PASS" if all_ok else "FAIL"
    record(
        "A2",
        level,
        "consumer.tokenized",
        (
            f"{len(KNOWN_ALIGNED)} 個已宣告對齊的消費端全數 token 化"
            if all_ok
            else "已宣告對齊的消費端仍有散寫硬編碼（假對齊）"
        ),
        rows,
    )
    return all_ok


# ── A3/A4 全庫盤點（不阻擋，但必須可見）───────────────────────────────
# 已知 token 模組 → 標籤
TOKEN_MODULES = {
    "lib/omni-theme/design-system": "DESIGN_TOKENS#1",
    "packages/shared/src/tokens/design-tokens": "DESIGN_TOKENS#2",
    "src/lib/design-system": "DESIGN_TOKENS#3",
}
# 每個模組在原始碼中可能出現的 import 樣式（相對路徑 + tsconfig alias）
# 判斷消費端需「import 命中」且「實際引用 DESIGN_TOKENS 符號」兩者同時成立：
# 只用 @esggo/shared 這類套件根樣式不足為據——i18n/canon/api 檔案都 import 套件根
# 但只用 types/health/config，並未消費 design tokens。
_IMPORT_PATTERNS = {
    "lib/omni-theme/design-system": [r"omni-theme/design-system"],
    "packages/shared/src/tokens/design-tokens": [r"@esggo/shared", r"shared/src/tokens"],
    "src/lib/design-system": [r"@/lib/design-system", r"\./design-system", r"\.\./lib/design-system"],
}


def resolve_token_consumers():
    """實測每套 token 模組的真實 import 消費端。

    只認「宣告端」；re-export（export * from）與單純提及符號不算消費端，
    否則 packages/shared/src/index.ts 會被誤判成第 4 套。
    """
    declaring, texts = set(), {}
    for relpath, text in iter_source_texts():
        texts[relpath] = text
        if re.search(r"export const DESIGN_TOKENS\s*[:=]", text):
            declaring.add(relpath)

    consumers = {m: set() for m in TOKEN_MODULES}
    for relpath, text in texts.items():
        if relpath in declaring:
            continue  # 宣告端自己不算消費端
        # 條件一：確實從該模組 import（任一 alias 樣式命中）
        imported = any(
            re.search(rf"""['"][^'"]*{pat}[^'"]*['"]""", text)
            for pats in _IMPORT_PATTERNS.values()
            for pat in pats
        )
        if not imported:
            continue
        # 條件二：檔案內確實用到 DESIGN_TOKENS 符號
        uses_symbol = re.search(r"\bDESIGN_TOKENS\b", text)
        if not uses_symbol:
            continue
        for module, pats in _IMPORT_PATTERNS.items():
            if any(re.search(rf"""['"][^'"]*{pat}[^'"]*['"]""", text) for pat in pats):
                consumers[module].add(relpath)
    return declaring, consumers


def audit_repo_once():
    """單次掃全庫，同時產出 A3（blur 漂移）與 A4（token 系統併存）。

    兩項盤點若各自掃一次，1442 個檔案會被讀兩次；實測這是本稽核
    從秒級退化到分鐘級的主因。故合併為一趟。
    """
    dist, token_hits = {}, []
    for relpath, text in iter_source_texts():
        for v in re.findall(r"backdrop-filter:\s*blur\((\d+)px\)", text):
            dist.setdefault(int(v), []).append(relpath)

    # ── A3 樣貌漂移盤點 ──
    rows = [
        {"blur_px": v, "file_count": len(set(f)), "files": sorted(set(f))}
        for v, f in sorted(dist.items())
    ]
    total_files = len({f for r in rows for f in r["files"]})
    record(
        "A3",
        "WARN" if len(rows) > 1 else "INFO",
        "style.blur_drift",
        f"全庫 backdrop-filter blur 共 {len(rows)} 種值、散佈於 {total_files} 個檔案"
        f"（OmniUI 樣貌為 {CANON_BLUR}px）",
        rows,
    )

    # ── A4 設計系統併存盤點（分辨孤兒 vs 活系統）──
    declaring, consumers = resolve_token_consumers()
    rows4 = []
    for module, label in TOKEN_MODULES.items():
        if module + ".ts" not in declaring:
            continue  # 模組已不存在，不列幽靈列
        decl_here = True
        live = sorted(consumers[module])
        if not live:
            kind = "孤兒（宣告但零 import 消費端）"
        else:
            kind = "活系統"
        rows4.append(
            {
                "token_system": label,
                "module": module,
                "declares": decl_here,
                "consumer_count": len(live),
                "consumers": live,
                "kind": kind,
            }
        )
    orphans = [r for r in rows4 if r["kind"].startswith("孤兒")]
    active = [r for r in rows4 if r["kind"] == "活系統"]
    record(
        "A4",
        "WARN" if len(declaring) > 1 else "INFO",
        "style.token_systems",
        f"全庫 {len(declaring)} 套 DESIGN_TOKENS 宣告：{len(active)} 套活著、"
        f"{len(orphans)} 套為孤兒。活系統間樣貌分歧 = 需收斂；孤兒 = 可安全退場",
        rows4,
    )
    return {"blur_rows": rows, "token_systems": rows4}


def main():
    ap = argparse.ArgumentParser(description="萬能樣式 · OmniUI 樣貌稽核")
    ap.add_argument("--json", action="store_true", help="機器可讀輸出")
    args = ap.parse_args()

    if not os.path.isfile(SSOT):
        print(f"[FATAL] 找不到 OmniUI SSOT: {rel(SSOT)}", file=sys.stderr)
        return 2

    gate_ssot_self_consistent()
    gate_aligned_consumers_tokenized()
    audit_repo_once()

    blocking = [f for f in findings if f["level"] == "FAIL"]
    ok = not blocking

    if args.json:
        print(
            json.dumps(
                {
                    "verdict": "OMNIUI_STYLE_OK" if ok else "OMNIUI_STYLE_BLOCKED",
                    "generated_at": datetime.now().isoformat(timespec="seconds"),
                    "findings": findings,
                    "blocking": [f["check"] for f in blocking],
                },
                ensure_ascii=False,
                indent=2,
            )
        )
        return 0 if ok else 1

    print("=" * 72)
    print(f"萬能樣式 · OmniUI 樣貌稽核 · {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"SSOT: {rel(SSOT)}")
    print("=" * 72)
    for f in findings:
        mark = {"PASS": "✓", "WARN": "!", "FAIL": "✗", "INFO": "·"}[f["level"]]
        print(f"[{f['gate']}][{mark}] {f['check']}: {f['detail']}")
        if f["level"] == "FAIL" and f.get("observed") is not None:
            print(f"        觀測值: {json.dumps(f['observed'], ensure_ascii=False)}")
        if f["check"] == "style.blur_drift" and f.get("observed"):
            for r in f["observed"]:
                print(f"        blur {r['blur_px']:>3}px × {r['file_count']} 檔")
        if f["check"] == "style.token_systems" and f.get("observed"):
            for r in f["observed"]:
                tag = "孤兒" if r["kind"].startswith("孤兒") else ("活" if r["declares"] else "無")
                print(
                    f"        [{tag}] {r['token_system']} {r['module']}"
                    f" — {r['consumer_count']} 消費端"
                    + (f"：{', '.join(r['consumers'])}" if r["consumers"] else "")
                )
    print("-" * 72)
    if ok:
        print("判定: [樣貌健全] OMNIUI_STYLE_OK — SSOT 自身一致，已宣告對齊者全數 token 化")
        print("       （A3/A4 為盤點：漂移與併存已量化，未阻擋但不可被敘事掩蓋）")
        print("=" * 72)
        return 0
    print("判定: [樣貌阻擋] OMNIUI_STYLE_BLOCKED")
    for f in blocking:
        print(f"  · 阻擋: [{f['gate']}] {f['check']} — {f['detail']}")
    print("=" * 72)
    return 1


if __name__ == "__main__":
    sys.exit(main())
