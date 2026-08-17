# OA-Team 60 代理 ↔ MemoryHub 資產對應總表（雙蜂隊 + 暗光雙屬性）
#
# 蜂王 01-30 (OA-LOCAL / Windows / 光系蜂后轄地) + 蜂后 31-60 (OA-VPS / 生產 / 暗系蜂王轄地)
# 每代理固定：
#   - 編號 01-60
#   - 陣列（智庫/符文/光翼/煉金/5T）
#   - MemoryAssetKind + visibility（對齊 tencent-mem.ts）
#   - alignment: umbra（暗系）| lumen（光系）
#   - archetype: 本代理的暗/光屬性標籤
#
# 雙屬性總綱：
#   光系蜂后（31-60 的本質靈性）：lumen — 創造、啟示、淨化、揭露
#   暗系蜂王（01-30 的隱形治理）：umbra — 潛行、觀察、隱蔽、滲透
#   每位代理同時具備 umbra + lumen 兩面，但主属性決定 MemoryHub 的
#   visibility 預設值與資產路由分區。

## 屬性定義

| 屬性 | 代號 | 核心質性 | 代表色 | 對應陣列偏向 |
|------|------|----------|--------|--------------|
| 光系 (Lumen) | `lumen` | 啟示·創造·淨化·揭露 | 暖金 #c9a24b | 智庫聖所、光之羽翼、5T 驗算 |
| 暗系 (Umbra) | `umbra` | 潛行·觀察·隱蔽·滲透 | 深藍 #10243f | 符文契約、煉金熵減、安全維運 |

## 五陣列總表

| 陣列 | 職能 | 資產類別 | visibility | 主屬性 |
|------|------|----------|------------|--------|
| 智庫聖所 | 長短期記憶召回、向量知識沉澆、脈絡提純 | chat_memory + wiki | team | lumen |
| 符文契約 | API 鑄造、雙向 TS、ZKP 隱私 | skill + wiki | restricted | umbra |
| 光之羽翼 | 背景 Task、ADK 調度、Bento 渲染、Live 轉播 | skill + wiki | team | lumen |
| 煉金熵減 | 重構、效能監控、CI/CD Pipeline | codegraph + skill | agent | umbra |
| 5T 驗算 | ISO 規範、Hash 鎖定、UUID 發放 | wiki + codegraph | restricted | lumen |

---

## 蜂王 OA-LOCAL (01-30) — 暗系蜂王治理層

> 暗系蜂王：以深藍 #10243f 為印記，主導本地 Windows 開發端的隱形治理。
> 其代理主屬性多為 umbra，僅智庫聖所與 5T 驗算走 lumen（光明記憶與潔淨驗算）。

### 智庫聖所 (01-06) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 01 | 萬能蜂后 | lumen | 光明 Sovereign | wiki | restricted | 戰略記憶庫（5T 公約落庫） |
| 02 | 萬能規劃蜂 | lumen | 預言 Architect | chat_memory | team | 長短期規劃脈絡 |
| 03 | 萬能分析蜂 | lumen | 透視 Oracle | chat_memory | team | 數據洞察會話 |
| 04 | 萬能策効蜂 | lumen | 創藝 Muse | wiki | team | 方案資產沉澆 |
| 05 | 萬能風險蜂 | lumen | 審判 Sentinel | chat_memory | team | 風險事件會話 |
| 06 | 萬能優化蜂 | lumen | 煉金 Alchemist | codegraph | agent | 流程熵減追蹤 |

### 符文契約 (07-12) — umbra

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 07 | 萬能編碼蜂 | umbra | 鑄造 Smith | skill | restricted | API 鑄造技能 |
| 08 | 萬能算法蜂 | umbra | 深算 Depth | skill | restricted | LLM/ML pipeline 技能 |
| 09 | 萬能架構蜂 | umbra | 框架 Architect | wiki | restricted | 系統設計資產 |
| 10 | 萬能數據蜂 | umbra | 脈絡 Weaver | codegraph | agent | 資料庫 schema/pipe 圖譜 |
| 11 | 萬能測試蜂 | umbra | 裂縫 Seer | skill | agent | 自動化測試步驟 |
| 12 | 萬能設計蜂 | umbra | 幻形 Shaper | wiki | team | UI/UX 設計規範 |

