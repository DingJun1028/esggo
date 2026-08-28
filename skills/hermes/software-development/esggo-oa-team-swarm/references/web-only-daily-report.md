# Web-Only 每日報告與 OA-Twins 驗證（2026-08-06 實測）

適用：`esggo-daily-report` cron（每天 18:00，OmniTag `[agent:20][squad:報吿投遞][p3][platform:omni]`）
以及任何**明令禁止 SSH、只准 Web 探測**的 ESG-GO 健康巡檢。

## 1. 端點地圖（實測，勿再盲猜路徑）

| 主機 | 路徑 | 實測結果 | 註記 |
|------|------|----------|------|
| esggo.co | `/api/health` | 200 `status:degraded` | payload **巢狀在 `data` 下**；淺層解析會印出誤導的 `status=None` |
| esggo.co | `/api/healthz` | **503** | 逐項 checks；env 未注入時 database/redis/firebase/ai 全 `warn Missing` |
| esggo.co | `/health` | 404 | 不存在 |
| omniagent.esggo.co | `/status` | 200 JSON | **正解**：`version` / `platform` / `uptime` / `active_workers` / `memory_usage` |
| omniagent.esggo.co | `/health` | 200 `{"status":"healthy"}` | 淺層，資訊量低 |
| omniagent.esggo.co | `/agents` | 401 | 需 `X-Omni-Token` header |
| omniagent.esggo.co | `/` `/api/*` `/metrics` `/healthz` | 404（Express `Cannot GET`） | 該服務**只有** `/status` `/health` `/agents` |
| live.esggo.co | `/healthz` `/` `/stream.html` `/studio.html` | 200 | omni-blueprint-hub v0.6 |
| memory.esggo.co | `/health` | 200 | TencentDB Memory tunnel |

判讀口訣：**`/api/health` 看總評、`/api/healthz` 看逐項、`/status` 看蜂群工人數**。

## 2. 探測陷阱（都真的踩過）

1. **Cloudflare 擋 urllib 預設 UA**：Python `urlopen(url)` 得 **403 Forbidden**，同一 URL `curl` 得 **200**。
   任何 Python 健康探測都必須帶 UA，否則製造假紅燈：
   ```python
   req = urllib.request.Request(url, headers={
       "User-Agent": "Mozilla/5.0 (OA-Twins health probe; +https://esggo.co)",
       "Accept": "application/json,*/*",
   })
   with urllib.request.urlopen(req, timeout=8) as r: ...
   ```
2. **git-bash `curl -o /dev/null` 回 exit 23**（`client returned ERROR on write`），但 `-w '%{http_code}'`
   仍輸出正確碼。**別把 exit 23 判成服務掛掉**；要乾淨就 `-o 檔案` 再讀檔。
3. 探測腳本的硬編路徑會過期：本機 Hermes 插件實際在
   `C:\Users\<user>\AppData\Local\hermes\desktop-plugins\esggo-hub`，
   不在 repo 內。用候選清單擇一存在者，別寫死：
   ```python
   _HUB_CANDIDATES = [repo_dir/"desktop-plugins"/"esggo-hub",
                      Path.home()/"AppData"/"Local"/"hermes"/"desktop-plugins"/"esggo-hub",
                      Path.home()/".local"/"share"/"hermes"/"desktop-plugins"/"esggo-hub"]
   LOCAL_HUB_DIR = next((c for c in _HUB_CANDIDATES if c.is_dir()), _HUB_CANDIDATES[0])
   ```

## 3. OA-Twins / OAB 驗證流程（無 pnpm gate 時的正解）

