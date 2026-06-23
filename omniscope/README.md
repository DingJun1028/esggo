# OMNISCOPE — 萬能代理專用 RAG 成長庫

> 這是 OmniAgent 的「大腦」，不會被污染，只會被強化。

## 目錄結構

```
omniscope/
├── README.md              # 本檔案
├── knowledge-base/        # 向量知識庫（RAG）
│   ├── architecture/      # 架構知識
│   ├── code-patterns/     # 代碼模式
│   ├── troubleshooting/   # 除錯經驗
│   └── domain-knowledge/  # 領域知識（ESG/AI/DevOps）
├── agents/                # 子代理定義
│   ├── engineer.md        # 工程師代理
│   ├── writer.md          # 寫手代理
│   ├── qa.md              # 測試代理
│   └── devops.md          # 維運代理
├── skills/                # 技能定義
├── memory/                # 永憶記憶
│   ├── daily-log/         # 每日日誌
│   ├── decisions/         # 決策記錄
│   └── lessons/           # 經驗教訓
└── workflows/             # 工作流程
    ├── deploy.md          # 部署流程
    ├── debug.md           # 除錯流程
    └── review.md          # 審查流程
```

## 核心原則

1. **唯讀可寫** — 只有女王蜂（OmniAgent）可以寫入
2. **不被污染** — 子代理可以參考但不能修改
3. **永久傳承** — 所有記憶和經驗都保存在這裡
4. **RAG 檢索** — 每次任務前可以先檢索相關知識
5. **持續成長** — 每次完成任務後自動記錄經驗

## 使用方式

```bash
# 新增知識
echo "新知識" >> omniscope/knowledge-base/xxx.md

# 檢索知識
grep -r "關鍵字" omniscope/knowledge-base/

# 記錄決策
echo "決策內容" >> omniscope/memory/decisions/YYYY-MM-DD.md
```