### 光之羽翼 (13-18) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 13 | 萬能圖像蜂 | lumen | 畫筆 Painter | skill | team | 品牌視覺生成技能 |
| 14 | 萬能動畫蜂 | lumen | 流動 Flow | skill | team | 動態特效/字幕技能 |
| 15 | 萬能文案蜂 | lumen | 敘事 Narrator | wiki | team | 腳本 DNA 模板 |
| 16 | 萬能音頻蜂 | lumen | 共鳴 Resonator | skill | team | TTS/語音合成技能 |
| 17 | 萬能市場蜂 | lumen | 號角 Herald | wiki | team | 行銷策略資產 |
| 18 | 萬能社群蜂 | lumen | 橋梁 Bridger | chat_memory | team | 社群互動脈絡 |

### 煉金熵減 (19-24) — umbra

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 19 | 萬能增長蜂 | umbra | 侵蝕 Erode | codegraph | agent | 增長指標監控圖譜 |
| 20 | 萬能運營蜂 | umbra | 樞紐 Nexus | codegraph | agent | 專案流程圖譜 |
| 21 | 萬能商業分析蜂 | umbra | 剝皮 Skinner | chat_memory | team | 商業洞察會話 |
| 22 | 萬能探路蜂 | umbra | 先鋒 Scout | wiki | team | 資源探索筆記 |
| 23 | 萬能外交蜂 | umbra | 魅影 Wraith | wiki | restricted | 合作協議資產 |
| 24 | 萬能調研蜂 | umbra | 透視 Lens | chat_memory | team | 用戶調研會話 |

### 5T 驗算 (25-30) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 25 | 萬能測場蜂 | lumen | 淨化 Purifier | chat_memory | team | 現場回饋會話 |
| 26 | 萬能追蹤蜂 | lumen | 鷹眼 Hawk | codegraph | agent | 競品監控追蹤圖譜 |
| 27 | 萬能安全蜂 | lumen | 戒律 Ward | wiki | restricted | 資安規範資產 |
| 28 | 萬能維護蜂 | lumen | 養護 Curator | skill | agent | 維運腳本/步驟 |
| 29 | 萬能支援蜂 | lumen | 回聲 Echo | skill | agent | 技術支援 SOP |
| 30 | 萬能質控蜂 | lumen | 印章 Seal | wiki | restricted | 品質標準/驗證規則 |

---

## 蜂后 OA-VPS (31-60) — 光系蜂后治理層

> 光系蜂后：以暖金 #c9a24b 為印記，主導 VPS 生產端的啟示與創造。
> 其代理主屬性多為 lumen，僅符文契約與煉金熵減走 umbra（深算與滲透）。

### 智庫聖所 (31-36) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 31 | 蜂后萬能蜂后 | lumen |  Sovereign | wiki | restricted | VPS 戰略記憶庫 |
| 32 | 蜂后萬能規劃蜂 | lumen |  Architect | chat_memory | team | VPS 長程規劃脈絡 |
| 33 | 蜂后萬能分析蜂 | lumen |  Oracle | chat_memory | team | VPS 數據洞察會話 |
| 34 | 蜂后萬能策効蜂 | lumen |  Muse | wiki | team | VPS 方案資產 |
| 35 | 蜂后萬能風險蜂 | lumen |  Sentinel | chat_memory | team | VPS 風險事件會話 |
| 36 | 蜂后萬能優化蜂 | lumen |  Alchemist | codegraph | agent | VPS 熵減追蹤 |

### 符文契約 (37-42) — umbra

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 37 | 蜂后萬能編碼蜂 | umbra |  Smith | skill | restricted | VPS API 鑄造技能 |
| 38 | 蜂后萬能算法蜂 | umbra |  Depth | skill | restricted | VPS LLM pipeline 技能 |
| 39 | 蜂后萬能架構蜂 | umbra |  Architect | wiki | restricted | VPS 系統設計資產 |
| 40 | 蜂后萬能數據蜂 | umbra |  Weaver | codegraph | agent | VPS DB/pipe 圖譜 |
| 41 | 蜂后萬能測試蜂 | umbra |  Seer | skill | agent | VPS 自動化測試步驟 |
| 42 | 蜂后萬能設計蜂 | umbra |  Shaper | wiki | team | VPS UI 設計規範 |