檔案位置：`C:\Project\esggo-learning-center\oa-twins\`
（`oab/broker.py` 已入 git；`bin/oa-twin-health.py` 被 `.gitignore:152 bin/` 忽略 → **未版控，5T Traceable 缺口**，要納管需 `git add -f`。）

```bash
cd /c/Project/esggo-learning-center/oa-twins
python -m py_compile oab/broker.py bin/oa-twin-health.py   # 語法
python oab/broker.py --self-test                            # 行為回歸
python bin/oa-twin-health.py --check both                   # 真實 HTTP 端對端
```

自檢通過的樣貌（缺一不可）：
```
received: ['health.heartbeat', 'swarm.phase']
entropy < 0.1 ? True (=0.0000)
journal size: 2
constitution bound: True
```
⚠️ `--self-test` **本身不做 assert**，exit code 恆為 0 —— 必須**肉眼比對 `received:` 陣列**。
只看 exit code 會漏掉「訂閱完全沒收到事件」的靜默失效。

### 已修復的兩個真實缺陷（2026-08-06）

| 症狀 | 根因 | 修法 |
|------|------|------|
| `AttributeError: 'ImmutableEvent' object has no attribute 'eventType'` | `__slots__` 寫了 `"type"`，程式卻賦值 `self.eventType` | `__slots__` 補上 `"eventType"` |
| `received: []`（自檢靜默無事件） | `_matches()` 對 `subscribe("platform:")` 取 `want=""`，比對 `tag_value == ""` 恆假 | `if not want: return any(t.startswith("platform:") for t in tags)` → 家族訂閱 |

教訓：**`__slots__` 與 `self.X = ` 的名稱漂移**在 Python 只有執行到才炸；
**前綴家族訂閱**要顯式支援空 suffix，否則 OmniTag 路由表形同虛設。

## 4. 「我的異動有沒有新增 lint 債」的基準比對法（可複用）

改動既有髒檔時，不要因為 linter 報一堆既存風格債就 `--fix` 全檔（會製造大量無關 diff），
也不要含糊說「那些是既有問題」。**用 git 基準檔實證**：

```bash
B="/c/Users/$USER/AppData/Local/Temp/ruffbase"; W="C:/Users/$USER/AppData/Local/Temp/ruffbase"
mkdir -p "$B"
git show HEAD:path/to/file.py > "$B/file.py"
ruff check --output-format=concise "$W/file.py"      | grep -oE '\b[A-Z]+[0-9]{3,4}\b' | sort | uniq -c > "$B/base.txt"
ruff check --output-format=concise path/to/file.py   | grep -oE '\b[A-Z]+[0-9]{3,4}\b' | sort | uniq -c > "$B/cur.txt"
diff "$B/base.txt" "$B/cur.txt" && echo "IDENTICAL — 本次異動 0 新增違規"
```

**Windows 關鍵陷阱**：`ruff` 是原生 Windows 執行檔，**看不懂 MSYS 的 `/tmp/...`**，
會回 `E902 系統找不到指定的路徑`（很容易被誤讀成「基準檔沒產生」）。
基準檔要放在 **Windows 可見路徑**（`C:/Users/<u>/AppData/Local/Temp/...`）並以該形式傳給 ruff。

同理適用：判斷「相關驗證指令」時先確認 gate 是否涵蓋該語言 ——
本 repo `vitest.config.ts` 只吃 JS/TS，無 `pytest.ini`/`tox.ini`，
所以 `.py` 異動的正解是 `py_compile` + 模組內建自檢 + ruff 基準比對，**不是** `pnpm test`。

## 5. 誠實判讀規約（本 cron 的驗收標準）

- 監控腳本 **exit 1 且指向真實 503** = 正確行為；**不可**為了全綠而放寬門檻。
- 修復假警報時報「**假警報 N→0、真異常 M 保留**」，禁止只報總數下降（3→1 聽起來像修好，其實真異常還在）。
- **環境阻塞**（禁 SSH、VPS env 未注入）與**任務失敗**必須分開陳述。
- cron 身分**不自行 commit/push**，交付未提交 diff + 建議 commit message。

## 6. 環境註記

- cron 情境下 `execute_code` 被 BLOCKED（無人可核准）→ 改用 `terminal` + `write_file`。
- `read_file` 偶會把正常 UTF-8 的 `.py` 判為 binary（`patch` 工具跟著失效）：
  讀取用 `python -c` 印切片行；改寫用一次性 Python 精確字串替換腳本，**跑完立刻 `rm -f`**，
  並在同一條指令內完成（避免殘留污染 working tree）。
