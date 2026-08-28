# Handbook Structure (distilled from esggo-shijian-jishu)

Concrete layout proven in this session. The repo `DingJun1028/esggo-shijian-jishu`
("ESGGO 實踐技書") was created from scratch and grown to 8 files.

## Files
```
README.md          # 封面 + 目錄表（章節 | 主題 | 狀態 | 來源）
TEMPLATE.md        # 章節寫作規範
chapters/
  01-github-remote-organization.md
  02-github-pr-workflow.md
  03-github-actions-secrets.md
  04-vps-deployment.md
  05-firebase-learning-center-deploy.md
  06-docker-cli-cheatsheet.md      # 修正版，標註貼上 cheat sheet 的錯誤
  07-spa-frontend-seo.md
```

## Chapter format (every chapter has these sections)
1. 來源 / Source — skill name + version, or incident/project.
2. 0. 摘要 / 環境速查 — table of key values (IPs, zone IDs, branch names).
3. 1..N 主題 — executable commands, `gh` priority + `git`+`curl` fallback.
4. 地雷 / 陷阱 — real failure modes (the most valuable section).
5. 驗證清單 — command table to run before claiming success.
6. 相關技能 — cross-links.

## README index table shape
| 章節 | 主題 | 狀態 | 來源 |
|------|------|------|------|
| [01 · ...](./chapters/01-...) | ... | ✅ 已收錄 | `skill-name` vX.Y.Z |
| NN · ... | （待補：...） | ⏳ 規劃中 | — |

## Git/push gotcha (hit this session)
Initial `gh repo create --clone` produced a local `master` branch while the remote
default was `main`. `git push -u origin main` failed with "src refspec main does not
match any". Fix: `git branch -m master main` then `git push -u origin main`.