### 光之羽翼 (43-48) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 43 | 蜂后萬能圖像蜂 | lumen |  Painter | skill | team | VPS 視覺生成技能 |
| 44 | 蜂后萬能動畫蜂 | lumen |  Flow | skill | team | VPS 動態特效技能 |
| 45 | 蜂后萬能文案蜂 | lumen |  Narrator | wiki | team | VPS 文案模板 |
| 46 | 蜂后萬能音頻蜂 | lumen |  Resonator | skill | team | VPS TTS 技能 |
| 47 | 蜂后萬能市場蜂 | lumen |  Herald | wiki | team | VPS 行銷資產 |
| 48 | 蜂后萬能社群蜂 | lumen |  Bridger | chat_memory | team | VPS 社群脈絡 |

### 煉金熵減 (49-54) — umbra

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 49 | 蜂后萬能增長蜂 | umbra |  Erode | codegraph | agent | VPS 增長監控圖譜 |
| 50 | 蜂后萬能運營蜂 | umbra |  Nexus | codegraph | agent | VPS 運營流程圖譜 |
| 51 | 蜂后萬能商業分析蜂 | umbra |  Skinner | chat_memory | team | VPS 商業洞察會話 |
| 52 | 蜂后萬能探路蜂 | umbra |  Scout | wiki | team | VPS 探索筆記 |
| 53 | 蜂后萬能外交蜂 | umbra |  Wraith | wiki | restricted | VPS 合作協議資產 |
| 54 | 蜂后萬能調研蜂 | umbra |  Lens | chat_memory | team | VPS 用戶調研會話 |

### 5T 驗算 (55-60) — lumen

| 編號 | 代理 | alignment | archetype | 資產類別 | visibility | 說明 |
|------|------|-----------|-----------|----------|------------|------|
| 55 | 蜂后萬能測場蜂 | lumen |  Purifier | chat_memory | team | VPS 現場回饋會話 |
| 56 | 蜂后萬能追蹤蜂 | lumen |  Hawk | codegraph | agent | VPS 競品追蹤圖譜 |
| 57 | 蜂后萬能安全蜂 | lumen |  Ward | wiki | restricted | VPS 資安規範資產 |
| 58 | 蜂后萬能維護蜂 | lumen |  Curator | skill | agent | VPS 維運 SOP |
| 59 | 蜂后萬能支援蜂 | lumen |  Echo | skill | agent | VPS 技術支援步驟 |
| 60 | 蜂后萬能質控蜂 | lumen |  Seal | wiki | restricted | VPS 品質標準資產 |

---

## 雙屬性路由規則

1. **資產路由分區**：
   - `alignment=lumen` → 優先寫入 MemoryHub 的 `/api/assets?tag=lumen`
   - `alignment=umbra` → 優先寫入 MemoryHub 的 `/api/assets?tag=umbra`
2. **visibility 繼承主屬性**：
   - lumen 代理預設 `team` 或 `restricted`（開放共享）
   - umbra 代理預設 `agent` 或 `restricted`（限制擴散）
3. **雙蜂隊共用同一 core**：`serviceId=oa-team-swarm`，但 `ownerAgent` 區分 01-30 / 31-60
4. **暗光共鳴**：同 `session_key` 內，umbra 寫入的 codegraph 可被 lumen 代理召回用於 wiki 沉澆

## 使用方式

1. 依編號查上表取得代理的 `alignment` + `archetype` + `MemoryAssetKind`
2. 呼叫 `tencent-mem.ts` 的 `saveAsset({ kind, title, content, visibility, ownerAgent, team, alignment, archetype })`
3. 雙蜂隊共用 `memory.esggo.co/gateway/` 共享長期記憶
