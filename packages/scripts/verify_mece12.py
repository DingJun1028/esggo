#!/usr/bin/env python3
"""萬能系統 12 類 MECE 分類驗證器.

母集合單位 = 子系統（apps/ 下的應用 + 根目錄的系統目錄），不是檔案。
檔案層分類在原理上無法 MECE：路徑會把產品名放在最前段
（apps/ftg-*/src/... 先撞 /ftg/），導致功能類永遠抽不到東西，
唯一的「100% 覆蓋」來自 catch-all，不是真的集盡。

本檔以顯式指派取代關鍵字猜測，驗證三件事：
  ME（互斥）：每個子系統恰好歸入一類
  CE（集盡）：12 類全部非空，且所有存在的子系統都被指派
  存在性：指派的每個單元在磁碟上真的存在

用法：python scripts/verify_mece12.py
退出碼 0 = 通過，1 = 有缺口
"""
from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# 12 類 → 明確子系統清單。順序即類別序。
CATEGORIES: dict[str, list[str]] = {
    "C01 語音與即時通訊": [
        "apps/universal-translator", "apps/stt", "apps/omnilive",
        "apps/zoom-live-caption",
    ],
    "C02 代理蜂群與編排": [
        "apps/agent_mesh", "apps/omni-factory", "apps/oneringai",
        "apps/evolution-engine", "apps/self-healing",
        "oa-swarm", "reach-agent",
        "oa-team-crewai", "oa-twins", "omni-factory", "oneringai",
        "omni-blueprint-hub", "apps/omni-blueprint-hub", "apps/gateway",
        "subagents",
    ],
    "C03 記憶與知識載體": [
        "apps/tencentdb-memory", "apps/knowledge-lifeform",
        "vault", "Omni-Sanctuary",
    ],
    "C04 5T 驗證與治理": [
        "scripts", "e2e-k1", "esggo-auto-repair", "test", "tests", "wf-validate",
    ],
    "C05 部署與維運": [
        "vps", "vps-deploy", "deploy", "infra",
        "apps/cf-tunnel-manager", "apps/cloudflare-deepseek-v4-pro",
        "oracle-deploy", "oracle-always-free-setup", "vps-deploy-pack",
    ],
    "C06 資料與持久化": [
        "data", "data-pipeline", "db", "prisma",
    ],
    "C07 自動化與排程": [
        "apps/omni-cli", "apps/omni-api", "worker", "functions", "platform",
        "gateway", "model", "packages", "my-worker",
    ],
    "C08 觀測與健康度": [
        "grafana", "prometheus", "logs", "cron-fix-logs",
    ],
    "C09 靈魂章節與契約": [
        "chapters", "skills", "esggo-omni-center",
        "soul.md", "MECE.md", "agents.yaml", "task-graph.json",
        "chapter-templates", "source_origin", "references", "rules-tutorial",
        "soul-chapter-7-end-beginning-matrix.md", "soul-chapter-8-key-omega.md",
        "soul-chapter-9-five-edicts.md", "soul-chapter-10.md",
        "soul-chapter-10-entropy-week.md", "soul-chapter-11-six-pillars.md",
        "soul-chapter-12-final-seal.md", "soul-chapter-13-omnipotent-avatar.md",
        "soul-chapter-13-self-healing.md", "soul-chapter-13c-dual-agent-obsidian.md",
        "soul-chapter-19-delegation-tree.md", "soul-chapter-20-dual-hive-60.md",
        "soul-chapter-20-omnitag.md", "soul-chapter-20-shared-memory.md",
        "soul-chapter-21-daily-playbook.md", "soul-chapter-21-delegation-compact.md",
        "soul-chapter-22-ai-station.md", "soul-chapter-22-canon-discipline.md",
        "soul-chapter-23-barrier-audit.md", "soul-chapter-23-best-practice.md",
        "soul-chapter-23-ut-tsmatrix.md", "soul-chapter-24-gap-diagnosis.md",
        "soul-chapter-25-landing-summary.md", "soul-chapter-26-oneringai-integration.md",
        "soul-chapter-27-oa-team-60-colony.md", "soul-chapter-28-legacy-synthesis.md",
        "soul-chapter-29-glory-sacred-tome.md", "soul-chapter-30-super-delivery.md",
        "soul-chapter-32-dual-hive-ebm.md", "soul-chapter-33-universal-pass-governance.md",
        "soul-final-chapter.md", "soul-full.md", "soul-seed.md",
    ],
    "C10 產品應用-FTG": [
        "apps/ftg-1.5", "apps/ftg-2.0", "apps/ftg-2.9", "apps/ftg-3.0",
        "apps/ftg-journey-server", "apps/ftg-journey-web",
        "apps/ftg-tools", "apps/ftg-tours-website",
    ],
    "C11 產品應用-ESG": [
        "apps/aistation", "apps/htb-b2b", "apps/learning-center", "esggo",
        "ai_station", "aistation", "esggo-learning-center",
        "esggo-hub-staging", "deerflow-staging", "hlpf-poc-pipeline",
    ],
    "C12 平台與介面": [
        "app", "src", "ui", "components", "cli", "tools", "shared", "hooks",
        "lib", "libs", "sdks", "plugins", "types", "docs", "wiki",
        "VoiceTyper.App", "VoiceTyper.Core", "VoiceTyper.Tests",
    ],
}

