#!/usr/bin/env python3
"""萬能蜂城 MECE 分類驗證器 —— 以萬能蜂群架構為分類軸.

母集合 = 萬能蜂城 = 135 個子系統單位（沿用 verify_mece12 已驗證的枚舉），
與檔案層分類不同：路徑會讓產品名先命中（apps/ftg-*/src/ 先撞 /ftg/），
功能軸永遠抽不到東西，唯一的 100% 覆蓋來自 catch-all。

分類軸 = SOUL.md 第 33 行定義的「5 大核心陣列，每陣列 6 位專精代理」：
    策略組 01-06 / 技術組 07-12 / 創意組 13-18 / 營銷組 19-24 / 守衛組 25-30
陣列歸屬依據 MECE.md 的「負責陣列」欄；無對應者以職能實測判定並在 EV 中標示。

用法：python scripts/verify_bee_city.py
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from verify_mece12 import enumerate_actual  # noqa: E402  母集合來源

ROOT = Path(__file__).resolve().parent.parent

# ── 5 大核心陣列（SOUL.md:33）──
ARRAYS = {
    "策略組 01-06": (
        "01 萬能蜂后 戰略總覽 | 02 規劃蜂 長遠規劃 | 03 分析蜂 數據挖掘 | "
        "04 策効蜂 創意思維 | 05 風險蜂 風險控制 | 06 優化蜂 流程重組"
    ),
    "技術組 07-12": (
        "07 編碼蜂 全端開發 | 08 算法蜂 機器學習 | 09 架構蜂 雲端架構 | "
        "10 數據蜂 資料庫 | 11 測試蜂 自動化測試 | 12 設計蜂 UI/UX"
    ),
    "創意組 13-18": (
        "13 圖像蜂 平面設計 | 14 動畫蜂 動畫特效 | 15 文案蜂 文案撰寫 | "
        "16 音頻蜂 音樂製作 | 17 市場蜂 市場推廣 | 18 社群蜂 社群建設"
    ),
    "營銷組 19-24": (
        "19 增長蜂 用戶增長 | 20 運營蜂 進度管理 | 21 商業分析蜂 商業洞察 | "
        "22 探路蜂 資源探索 | 23 外交蜂 合作關係 | 24 調研蜂 用戶研究"
    ),
    "守衛組 25-30": (
        "25 測場蜂 現場測評 | 26 追蹤蜂 競品監控 | 27 安全蜂 資安防護 | "
        "28 維護蜂 系統維護 | 29 支援蜂 技術支援 | 30 質控蜂 品質保障"
    ),
}

# ── MECE.md 12 支柱（附負責陣列；覺醒/矩陣標示「全體」）──
PILLARS = {
    "5T 協議":   "守衛組", "HMAC 守門": "守衛組", "OmniTag": "守衛組",
    "VPS 部署":  "創意組", "Zenrows":   "技術組", "Health":  "技術組",
    "n8n":       "營銷組", "熵減":      "營銷組", "治理":    "策略組",
    "結界":      "策略組", "覺醒":      "全體",   "矩陣":    "全體",
}

# ── 135 個子系統 → 陣列 ──
ASSIGN = {
    "策略組 01-06": [
        "apps/agent_mesh", "apps/omni-factory", "apps/oneringai",
        "apps/evolution-engine", "apps/self-healing", "oa-swarm", "reach-agent",
        "oa-team-crewai", "oa-twins", "omni-factory", "oneringai",
        "omni-blueprint-hub", "apps/omni-blueprint-hub", "apps/gateway",
        "subagents", "chapters", "skills", "esggo-omni-center",
        "wiki", "docs", "rules-tutorial", "chapter-templates", "source_origin",
        "references", "MECE.md", "soul.md", "soul-final-chapter.md",
        "soul-full.md", "soul-seed.md", "Omni-Sanctuary", "vault",
        "agents.yaml", "task-graph.json",
        # soul-chapter-*.md 為 30 人蜂群正典，歸策略組（治理/結界，MECE.md Ch.09/Ch.10）
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
        "soul-chapter-32-dual-hive-ebm.md",
        "soul-chapter-33-universal-pass-governance.md",
    ],
    "技術組 07-12": [
        "apps/universal-translator", "apps/stt", "apps/omnilive",
        "apps/zoom-live-caption", "apps/tencentdb-memory", "apps/knowledge-lifeform",
        "vps", "vps-deploy", "deploy", "infra", "apps/cf-tunnel-manager",
        "apps/cloudflare-deepseek-v4-pro", "oracle-deploy", "oracle-always-free-setup",
        "vps-deploy-pack", "data", "data-pipeline", "db", "prisma",
        "grafana", "prometheus", "logs", "app", "src", "ui", "components", "cli",
        "types", "hooks", "lib", "libs", "sdks",
        "VoiceTyper.App", "VoiceTyper.Core", "VoiceTyper.Tests",
        "platform", "shared", "tools",
    ],
    "創意組 13-18": [
        "apps/ftg-1.5", "apps/ftg-2.0", "apps/ftg-2.9", "apps/ftg-3.0",
        "apps/ftg-journey-server", "apps/ftg-journey-web", "apps/ftg-tools",
        "apps/ftg-tours-website", "apps/aistation", "apps/htb-b2b",
        "apps/learning-center", "ai_station", "aistation",
        "esggo-learning-center", "esggo-hub-staging", "deerflow-staging",
        "hlpf-poc-pipeline", "esggo", "plugins",
    ],
    "營銷組 19-24": [
        "apps/omni-cli", "apps/omni-api", "worker", "functions", "gateway",
        "model", "packages", "my-worker", "cron-fix-logs",
    ],
    "守衛組 25-30": [
        "scripts", "e2e-k1", "esggo-auto-repair", "test", "tests", "wf-validate",
    ],
}

# ── 子系統 → MECE.md 支柱（僅在支柱確實涵蓋該子系統時登錄）──
PILLAR_MAP = {
    "守衛組 25-30": {"scripts", "esggo-auto-repair", "e2e-k1", "tests",
                     "test", "wf-validate"},
    "技術組 07-12": {"grafana", "prometheus", "logs", "data-pipeline", "data",
                     "db", "prisma", "vps", "vps-deploy", "deploy", "infra",
                     "apps/cf-tunnel-manager", "apps/universal-translator",
                     "apps/stt", "apps/omnilive", "apps/zoom-live-caption"},
    "創意組 13-18": {"vps-deploy-pack", "oracle-deploy"},
    "營銷組 19-24": {"model", "packages", "worker", "my-worker"},
    "策略組 01-06": {"chapters", "task-graph.json", "MECE.md", "agents.yaml",
                     "skills", "esggo-omni-center", "wiki", "docs",
                     "omni-blueprint-hub", "apps/omni-blueprint-hub"},
}


def main() -> int:
    actual = enumerate_actual()
    assigned = [u for v in ASSIGN.values() for u in v]

    print("=== 萬能蜂城 MECE 分類驗證 ===")
    print("分類軸 : 萬能蜂群 5 大核心陣列（SOUL.md:33）")
    print("母集合 : 萬能蜂城 = %d 個子系統單位" % len(actual))
    print("已指派 : %d" % len(assigned))

    dupes = sorted({u for u in assigned if assigned.count(u) > 1})
    missing = sorted(set(assigned) - actual)
    uncovered = sorted(set(actual) - set(assigned))
    ghost = [u for u in assigned if not (ROOT / u).exists()]
    empties = [a for a, v in ASSIGN.items() if not v]

    print("ME 互斥 :", "通過" if not dupes else "不通過 重複=%s" % dupes)
    print("存在性  :", "通過" if not missing and not ghost
          else "不通過 未在母集合=%s 磁盤不存在=%s" % (missing, ghost))
    print("空 類   :", "無" if not empties else "不通過 %s" % empties)
    print("CE 集盡 :", "通過" if not uncovered
          else "不通過 %d 個未歸屬" % len(uncovered))
    if uncovered:
        for u in uncovered:
            print("           未歸屬:", u)

    print()
    print("── 5 陣列分布（每陣列 6 位專精代理）──")
    for name, agents in ARRAYS.items():
        units = ASSIGN.get(name, [])
        print("%-14s %3d 個子系統  ← %s" % (name, len(units), agents[:34] + "…"))

    print()
    print("── MECE.md 12 支柱 × 負責陣列：覆蓋率實測 ──")
    pillar_hits = {p: set() for p in PILLARS}
    for arr, units in PILLAR_MAP.items():
        for u in units:
            for p, owner in PILLARS.items():
                if owner in ("全體", arr.split()[0]):
                    pillar_hits[p].add(u)
                    break
    covered = set().union(*pillar_hits.values()) if pillar_hits else set()
    for p, owner in PILLARS.items():
        print("  %-10s 負責=%-8s 命中 %3d 個子系統" % (p, owner, len(pillar_hits[p])))
    print("  支柱命中合計 %d / %d = %.1f%%" % (len(covered), len(actual),
                                              100.0 * len(covered) / len(actual)))
    print("  支柱未命中 %d 個（12 支柱描述的是蜂群運作協定，非子系統清單）"
          % (len(actual) - len(covered)))

    ok = not (dupes or missing or ghost or empties or uncovered)
    print()
    print("結論：", "陣列層全部通過" if ok else "陣列層有不通過項")
    return 0 if ok else 1


if __name__ == "__main__":
    raise SystemExit(main())
