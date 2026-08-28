# GitHub REST API 速查表

基底：`gh_api() { curl -s -H "Authorization: Bearer $TOKEN" -H "Accept: application/vnd.github+json" -H "X-GitHub-Api-Version: 2022-11-28" "https://api.github.com$1"; }`

## Repos / Branches / Tags
| 動作 | Method + Path |
|---|---|
| 倉庫資訊 | GET /repos/{o}/{r} |
| 分支列表 | GET /repos/{o}/{r}/branches?per_page=100 |
| 受保護分支 | GET /repos/{o}/{r}/branches?protected=true |
| 設保護規則 | PUT /repos/{o}/{r}/branches/{b}/protection |
| Tag 列表 | GET /repos/{o}/{r}/tags |
| 建 Tag (annotated) | POST /repos/{o}/{r}/git/refs (body `{"ref":"refs/tags/v1.0.0","sha":"<commit>"}`) |

## Releases
| 動作 | Method + Path |
|---|---|
| List | GET /repos/{o}/{r}/releases |
| Create | POST /repos/{o}/{r}/releases |
| Get by tag | GET /repos/{o}/{r}/releases/tags/{tag} |
| Latest | GET /repos/{o}/{r}/releases/latest |
| Upload asset | POST /repos/{o}/{r}/releases/{id}/assets?name= |
| Generate notes | POST /repos/{o}/{r}/releases/generate-notes |
| Delete | DELETE /repos/{o}/{r}/releases/{id} |

Create body 範例：
```json
{"tag_name":"v1.2.3","target_commitish":"main","name":"v1.2.3",
 "body":"release notes","draft":false,"prerelease":false}
```
⚠ 改動 workflow 檔需 token 有 `workflow` scope；`GITHUB_TOKEN` 不能用於建 release。

## Pull Requests
| 動作 | Method + Path |
|---|---|
| List | GET /repos/{o}/{r}/pulls?state=open |
| Create | POST /repos/{o}/{r}/pulls |
| Get | GET /repos/{o}/{r}/pulls/{n} |
| Merge | PUT /repos/{o}/{r}/pulls/{n}/merge |
| Reviews | GET /repos/{o}/{r}/pulls/{n}/reviews |
| Request reviewer | POST /repos/{o}/{r}/pulls/{n}/requested_reviewers |
| Files | GET /repos/{o}/{r}/pulls/{n}/files |
| Checkout PR | `git fetch origin pull/{n}/head:pr-{n}` |

Merge body: `{"merge_method":"squash|merge|rebase"}`

## Issues
| 動作 | Method + Path |
|---|---|
| List | GET /repos/{o}/{r}/issues?state=all |
| Create | POST /repos/{o}/{r}/issues |
| Patch | PATCH /repos/{o}/{r}/issues/{n} |
| Comments | POST /repos/{o}/{r}/issues/{n}/comments |
| Labels | GET /repos/{o}/{r}/labels ; POST /repos/{o}/{r}/labels |
| Milestones | GET /repos/{o}/{r}/milestones?state=all |

## Actions
| 動作 | Method + Path |
|---|---|
| Secrets (names) | GET /repos/{o}/{r}/actions/secrets |
| Create/Update secret | PUT /repos/{o}/{r}/actions/secrets/{name} |
| Delete secret | DELETE /repos/{o}/{r}/actions/secrets/{name} |
| Variables | GET/POST/PUT/DELETE /repos/{o}/{r}/actions/variables[/{name}] |
| Environments | GET /repos/{o}/{r}/environments |
| Workflow runs | GET /repos/{o}/{r}/actions/runs |
| Run logs | GET /repos/{o}/{r}/actions/runs/{id}/logs (zip) |
| Re-run | POST /repos/{o}/{r}/actions/runs/{id}/rerun |

Secret value 必須加密：`PUT` body `{"encrypted_value":"<libna+base64>", "key_id":"<repo public key id>"}`。
簡化：先用 `GET /repos/{o}/{r}/actions/secrets/public-key` 取 key，用 libsodium `seal` 加密再 PUT。更新值須先 DELETE 再 PUT。

## Webhooks
| 動作 | Method + Path |
|---|---|
| List | GET /repos/{o}/{r}/hooks |
| Create | POST /repos/{o}/{r}/hooks |
| Deliveries | GET /repos/{o}/{r}/hooks/{id}/deliveries |
| Redeliver | POST /repos/{o}/{r}/hooks/{id}/deliveries/{delivery_id}/attempts |

Create body: `{"name":"web","active":true,"events":["push","pull_request"],"config":{"url":"https://...","content_type":"json","secret":"..."}}`

## Search（Issue/PR 計數）
`GET /search/issues?q=repo:{o}/{r}+type:pr+state:open` → `total_count`
`GET /search/issues?q=repo:{o}/{r}+type:issue+state:open`