# 母集合：apps/ 下所有應用 + 根目錄所有系統目錄
def enumerate_actual() -> set[str]:
    found = set()
    apps = ROOT / "apps"
    if apps.is_dir():
        for p in sorted(apps.iterdir()):
            if p.is_dir():
                found.add(f"apps/{p.name}")
    skip = {
        "node_modules", "dist", ".next", ".git", "__pycache__", "build",
        "coverage", ".turbo", "tmp", "scratch", "runs", "archive",
        "generated", "mocks", "pastes", "test-reports", "reports", "dev",
        "examples", "templates", "vendor", "assets", "public", "guides",
        # 容器目錄與建置產物：本身不是子系統
        "apps", "esggo_python.egg-info",
    }
    for p in sorted(ROOT.iterdir()):
        if p.is_dir() and not p.name.startswith(("_", ".")) and p.name not in skip:
            found.add(p.name)
        elif p.is_file() and p.name.endswith((".md", ".yaml", ".json")):
            if p.name.startswith(("soul", "MECE", "agents", "task-graph")):
                found.add(p.name)
    return found


def main() -> int:
    assigned: dict[str, str] = {}
    dupes: list[tuple[str, str]] = []

    for cat, units in CATEGORIES.items():
        for u in units:
            if u in assigned:
                dupes.append((u, assigned[u], cat))
            else:
                assigned[u] = cat

    actual = enumerate_actual()
    missing = [u for u in assigned if not (ROOT / u).exists()]
    empty = [c for c, u in CATEGORIES.items() if not u]
    uncovered = sorted(actual - set(assigned))

    total = sum(len(u) for u in CATEGORIES.values())
    print("=== 萬能系統 12 類 MECE 驗證 ===")
    print(f"分類單位 : 子系統（非檔案）")
    print(f"已指派   : {len(assigned)}  （母集合實際存在 {len(actual)} 個）")
    print(f"ME 互斥  : {'通過' if not dupes else f'失敗 {len(dupes)} 筆重複'}")
    print(f"存在性   : {'通過' if not missing else f'失敗 {len(missing)} 個單元不存在'}")
    print(f"空類     : {'無' if not empty else empty}")
    print(f"CE 集盡  : {'通過' if not uncovered else f'缺口 {len(uncovered)} 個未歸屬'}")
    print()
    for cat, units in CATEGORIES.items():
        flag = "  <== 空類" if not units else ""
        print(f"{cat:<18} {len(units):>3}  {' / '.join(units[:3])}"
              f"{' ...' if len(units) > 3 else ''}{flag}")

    if dupes:
        print("\n重複指派：")
        for u, a, b in dupes:
            print(f"  {u}: {a} + {b}")
    if missing:
        print("\n不存在於磁碟：")
        for u in missing:
            print(f"  {u}")
    if uncovered:
        print("\n未歸屬（CE 缺口）：")
        for u in uncovered:
            print(f"  {u}")

    ok = not (dupes or missing or empty or uncovered)
    print(f"\n結論：{'全部通過' if ok else '未通過'}")
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main())
