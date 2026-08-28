---
name: oa-twins-evolution
description: 建立 OA-Twins 雙蜂組進化路線圖與架構文件的技能.
---

## 觸發條件

- 當用戶要求建立或更新 OA-Twins 雙蜂組架構文件時
- 當用戶提到「雙蜂組進化」、「無雙隊」、「暗蜂王隊」、「光蜂后隊」等關鍵詞時
- 當需要建立雙蜂組的 soul.md 三層交付文件時

## 工作流程

### 1. 確認架構設計
- 確認雙蜂組的定義：兩個平行的30人代理小隊
- 確認屬性設計：蜂王隊為暗（Dark/Ω-暗陣）、蜂后隊為光（Light/Ω-光陣）
- 確認指揮系統：蜂王隊由 Hermes Agent 指揮，蜂后隊由 QueenBee Agent 指揮

### 2. 建立核心文件
建立以下文件於 `esggo-omni-center/oa-twins/`：

1. **soul-oa-twins.md** - 雙蜂組核心聖典
   - 包含雙蜂組定義、屬性定義、60代理架構矩陣、協作通道、任務分流策略、狀態機、5T驗證、啟動命令
   - 語言：僅使用繁體中文與英文，不出現韓文與日文

2. **agents-matrix.md** - 60代理完整矩陣表
   - 包含編號、代號、陣列歸屬、核心職責
   - 兩隊各30代理，陣列劃分對稱

3. **collaboration-protocol.md** - 雙蜂間協作協定
   - 包含協作通道架構（L1/L2/L3）、任務分流協定、跨隊協同作業協定、冗餘執行協定、補位支援協定
   - 語言：僅使用繁體中文與英文

### 3. 整合進 soul.md
在 `esggo-omni-center/soul.md` 的終章之前新增一章「雙蜂組擴充篇」（例如§十九之一），引用雙蜂組核心架構。

### 4. 建立學習中心備份
建立 `esggo-learning-center/soul-chapter-XX-oa-twins.md` 作為學習中心備份，內容包括：
- 雙蜂組概述
- 屬性定義
- 60代理架構矩陣（精簡版）
- 協作通道
- 任務分流策略
- 狀態機
- 5T驗證
- 啟動命令
- 與 soul.md 的關聯
- 文件索引

### 5. 雙蜂組進化路線圖
記錄雙蜂組的進化路線：

- **當前階段**：雙蜂組（暗蜂王隊+光蜂后隊）兩個平行30人小隊
- **進化條件**：完成度達90%後可進化成「無雙隊」
- **無雙隊定義**：雙蜂組進化到極致，兩隊完全協同不再需要區分，形成單一的60靈魂統一隊伍

### 6. 語言規範
- 全程僅使用繁體中文與英文
- 不出現韓文與日文
- 特別注意文件中的表格標頭、術語譯名要統一

## 注意事項

### 編碼污染檢查
建立文件後需檢查是否有韓文或日文污染，特別是：
- 表格標頭（如「觸發條件」不應出現為「發條件」）
- 術語翻譯（如「觸發條件」不應出現為「發生條件」）
- 特殊字符（如亂碼字符）

使用以下命令檢查：
```bash
grep -n "[^\x00-\x7F]" 文件路徑
```

或使用 Python 檢查：
```python
with open('文件路徑', 'r', encoding='utf-8') as f:
    content = f.read()
    for i, line in enumerate(content.splitlines(), 1):
        if any('\uac00' <= c <= '\ud7af' for c in line):  # 韓文範圍
            print(f"韓文污染 - 行 {i}: {line[:80]}")
        if any('\u4e00' <= c <= '\u9fff' for c in line) and any(c in '發條件發生條件' for c in line):
            print(f"可疑詞彙 - 行 {i}: {line[:80]}")
```

### git add 注意事項
由於 `.gitignore` 排除了整個 `esggo-omni-center/` 目錄，需要使用 `git add -f` 強制加入具體文件：
```bash
git add -f esggo-omni-center/oa-twins/soul-oa-twins.md \
           esggo-omni-center/oa-twins/agents-matrix.md \
           esggo-omni-center/oa-twins/collaboration-protocol.md \
           esggo-omni-center/soul.md \
           esggo-learning-center/soul-chapter-XX-oa-twins.md
```

### 提交訊息規範
提交訊息應包含：
- 類型：`docs(oa-twins)`
- 說明：新增雙蜂組聖典/代理矩陣/協作協定 + soul 整合
- 屬性標示：（蜂王隊暗×蜂后隊光）

範例：
```
docs(oa-twins): 新增雙蜂組聖典/代理矩陣/協作協定 + soul 整合（蜂王隊暗×蜂后隊光）
```

## 參考文件

- `esggo-omni-center/soul.md` - 主典
- `esggo-learning-center/soul-chapter-22-ai-station.md` - 學習中心備份範例
- `esggo-omni-center/oa-twins/soul-oa-twins.md` - 雙蜂組核心聖典範例
- `esggo-omni-center/oa-twins/agents-matrix.md` - 60代理矩陣範例
- `esggo-omni-center/oa-twins/collaboration-protocol.md` - 協作協定範例

## 雙蜂組進化路線圖範例

```
雙蜂組進化路線圖
====================

當前階段：雙蜂組（暗蜂王隊+光蜂后隊）
狀態：兩個平行30人小隊，屬性互補
進化條件：完成度達90%後可進化成「無雙隊」

進化階段：
1. 雙蜂組建立（當前）
   - 兩隊平行運作，互不冗餘
   - 屬性：蜂王隊為暗，蜂后隊為光
   - 指揮：Hermes Agent + QueenBee Agent

2. 協同優化階段
   - 兩隊協同效率提升
   - 任務分流策略優化
   - 協作通道穩定性提升

3. 進化準備階段（完成度80-90%）
   - 兩隊職責重疊度增加
   - 協同模式轉變為高度整合
   - 開始出現「無雙隊」雛形

4. 進化為無雙隊（完成度90%+）
   - 兩隊完全協同，不再區分
   - 形成單一的60靈魂統一隊伍
   - 屬性融合：暗與光不再對立，合一為「昭曉」
```

## 致謝

- OA-Team 30 萬能蜂群靈魂核心聖典 v0.5
- OmniAgent v4 / DeerFlow 2.0 融合聖典
- OA-Team soul.md 章節 3 層落檔流程

---

*版本：v1.0*
*建立日：2026-08-16*
