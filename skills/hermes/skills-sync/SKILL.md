---
name: skills-sync
category: devops
version: "1.0.0"
author: OA-Team
license: "AGPL-3.0"
description: OA-Team 經驗技能書雙向同步 Hermes 技能樹 ↔ esggo OmniTag OpenCode 格式
tags: [skills-sync, opencode, hermes, github, bidirectional, omni-tag]
metadata:
  hermes:
    tags: [skills-sync, opencode, hermes, github, bidirectional]
    "skills": ["oa-team-soul-canon", "unagent", "skills-sync", "obsidian:hermes-agent-obsidian-plugin", "superpowers"]
---

# 經驗技能書雙向同步契約 (Skills-Sync)

## When to use
- 用戶說「雙向同步經驗技能書」「同步給 opencode.ai」「對映到 esggo OmniTag 分支」。
- 需要把 Hermes 技能樹的技能書匯出為 OpenCode 格式，或反向合併。
- 在 GitHub 倉庫內維護 Hermes 原生 + OpenCode 轉換雙格式的單一信源。

## 目標倉庫（共通點 = 舊式遠端倉庫 GitHub）
- **倉庫**：`esggo`（owner 以用戶實際 fork/owner 為準，預設 `DingJun1028/esggo`）。
- **分支**：`OmniTag`（雙向同步映射落點）。
- **倉庫內結構**：
  ```
  esggo/  (branch: OmniTag)
  ├── skills/
  │   ├── hermes/            # Hermes 原生格式（SKILL.md + references/ + templates/ + scripts/）
  │   │   ├── oa-team-soul-canon/
  │   │   ├── unagent/
  │   │   ├── obsidian-hermes-agent-obsidian-plugin/
  │   │   └── ... (全部要同步的 Hermes 技能)
  │   └── opencode/          # OpenCode 轉換格式（由 hermes/ 轉出，直接轉換後更新）
  │       ├── oa-team-soul-canon.md
  │       ├── unagent.md
  │       └── ...
  └── sync-manifest.json     # 雙向映射清單（hermes ↔ opencode 檔名對照 + 最後同步時間戳）
  ```

## 格式對映規則（Hermes ↔ OpenCode）

### Hermes 原生格式
- 目錄：`skills/<name>/SKILL.md` + 可選 `references/` `templates/` `scripts/`。
- frontmatter：`name` / `category` / `description`(≤60字) / `tags` / `metadata.hermes`。
- 正文：markdown，含 When to use / How to apply 等章節。

### OpenCode 格式（轉換目標）
- OpenCode 技能為單一 `.md` 檔，frontmatter 用 YAML：`name` / `description` / `prompt`（或正文即指令）。
- 轉換對映：
  | Hermes | OpenCode |
  | --- | --- |
  | `SKILL.md` frontmatter `name` | `name:` |
  | `SKILL.md` frontmatter `description` | `description:` |
  | `SKILL.md` 正文 | OpenCode `prompt:` 多行字串 或 正文主體 |
  | `references/*.md` | 內聯或 `# 參考` 段 |
  | `templates/*.md` / `scripts/*.py` | 附錄區塊或獨立檔引用 |
  | `metadata.hermes.related_skills` | `metadata.related` |
- **CJK 保留**：轉換全程 UTF-8，禁止掉字/半形化。
- **5T 標記**：Hermes 技能中的 5T 對應段落原樣保留至 OpenCode `prompt`。

## 轉換腳本樣板（Python，無外部依賴）
```python
#!/usr/bin/env python3
# scripts/hermes_to_opencode.py — Hermes SKILL.md → OpenCode .md
import re, json, sys
from pathlib import Path

def parse_front(text):
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    fm = {}
    if m:
        for line in m.group(1).splitlines():
            if ":" in line:
                k, v = line.split(":", 1)
                fm[k.strip()] = v.strip().strip('"')
    return fm, (m.group(0) if m else "")

def convert(skill_dir: Path, out_dir: Path):
    sk = skill_dir / "SKILL.md"
    text = sk.read_text(encoding="utf-8")
    fm, _ = parse_front(text)
    body = text[text.find("---", 3)+3:] if text.count("---")>=2 else text
    name = fm.get("name", skill_dir.name)
    desc = fm.get("description", "")
    out = out_dir / f"{name}.md"
    out.write_text(
        f"---\nname: {name}\ndescription: {desc}\n---\n\n{body.strip()}\n",
        encoding="utf-8")
    return out

if __name__ == "__main__":
    hermes_root = Path(sys.argv[1]) if len(sys.argv)>1 else Path("skills/hermes")
    out = Path(sys.argv[2]) if len(sys.argv)>2 else Path("skills/opencode")
    out.mkdir(parents=True, exist_ok=True)
    for d in hermes_root.iterdir():
        if (d/"SKILL.md").exists():
            p = convert(d, out)
            print(f"converted {d.name} -> {p}")
```

## ⚠ SAFETY GATE（必讀，違反會丟資料）

本契約會切換 git 分支並寫入 `skills/`。**以下三條是 2026-08-24 實際災難後補的防呆，缺一不可：**

