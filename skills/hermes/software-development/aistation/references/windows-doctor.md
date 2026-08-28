# Windows 環境下的 hermes doctor 使用指南

## 常見問題

### 命令超時
`hermes doctor` 在 Windows 環境下可能因 API 連通性檢查（29 個平行檢查）導致超時。

**解法 1：使用 Python 直接呼叫（推薦）**
```python
python -c "
from hermes_cli.doctor import run_doctor
import argparse
class Args: fix=False; ack=None
run_doctor(Args())
"
```

**解法 2：設定較長超時**
```bash
timeout 120 hermes doctor
```

## 執行結果範例（Windows 環境）

```
◆ Security Advisories
  ✓ No active security advisories

◆ Python Environment
  ✓ Python 3.11.15
  ✓ Virtual environment active
  ✓ Version files consistent (0.19.0)

◆ Configuration Files
  ✓ ~/AppData/Local/hermes/.env file exists
  ✓ API key or custom endpoint configured
  ✓ ~/AppData/Local/hermes/config.yaml exists
  ✓ Config version up to date (v33)

◆ API Connectivity
  Running 29 connectivity checks in parallel…
  ⚠ OpenRouter API (not configured)

Found 3 issue(s) to address:
  1. web workspace has 8 npm vulnerabilities
  2. ui-tui workspace has 7 npm vulnerabilities
  3. Run 'hermes setup' to configure missing API keys
```

## Windows 特定注意事項

1. **路徑分隔符**：`~` 在 Windows 下對應到 `C:\Users\<username>\AppData\Local\hermes\`
2. **UTF-8 BOM**：首次運行時檢查 `config.yaml` 是否因 Notepad 保存產生 UTF-8 BOM
3. **npm 資產安全警告**：web/workspace、ui-tui workspace 的 npm 高危弱點屬於 build-time advisory，不影響執行時運作
4. **測試**：Windows 下測試使用系統 Python 安裝的 pytest，避免 POSIX-only 腳本