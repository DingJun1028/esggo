---
name: python-cli-packaging
description: >
  判斷一個 repository 是不是「可安裝的 CLI 套件」，以及如何在 Ubuntu / VPS / CI
  環境中正確部署 Python-first 指令列工具、diagnosing repo 結構誤判、uv/uvx/pip/npm 選型。
version: v0.1
---

# Python CLI Packaging / Repo Structure Diagnosis

Use when a repo claims to be a CLI but `package.json` / `pyproject.toml` is missing, or when `npm install -g .` / `pip install -e .` fails inside a cloned repo.

## 1. 先判 repo 性質（30 秒）

```bash
ls
ls -la package.json pyproject.toml setup.py setup.cfg 2>/dev/null || true
```

| 發現 | 結論 |
|------|------|
| `pyproject.toml` 或 `setup.py` 存在 | 有可能可直接 `pip install -e .` 或 `pip install .` |
| 只有 `package.json` | Node/npm 範圍，走 `npm install -g .` 或 `npx` |
| 都沒有，但有 `skills/` `.claude-plugin/` `src/` | **plugin/skills repo**，不是 CLI 本身 |
| `README.md` 指向 PyPI 套件名 | 去 PyPI 裝，不要從 repo 裝 |

## 2. 不要盲裝「看起來像 CLI 的 repo」

本案 `DingJun1028/agents-cli` 的具體教訓：
- README 標題像 CLI，但 repo 本體是 **plugin/skills repo**
- `DingJun1028/agents-cli` 實際命名/發佈方式：**PyPI `google-agents-cli`**
- 重複 `npm install -g git+https://...` → ENOENT，因為根目錄沒有 `package.json`
- 重複 `git clone + npm install -g .` → ENOENT，同上
- `npm view agents-cli versions` 只有 `0.1.3`，表示 registry 上的 `agents-cli` 不是你要的

## 3. 正確安裝決策樹

```
安裝目標是什麼？
├── README / docs 說用 uvx / PyPI
│   └── 直接走官方發表管道（例：uvx google-agents-cli setup）
├── repo 根目錄真的有 pyproject.toml / setup.py
│   └── 可考慮 pip install -e .
├── repo 根目錄有 package.json
│   └── npm install -g . 或 npx
└── 都沒有，但有 .claude-plugin / skills/
    └── 這是 plugin/skills 體，不是 standalone CLI
        └── 去找它的 host CLI（通常是 PyPI 或 npm 上的另一包）
```

## 4. uv / uvx / pip 安裝優先序（Ubuntu / VPS）

不要 hard-code 一個失敗 install script URL。優先序：

1. **系統 python + pip**（最快通路）
   ```bash
   python3 --version
   pip install --user uv
   ```
2. **官方 install script**
   ```bash
   curl -fsSL https://docs.astral.sh/uv/installation.sh | bash
   ```
   若 404，退回 1。
3. **snap**
   ```bash
   sudo snap install astral-uv
   ```
   最後手段。
4. **apt / 舊版 python-uv**
   ```bash
   sudo apt update && sudo apt install -y python3-pip
   ```
   沒有 uv 時可備用；但優先走 uv。

## 5. 常見反模式

- **反模式 A**：看到 README 有 commands 就 `git clone` 並 `pip install -e .`
  - 修正：先看 repo 根目錄有沒有 packaging 檔。
- **反模式 B**：`npm install -g <github repo>` 盲試多版本
  - 修正：先 `npm view <name> versions` 確認 registry 真的有這個版本/命名。
- **反模式 C**：`uvx` 不存在就卡住
  - 修正：回到 `pip install uv` 再 `uvx ...`。
- **反模式 D**：自製 fork 預設就是最新版本
  - 修正：確認 fork 是否有對應 tag；`git checkout <tag>` 失敗就是不支援直接 checkout，不要假裝有該版本。

## 6. Hermes Desktop 的 PYTHONPATH 污染（Windows / 隔離 venv 必查）

Hermes 桌面 App 會把自身 hermes-venv 的兩個路徑寫入 `PYTHONPATH` 環境變數：
```
PYTHONPATH=C:\Users\dingj\AppData\Local\hermes\hermes-agent;C:\Users\dingj\AppData\Local\hermes\hermes-agent\venv\Lib\site-packages
```
這會污染**所有** Python 啟動（含你新開的獨立 venv），導致：
- `sys.path` 前兩項是 hermes-venv，import 先去 hermes 找包
- hermes-venv 的 `regex` 若損壞（circular import `_regex`）→ 任何依賴 regex 的包（nltk、speech_to_speech…）都 `ImportError: cannot import name '_regex'`
- pip install 報 `Found existing installation: X outside environment` 且無法解除安裝

**診斷**：
```python
import sys; print([p for p in sys.path if 'hermes' in p])
```
若列出 hermes 路徑，就是被污染。

**修復**（每次跑隔離 venv 時前綴 `env PYTHONPATH=""`）：
```bash
env PYTHONPATH="" /path/to/isolated_venv/Scripts/python.exe -m pip install <pkg>
env PYTHONPATH="" /path/to/isolated_venv/Scripts/python.exe script.py
```
或 `python -S`（不載 site-packages）但較麻煩。

**教訓**：在本機建立任何「獨立」Python venv（如 s2s、oci 工具）時，第一件事就是 `env PYTHONPATH=""`，否則會把時間浪費在詭異的 import 錯誤上。

## 7. 套用 ESG-GO 規範

- 任何安裝失敗訊息只記錄 **摘要 + 風險提示**，不貼完整失敗 dump。
- `OmniTag`：`[agent:19][squad:煉金熵減][lifecycle:active][p2][platform:vps][best-practice:结界]`
- `5T`：安裝步驟留有可溯源來源；禁止把未經證实的 version tag 寫入契約。
