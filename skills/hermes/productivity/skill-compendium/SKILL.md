---
name: skill-compendium
description: "Build and maintain a '實踐技書' (practical skills book / methodology compendium): a GitHub repo that consolidates Hermes Agent skills and project know-how into numbered chapter files backed by a README index. Use when the user says 實踐技書, 技書, methodology book, skills book, or asks to collect/organize scattered skills or practices into one shared reference repo."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [GitHub, Skills, Documentation, Knowledge, Methodology, ESGGO]
    related_skills: [github-repo-management, github-auth, hermes-agent-skill-authoring]
---

# Skill Compendium（實踐技書 / 方法論總冊）

Consolidate Hermes Agent skills and project methodology into a single GitHub repo
organized as a "book": a `README.md` index plus one self-contained chapter file per
skill under `chapters/`. This is the pattern behind the ESGGO **實踐技書**
(`DingJun1028/esggo-shijian-jishu`, "ESGGO 實戰方法論總冊").

## When to use
- User references 實踐技書 / 技書 / "methodology book" / "skills book" / "技能書".
- User wants to consolidate scattered skills or project methodology into one repo.
- User says "add X skill to the skills book" or "organize our practices".

## Core shape
- `README.md` = 封面 + 目錄: a table mapping chapter → topic → status.
- `chapters/NN-<slug>.md` = one skill/methodology per chapter, numbered, each
  self-contained with copy-pasteable commands.
- Convention: `gh` CLI first, `git`+`curl` as fallback (mirrors `github-repo-management`).

## Step-by-step

### 1. Locate or create the compendium repo
If it doesn't already exist locally or on GitHub, create it (mind the PITFALL below):
```bash
gh repo create esggo-shijian-jishu --public \
  --description "ESGGO 實踐技書：實戰方法論總冊" --clone
cd esggo-shijian-jishu
```
If it exists on GitHub but not locally:
```bash
gh repo clone DingJun1028/esggo-shijian-jishu
```

### 2. Write the README index
Copy `templates/README-index.md`, fill the title, purpose, and the chapter table:
| 章節 | 主題 | 狀態 |
|------|------|------|
| [01-...](./chapters/01-....md) | ... | ✅ 已收錄 |

### 3. Add one chapter per skill
Copy `templates/chapter.md` and fill in:
- **Source skill** (e.g. `github-repo-management` v1.1.0) — cite version for traceability.
- Condensed, executable sections (`gh` first, `git`+`curl` fallback).
- A "實踐收納清單" (practical checklist) where the skill has a repeatable audit.
- A quick-reference table.

### 4. Commit & push
```bash
git add -A
git commit -m "chore: 實踐技書 收錄 <topic>（第 NN 章）"
git push -u origin main
```

## PITFALL — `gh repo create --clone` produces a `master` branch
`gh repo create ... --clone` initializes the **local** repo on branch `master`, even
though GitHub's default branch is `main`. A later `git push -u origin main` fails with:
```
error: src refspec main does not match any
error: failed to push some refs to 'https://github.com/...'
```
Fix — rename the local branch before pushing:
```bash
git branch -m master main
git push -u origin main
```
(Also: architecture-doc references to 實踐技書 may use an MSYS path like
`/c/Users/dingj/esggo-repo/...` that `read_file` cannot open directly — locate it via
`find`/`ls` in the terminal instead of trusting the search-index path.)

## ESGGO mapping (example, not the whole skill)
- 實踐技書 → `DingJun1028/esggo-shijian-jishu` ("ESGGO 實戰方法論總冊"), local at
  `C:\Users\dingj\esggo-shijian-jishu`. It is the canonical home for consolidated
  ESGGO methodology chapters. When the user says 實踐技書 / 技書, this is the target.

## Verification
After push, confirm the remote actually has the files:
```bash
gh repo view DingJun1028/esggo-shijian-jishu --json nameWithOwner,defaultBranchRef,url
gh api repos/DingJun1028/esggo-shijian-jishu/git/trees/main?recursive=1 \
  | python3 -c "import sys,json; d=json.load(sys.stdin); [print(' ',t['path']) for t in d.get('tree',[])]"
```

## Related skills
- `github-repo-management` — clone/create/fork/settings/releases (the per-skill source).
- `github-auth` — HTTPS token / SSH / `gh` login.
- `hermes-agent-skill-authoring` — authoring in-repo SKILL.md (different from a book repo).
