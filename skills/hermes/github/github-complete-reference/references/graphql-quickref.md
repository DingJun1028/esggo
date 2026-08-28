# GitHub GraphQL 速查表

Endpoint：`POST https://api.github.com/graphql`
Header：`Authorization: Bearer $TOKEN`、`Content-Type: application/json`
Body：`{"query":"...","variables":{...}}`

## 取得物件 node_id（REST 回傳的 node_id 即可用）
```graphql
query { repository(owner:"DingJun1028", name:"esggo") { id nameWithOwner } }
```

## 一次取 repo + open PRs + labels（聚合優勢）
```graphql
query {
  repository(owner:"DingJun1028", name:"esggo") {
    name
    pullRequests(states:OPEN, first:20) {
      nodes { number title state author { login } labels(first:10){nodes{name}} }
    }
    issues(states:OPEN, first:20){ nodes{ number title } }
  }
}
```

## 自動合併 PR（REST 不支援，必走 GraphQL）
```graphql
mutation {
  enablePullRequestAutoMerge(input:{pullRequestId:"<PR node_id>", mergeMethod:SQUASH}) {
    pullRequest { number autoMergeRequest { enabledAt } }
  }
}
```
注意：`enablePullRequestAutoMerge` 需 repo 設定開啟 auto-merge，且 PR 有至少一個 enabled merge 方式。

## Projects V2
```graphql
query { organization(login:"DingJun1028") { projectsV2(first:10){ nodes{ id title } } } }
mutation {
  createProjectV2StatusUpdate(input:{projectId:"PVT_xxx",
    body:"On track for GA", status:ON_TRACK, startDate:"2026-08-22"}) {
    statusUpdate { id }
  }
}
```

## 速率限制查詢
```graphql
query { rateLimit { cost limit remaining resetAt } }
```

## 注意事項
- GraphQL 用 global node id（REST 回傳的 `node_id` 欄位）。
- Rate limit 以「cost points」計，不同於 REST 的 5000/hr。
- 錯誤訊息在 `errors` 陣列；`data` 可能為 null 但 HTTP 200。
