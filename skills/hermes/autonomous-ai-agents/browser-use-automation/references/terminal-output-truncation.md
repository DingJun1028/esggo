# Terminal Output Truncation - Windows Background Terminal Issue

## 問題描述

在 Windows 環境下，終端機的輸出可能會被嚴重截斷，尤其是在執行需要較長時間的 Python 腳本或 API 呼叫時。

## 觀測到的行為

- `read_terminal` 工具返回的輸出被截斷，顯示 `total_lines: 351` 但實際內容不完整
- 前 340 行被截斷，只顯示後 11 行
- 終端機提示字元和進度資訊被包含在內容中
- 實際的 Python 輸出結果不見於終端機顯示

## 觀測證據

```json
{
  "total_lines": 351,
  "start_line": 340,
  "viewport_rows": 11,
  "cursor_row": 348,
  "text": "    Get-ChildItem -Path \"C:\\\" -Recurse -Directory -Name \"空間項目\"..."
}
```

## 可能的原因

1. **終端機緩衝區限制**：Windows 終端機的緩衝區大小有限
2. **顯示區域限制**：Hermes 終端機介面只顯示視窗內的內容
3. **Python 輸出緩衝**：`print()` 輸出被緩衝，未即時顯示

## 解決方案

### 方案 1：使用文件輸出

```python
import sys
import os

# 將輸出重定向到文件
sys.stdout = open('output.txt', 'w', encoding='utf-8')

# 執行任務
# ... 你的代碼 ...

sys.stdout.close()
sys.stdout = sys.__stdout__

# 讀取結果
with open('output.txt', 'r') as f:
    result = f.read()
```

### 方案 2：使用 Python 的 logging 模組

```python
import logging

logging.basicConfig(
    filename='task.log',
    level=logging.INFO,
    format='%(asctime)s - %(message)s'
)

logging.info("任務開始...")
# 你的代碼
logging.info("任務完成")
```

### 方案 3：使用 curl 直接呼叫 API

```bash
curl -X POST https://api.browser-use.com/api/v4/runs \
  -H "X-Browser-Use-API-Key: YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"task":"你的任務","model":"grok-4.5"}' \
  -o result.json
```

### 方案 4：使用 Python 的 subprocess 執行

```python
import subprocess
import json

result = subprocess.run([
    'curl', '-X', 'POST', 'https://api.browser-use.com/api/v4/runs',
    '-H', 'X-Browser-Use-API-Key: YOUR_KEY',
    '-H', 'Content-Type: application/json',
    '-d', '{"task":"你的任務","model":"grok-4.5"}'
], capture_output=True, text=True)

output = json.loads(result.stdout)
```

## 推薦做法

1. **對於需要完整輸出的任務**：使用文件輸出或 logging
2. **對於瀏覽器自動化**：直接使用 REST API 呼叫，將結果保存到文件
3. **對於長時間任務**：使用 `nohup` 或類似機制確保執行

## 測試方法

```bash
# 測試輸出是否被截斷
python3 -c "
for i in range(100):
    print(f'Line {i}')
" > test_output.txt 2>&1

# 檢查文件內容
wc -l test_output.txt
head -5 test_output.txt
tail -5 test_output.txt
```