1. **禁止 `git checkout -f`**：`-f` 會無條件覆寫工作樹，**直接丟棄未提交改動（含 `M` 與 `??`）且 git/IDE/檔案系統皆無法撈回**。切分支前若工作區有未提交內容，先 `git stash push -u -m "pre-sync"`（含未追蹤）或先 `git commit`；切回時 `git stash pop` 還原。
2. **`/skills/` 被 `.gitignore` 忽略**：倉庫根 `.gitignore` 第 184 行 `/skills/` 會讓 `git add skills/...` 靜默跳過。必須 `git add -f skills/hermes/<name>/SKILL.md skills/opencode/<name>.md`（已追蹤的 `skills/oa/*` 不受影響，證明 skills 應被追蹤）。
3. **只 commit 同步檔，勿 `-A`**：`OmniTag` 常從工作分支（如 `feat/omni-cli-api`）切出，會帶入大量不相關未提交改動。用 `git add -f <本輪同步檔>` 精準暫存，commit 訊息約定式，絕不 `git add -A` 把雜項一併推上 OmniTag。

**安全切換流程（取代任何 `-f`）：**
```bash
cd C:/Project/esggo
git status --short                    # ① 看清工作區狀態
# 若有未提交改動 → git stash push -u -m "pre-sync-$(date +%s)"  或先 commit
git checkout OmniTag                 # ② 無 -f，乾淨切換
# ... 同步操作 ...
git add -f skills/hermes/<name>/SKILL.md skills/opencode/<name>.md sync-manifest.json
git commit -m "chore(skills): ..."
git push origin OmniTag
git checkout feat/omni-cli-api       # ③ 無 -f，因同步檔皆已 commit，工作樹乾淨
# git stash pop                       # ④ 若步①有 stash，還原你的工作
```

## 雙向同步手動步驟（主機終端執行）
> 注意：Hermes 技能樹在主機 `C:\Users\dingj\AppData\Local\hermes\skills\`；容器讀不到，須在主機跑。

```powershell
# 1. 克隆/切到 OmniTag 分支
cd C:\Project\esggo
git fetch origin
git checkout OmniTag || git checkout -b OmniTag origin/OmniTag

# 2. 同步 Hermes 技能樹 → 倉庫 skills/hermes/
robocopy "C:\Users\dingj\AppData\Local\hermes\skills" "C:\Project\esggo\skills\hermes" /E /XO

# 3. 轉換為 OpenCode 格式
python scripts/hermes_to_opencode.py skills/hermes skills/opencode

# 4. 更新映射清單（同步時間戳）
python -c "import json,time; json.dump({'updated':time.time(),'branch':'OmniTag'}, open('sync-manifest.json','w'), ensure_ascii=False, indent=2)"

# 5. 提交 + 推送（約定式提交訊息）
git add -A
git commit -m "chore(skills): 雙向同步經驗技能書至 OmniTag (Hermes + OpenCode 雙格式)"
git push origin OmniTag
```

## 反向同步（OpenCode → Hermes）
- 若倉庫 `skills/opencode/*.md` 被外部編輯，需回寫 Hermes：解析 `name`/`description` 還原 `SKILL.md` frontmatter，正文回貼。
- 回寫前先 `git pull origin OmniTag` 確保最新，再 `robocopy` 回 `C:\Users\dingj\AppData\Local\hermes\skills\`。

## 5T 對應（本契約自身）
- **Traceable**：`sync-manifest.json` 記錄每次同步來源與時間戳。
- **Trackable**：git 提交歷史即流轉軌跡。
- **Tangible**：OpenCode 格式可直接被 opencode.ai 工具載入驗證。
- **Transparent**：轉換腳本無外部依賴、邏輯公開。
- **Trustworthy**：`OmniTag` 分支為不可變映射信源，寫入即凍結於 git。

## CLI 路徑（跨平台）
- **Windows (PowerShell)**：`scripts/sync-to-esggo-omnitag.ps1`
- **跨平台 (bash/Linux/macOS/WSL)**：`scripts/sync-to-esggo-omnitag.sh`
- 兩者皆對應同一契約：同步 Hermes 技能樹 → `skills/hermes/` + 轉 OpenCode `skills/opencode/` + 寫 `sync-manifest.json` + 提交 + push + `gh` 開 PR。
- 完整 Hermes CLI 指令索引見專屬技能 `hermes-cli-catalog`（所有子命令 LIVE/DOC 分級註解）；`hermes doctor`/`hermes dashboard` 等長行程注意事項見 `hermes-cli-longrunning`。

## gg4 同步目標（待定義）
- 用戶將 `gg4` 列為系統焦點主題之一，但未提供其具體定義（技能樹/記憶/檔案搜尋均無命中）。
- 候選推測（**均未被用戶確認，列此備查，不採取動作**）：
  1. 某個 git 倉庫的簡稱（類比 `esggo` OmniTag 對映）；
  2. 某 CLI 工具/指令別名；
  3. `C:\Users\dingj\AppData\Local\hermes\pastes\` 暫存區的別名（本輪已用於置放 `omnitag-sync.bundle`）。
- **本契約暫不假設 gg4 的具體形態**；待用戶確認後再加一條同步對映（格式同 `esggo OmniTag` 區塊）。
- 已落地同步對象：`esggo` @ `OmniTag`（GitHub 舊式遠端倉庫，共通點）+ `superpowers` 方法論技能（經相同契約流轉）。

## 已知限制
- 當前容器環境 Docker 故障，`terminal`/`execute_code` 不可用 → 上述 git/robocopy/python 步驟須在用戶**主機終端**執行，Hermes 代理人無法代跑。
- `git` 提交/推送/開 PR 由用戶在主機完成（或等 Docker 恢復經 `terminal` 補跑）。
- 容器無 GitHub 寫入憑證時，以 `git bundle` 封裝 commit（置 `C:\Users\dingj\AppData\Local\hermes\pastes\`），由主機 `git fetch bundle OmniTag:OmniTag` 還原後 push。
