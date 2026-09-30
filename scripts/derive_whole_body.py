#!/usr/bin/env python3
"""以「完全體」分類萬能蜂城 —— 不繼承任何既有分法.

與 verify_bee_city.py 的差別：那支的軸來自 SOUL.md 的 5 陣列、
verify_mece12.py 的軸來自我自訂的 12 類，兩者都是「先有分法再套單元」。
本檔反過來：不預設任何類別，直接量測 135 個子單元的實體構成
（只讀檔名與副檔名，不讀內容、不碰憑證值），由構成比例反推應該分幾類。

「體」= 單元的主要物質形態。單元歸入佔比最高的體；
若兩體並列最高則為「併流」（不互斥），如實報出，不硬塞。

用法：python scripts/derive_whole_body.py
"""
from __future__ import annotations

import os
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

# 「完全體」= 實體形態。刻意不引用任何專案文件中的既有分類。
BODIES = {
    "正典體 Canon": {".md", ".mdx", ".rst", ".txt", ".adoc"},
    "執行體 Engine": {".py", ".sh", ".bash", ".ps1", ".bat", ".cmd", ".mjs", ".cjs"},
    "介面體 Interface": {".ts", ".tsx", ".js", ".jsx", ".vue", ".svelte",
                     ".css", ".scss", ".sass", ".less", ".html", ".astro"},
    "資料體 Record": {".json", ".jsonc", ".yaml", ".yml", ".toml", ".sql",
                    ".csv", ".db", ".sqlite", ".sqlite3", ".xml", ".ini", ".env",
                    ".env.example", ".parquet", ".ndjson", ".log", ".lock"},
    "組件體 Component": {".cs", ".csproj", ".sln", ".fs", ".fsproj", ".vb"},
    "資源體 Asset": {".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".ico",
                   ".woff", ".woff2", ".ttf", ".otf", ".mp4", ".mp3", ".pdf"},
}


def classify_ext(name: str) -> str | None:
    p = Path(name)
    # 點開頭的檔（.env / .gitignore）以整名比對；.env.production.example 有三個點，
    # 不能只比副檔名（會得到無意義的 ".example"）。憑證檔只判名稱，不讀內容。
    if p.name.startswith("."):
        key = p.name.lower()
        for body, exts in BODIES.items():
            if key in exts:
                return body
        if key.startswith(".env"):
            return "資料體 Record"
    ext = p.suffix.lower()
    for body, exts in BODIES.items():
        if ext in exts:
            return body
    return None


def measure(unit: str, cap: int = 4000) -> Counter:
    base = ROOT / unit
    c: Counter = Counter()
    n = 0
    # 單元可能是「檔案」（soul.md / MECE.md / agents.yaml / soul-chapter-*.md），
    # 母集合裡這類有 35 個。os.walk 對檔案路徑不迭代，必須先分檔案/目錄。
    if base.is_file():
        body = classify_ext(base.name)
        if body:
            c[body] += 1
        return c
    # os.walk + onerror：node_modules 內有懸空連結（apps/oneringai/node_modules/
    # @google/adk），Path.rglob 會擲 FileNotFoundError。followlinks=False 避免
    # 跟進 junction。憑證檔只數檔名不讀內容。
    def onerr(_e: OSError) -> None:
        return

    for dirpath, dirnames, filenames in os.walk(base, onerror=onerr,
                                                followlinks=False):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        for fn in filenames:
            if n >= cap:
                return c
            body = classify_ext(fn)
            if body:
                c[body] += 1
                n += 1
    return c


def main() -> int:
    units = enumerate_actual()
    print("=== 萬能蜂城「完全體」分類（由實體測量反推）===")
    print("母集合 : %d 個子系統單位" % len(units))
    print("量測方式: 只讀檔名/副檔名，不讀內容，不碰憑證值")
    print()

    assign: dict[str, str] = {}
    ties: list[tuple[str, list[str]]] = []
    empty_units: list[str] = []
    for u in sorted(units):
        c = measure(u)
        if not c:
            empty_units.append(u)
            continue
        top = c.most_common()
        best = top[0][1]
        winners = [b for b, v in top if v == best]
        if len(winners) > 1:
            ties.append((u, winners))
            assign[u] = winners[0]  # 暫記，後續報為不互斥
        else:
            assign[u] = top[0][0]

    groups: dict[str, list[str]] = {}
    for u, b in assign.items():
        groups.setdefault(b, []).append(u)
    for b in groups:
        groups[b].sort()

    total = len(assign)
    tie_n = len(ties)
    print("── 實測出的體（%d 種）──" % len(groups))
    for b in sorted(groups, key=lambda x: -len(groups[x])):
        v = groups[b]
        print("  %-18s %3d 個 (%4.1f%%)  例: %s" % (
            b, len(v), 100.0 * len(v) / total, " / ".join(v[:3])))
    print()

    print("── MECE 驗算 ──")
    print("母集合 %d，量測到構成的 %d，無構成 %d" % (
        total, len(assign), len(empty_units)))
    print("CE 集盡 :", "通過" if not empty_units else "不通過 %s" % empty_units)
    print("空 類   :", "無" if len(groups) == len(BODIES)
          else "有 %d 種體未被量測到（%s）" % (
              len(BODIES) - len(groups),
              [b for b in BODIES if b not in groups]))
    print("ME 互斥 :", "通過" if not tie_n
          else "不通過 %d 個單元有並列最高的體（不互斥）" % tie_n)
    for u, w in sorted(ties):
        print("           併流: %-32s %s" % (u, " / ".join(w)))
    print()

    # 實測教訓：空類原本只印在報告裡、不進 ok，形成「不會紅的閂」——
    # 報告說「有 N 種體未被量測到」但仍印「完全體分類 MECE 成立」。閂必須入帳。
    empty_bodies = [b for b in BODIES if b not in groups]
    ok = not empty_units and not tie_n and not empty_bodies
    print("結論：", "完全體分類 MECE 成立" if ok else "完全體分類有不通過項")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
