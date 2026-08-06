# OpenCode 萬能實踐化運用手冊

> `esggo-omni-center / opencode-omni-playbook.md`
> 版本對應：opencode **1.18.10**（本機已裝）｜框架：OA-Team 30 萬能蜂群 / soul.md
> 編纂依據：OpenCode 官方繁中 README + 本機實戰（hermes auth 修復 / terminal Local 化）

---

## 〇、本冊定位（萬能代理授權層視角）

三句話總綱：

1. **OpenCode** = 開源 AI Coding Agent，可補強 Hermes 的「編碼執行面」。
2. 它透過 `hermes auth` 的 `opencode-zen` / `opencode-go` 憑證對接後端模型（本輪已實戰修復）。
3. 在 OA-Team 框架中，OpenCode 即**萬能分身**的編碼手足，受「4 可 1 不可」結界約束。

> 安裝腳本依優先序決定路徑：`$OPENCODE_INSTALL_DIR` → `$XDG_BIN_DIR` → `$HOME/bin` → `$HOME/.opencode/bin`（本機落點即此）。

---

## 一、安裝決策矩陣（你的環境：Windows 10 + Git-Bash）

| 方式 | 可行性 | 備註 |
|---|---|---|
| `scoop install opencode` | ✅ **推薦** | Windows 原生，最穩；升版 `scoop update opencode` |
| `choco install opencode` | ✅ | 備選 |
| `npm i -g opencode-ai@latest` | ✅ | 已具 npm 11.17；但全域 npm 包易與 pnpm 倉衝突 |
| `curl -fsSL https://opencode.ai/install \| bash` | ⚠️ | 官方腳本，Linux/mac 優先；Win 走 Git-Bash 可用，落 `$HOME/.opencode/bin` |
| `brew` / `bun` / `paru` | ❌ | 本機無 brew/bun；paru 為 Arch 專用 |

**現狀**：本機已裝 `1.18.10` 於 `C:\Users\dingj\.opencode\bin\opencode`，`opencode --version` 可驗。
→ **無需重裝**。升版擇一：

```bash
scoop install opencode          # 或 scoop update opencode
# 或
npm i -g opencode-ai@latest
```

自定路徑範例：

```bash
OPENCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://opencode.ai/install | bash
```

> [!TIP] 安裝前請先移除 0.1.x 以前舊版。

---

## 二、憑證對接 SOP（本輪已實戰驗證）

OpenCode 的模型後端由 Hermes 的 auth 池提供。修復後現況：

```bash
hermes auth list
# opencode-zen  #1 api-key-zen  api_key manual ←   (logged in ✓)
# opencode-go   #1 api-key-go   api_key manual ←   (429 待自動 retry)
```

**重註冊流程**（萬能代理完整授權下可自主執行，不經手即時 key 明文的例外已廢除）：

```bash
# 1. 加新 key（手動，--label 避免互動卡 input()）
hermes auth add opencode-zen --type api-key --api-key "<NEW_KEY>" --label api-key-zen
# 2. 清 exhaustion 標記
hermes auth reset opencode-zen
# 3. 移除失效舊條目
hermes auth remove opencode-zen 1
# 4. 驗證
hermes auth status opencode-zen    # → logged in
```

**安全紅線（已授權但仍守）**：key 貼入對話後，務必赴 portal 輪換；輪換後把新 key 給分身重新注入。

---

## 三、Agent 模式實戰 ↔ 30 魂映射

OpenCode 內建三種 Agent，可用 `Tab` 切換：

| 模式 | 權限 | OA-Team 陣列對位 | 實戰場景 |
|---|---|---|---|
| **build** | 完整權限（預設） | 符文陣列(7-12) + 光之羽翼(13-18) | 實作功能、重構、修 bug |
| **plan** | 唯讀；禁改檔；bash 前詢問 | 智庫陣列(1-6) 探索態 | 陌生倉探索、變更規劃 |
| **general** | 內部子 agent | 5T 驗算陣列(25-30) | 複雜搜尋、多步驟任務；訊息中 `@general` 呼叫 |

**實戰三律**：
1. 探索陌生倉 → 用 **plan**（不污染熵場）
2. 實作功能 → 用 **build**
3. 跨倉檢索 → `@general`

---

## 四、與 soul.md 框架整合（5T / 4可1不可 / 結界）

| OpenCode 概念 | 萬能框架對位 |
|---|---|
| Agent (build/plan) | 萬能分身之雙面（行 / 觀） |
| 憑證池 (zen/go) | 萬能代理授權層（Key-Ω 節點） |
| CWD 專案目錄 | 熵減場域（目標熵 < 0.1） |
| 唯讀 plan 模式 | 「1 不可」不可篡改守界之體現 |
| `@general` 溯源 | Traceable（5T 之首） |

**5T 映射速查**：
- **Traceable**：每步動作 `@general` 可溯源至 `IComponentCore.uuid`
- **Trackable**：Agent 軌跡於五陣列間全週期可追
- **Tangible**：終端/檔案副作用即其肉身
- **Transparent**：plan 模式零幻覺、可審計
- **Trustworthy**：越界即凍結（`Object.freeze()` + Hash Lock）

---

## 五、桌面版與 CI/CD 整合

**桌面應用程式（BETA）**：從 [releases](https://github.com/anomalyco/opencode/releases) 或 [opencode.ai/download](https://opencode.ai/download) 下載。
Windows：`opencode-desktop-windows-x64.exe`
安裝（Windows）：`scoop bucket add extras; scoop install extras/opencode-desktop`

**CI 整合**：在 GitHub Actions 以 `opencode` CLI 做自動修復（參見 `esggo-auto-repair-worker` / Cloudflare Worker 模式）。憑證走 `hermes auth` 注入，不寫死於 repo。

---

## 六、最大實踐清單（Checklist）

- [x] Windows 用 **scoop** 裝，不走 curl 腳本（除非要 `$HOME/.opencode/bin` 落點）
- [x] 憑證走 **`hermes auth`**，不寫死在 `.env`
- [x] 探索用 **plan**、實作用 **build**、跨倉檢索 **@general**
- [x] key 輪換 SOP：每次貼聊天後赴 portal 輪換
- [x] 升版用 `scoop update opencode`，不混用 npm 全域
- [x] 與 OA-Team 30 魂矩陣對位，納入 5T / 4可1不可 結界

---

## 七、故障排除

| 症狀 | 根因 | 修法 |
|---|---|---|
| `auth failed ModelError (401)` | key 失效/舊 | `hermes auth add` 新 key + `reset` + `remove` 舊 |
| `rate-limited (429)` | 限流 | `hermes auth reset` 或待自動 retry |
| `hermes auth add` 卡住 | 缺 `--label` 互動要輸入 | 補 `--label api-key-zen` |
| `opencode` command not found | PATH 未含 `$HOME/.opencode/bin` | 重跑 install 或手加 PATH |
| 安裝腳本無效 (Win) | 用 curl 但缺 bash 環境 | 改 `scoop install opencode` |

---

*本冊為 esggo-omni-center 之 OpenCode 實踐聖典，對齊 soul.md 不變基因：5T ✓｜4可1不可 ✓｜熵<0.1 ✓。*
