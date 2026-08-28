# AI Station 部署與驗證技術

> soul.md §9 - AI Station 整合項目  
> 版本: v0.5 | 更新: 2026-08-26  
> Hash Lock: sha256:9453c2a90d941d252505b850dcdd2fd0b48c1fb8f8c10c27c13218126e2655a3

## 專案概述

AI Station 是一個 7 模組生產線，用於將文本腳本自動轉換為品牌視頻內容。  
基於 OA-Team 30 Soul Canon §9 模組分配。

## 7 模組架構

| # | 模組 | 文件 | 責任成員 |
|---|---|---|---|
| 1 | 編排中心 (Input) | src/main.py | 萬能編碼蜂 (07) |
| 2 | 文字解析 (Design) | src/parsers/dna_parser.py | 萬能算法蜂 (08), 萬能文案蜂 (15) |
| 3 | 語音合成 (Design) | src/synthesizers/speech.py | 萬能音頻蜂 (16) |
| 4 | 視覺生成 (Design) | src/visuals/image_gen.py | 萬能圖像蜂 (13), 萬能動畫蜂 (14) |
| 5 | 渲染引擎 (Execution) | src/renderers/video.py | 萬能測試蜂 (11) |
| 6 | 雲端儲存 (Execution) | src/storage/sqlite.py | 萬能數據蜂 (10), 萬能探路蜂 (22) |
| 7 | 溯源庫 (Automation) | src/evidence/hash_lock.py | 萬能安全蜂 (27), 萬能質控蜂 (30) |

## 5T 驗證標準

| 5T | 驗證方法 | 門檻 |
|---|---|---|
| Traceable | `grep -r "source_origin:" src/` | ≥ 7 files |
| Trackable | `evidence/hash_lock.py` 存在 | ✓ |
| Tangible | `brand.py` 包含 BRAND_COLORS | ✓ |
| Transparent | `test_pipeline.py` 包含 test_5t_protocol | ✓ |
| Trustworthy | `freeze_artifact()` 函數存在 | ✓ |

## 部署檢查清單

1. **環境確認**
   - Python 3.11+ ✓
   - Git 2.53+ ✓
   - Node v24+ ✓
   - ffmpeg (可選)

2. **目錄結構**
   ```
   apps/aistation/
   ├── src/
   │   ├── api/main.py          # Module 1: FastAPI
   │   ├── parsers/dna_parser.py # Module 2: DNA parsing
   │   ├── synthesizers/speech.py # Module 3: TTS
   │   ├── visuals/image_gen.py   # Module 4: Image gen
   │   ├── renderers/video.py     # Module 5: Video render
   │   ├── storage/sqlite.py      # Module 6: Storage
   │   └── evidence/hash_lock.py  # Module 7: Evidence
   ├── tests/test_pipeline.py
   ├── docs/agents.json
   ├── pyproject.toml
   ├── requirements.txt
   └── aistation.env
   ```

3. **員工配置**
   - `docs/agents.json` 包含 30 位萬能蜂群成員
   - 每位成員分配對應模組職責
   - Hash Lock: `sha256:6890cbd6...`

4. **執行驗證**
   ```bash
   cd C:/c/Users/dingj/esggo/apps/aistation
   python scripts/verify_all.sh  # 所有驗證門
   ```

## 品牌預設 (Dr. Source)

| 元素 | 顏色 | 用途 |
|---|---|---|
| Deep Blue | #10243f | 背景主色 |
| Warm Gold | #c9a24b | 強調/按鈕 |
| Ivory White | #f3ede1 | 文字背景 |
| Forest Green | #3c6e47 | 強調/連結 |

**禁用視覺**: neon_blue_purple, floating_data, robot_brain

## 部署命令

```bash
# 初始化
mkdir -p C:/c/Users/dingj/esggo/apps/aistation
cd C:/c/Users/dingj/esggo/apps/aistation

# 安裝依賴
pip install -r requirements.txt

# 啟動服務
python -m src.main

# 驗證部署
bash scripts/verify_all.sh
```

## Hash Lock 鏈

| 階段 | Hash Lock |
|---|---|
| 初始化 | sha256:a4d2eead... |
| 生產線部署 | sha256:6890cbd6... |
| E2E 驗證 | sha256:9453c2a9... |