# ESGGO Hub Plugin — Checklist & Troubleshooting

## 快速驗證

1. **啟用插件**
   ```bash
   hermes config set plugins.enabled '["esggo-hub"]'
   ```

2. **重啟 gateway**
   ```bash
   hermes update --no-backup --yes
   ```

3. **重新載入桌面插件**
   - 在 Hermes 桌面 app 內：`⌘K` → `Reload desktop plugins`

4. **驗證前端 UI**
   - 右側 pane：應顯示 `branch: main`, `dist_built: True` 等資料
   - 狀態列 chip：點擊彈出 toast 顯示 gateway/model/cwd
   - `⌘K` → `Open ESGGO Hub`：能開到頁面
   - `mod+shift+r`：刷新即時資料（keybind 可在設定改綁）

## 後端 API 測試

```bash
# 測試 /status
curl -s http://localhost:8786/api/plugins/esggo-hub/status

# 測試 /events（WebSocket，僅作加速器，輪詢是主要方式）
# 前端會自動收到 tick 並 invalidat Queries
```

## 錯誤排查指令

```bash
# 查看啟用狀態
hermes config get plugins.enabled

# 查看錯誤 log
tail -f ~/AppData/Local/hermes/logs/errors.log | grep -i esggo-hub

# 手動 reload（若 plugin 沒自動載入）
# ⌘K → Reload desktop plugins

# 手動測試 Python 後端
VENV_PYTHON="$LOCALAPPDATA/hermes/hermes-agent/venv/Scripts/python.exe"
"$VENV_PYTHON" -c "
import importlib.util
spec = importlib.util.spec_from_file_location('api', r'$LOCALAPPDATA/hermes/plugins/esggo-hub/dashboard/plugin_api.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
print('Routes:', [r.path for r in m.router.routes])
"
```

## 常見問題

| 症狀 | 原因 | 解決 |
|------|------|------|
| plugin.js 沒載入 | folder name ≠ id | 確認 `desktop-plugins/esggo-hub/plugin.js` 中 `id: 'esggo-hub'` |
| 後端 404 | gateway 未重啟 | `hermes update --no-backup --yes` |
| toast 顯示「後端未啟用」 | plugins.enabled 未設 | `hermes config set plugins.enabled '["esggo-hub"]'` |
| 權限錯誤 | 沒有寫 config.yaml 權限 | 用 `hermes config set` 命令，避免直接編輯 YAML |
| socket 不推播 | OAuth 遠端 | 保持 15s polling 為主要方式，socket 只作加速 |

## 補 Firebase 資料（待 service account）

1. 下載 Firebase service account JSON
2. 放到 `~/.hermes/serviceAccountKey.json`
3. 修改 `plugin_api.py`：
   ```python
   import firebase_admin
   from firebase_admin import credentials, firestore
   cred = credentials.Certificate('/path/to/serviceAccountKey.json')
   firebase_admin.initialize_app(cred)
   db = firestore.client()
   @router.get("/learners")
   async def learners():
       docs = db.collection('learners').stream()
       return [d.to_dict() for d in docs]
   ```
4. 重啟 gateway：`hermes update`

## Theme contribution（DesktopTheme）

ESGGO Hub 內已加入一個簡單的自訂主題：

```javascript
{
  id: 'esggo-theme',
  area: THEMES_AREA,
  data: {
    name: 'esggo',
    label: 'ESGGO',
    description: 'ESGGO 2026 Berkeley course theme',
    colors: { background: '#0a0f1f', ..., accent: '#10b981' }
  }
}
```

### 驗證 theme 是否生效

1. 重啟 gateway：`hermes update --no-backup --yes`
2. ⌘K → Reload desktop plugins
3. 開啟「設定 → 外觀 → 主題」選擇器
4. 應看到 ESGGO 這個主題可供選擇，切換後即時生效

### Theme 常見問題

| 症狀 | 原因 | 解決 |
|------|------|------|
| theme 沒出現在選擇器 | 後端未掛載 | 確認 `plugins.enabled` 包含 `esggo-hub`，重啟 gateway |
| 切換 theme 沒反應 | 硬編了顏色 | 用 `var(--ui-*)` 變數，或檢查 JSX 不用硬編 `style: { background: '#...' }` |
| 載入報錯 | DesktopTheme 欄位打錯 | 參照 `apps/desktop/src/themes/types.ts` 確認欄位名稱 |