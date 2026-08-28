# Notion MCP Patterns (worked examples)

Concrete patterns for driving the Notion remote MCP server (`https://mcp.notion.com/mcp`, OAuth) from the agent. Tools are invoked as `mcp__notion__<tool>`.

## 1. List the whole workspace

`notion_search` requires a non-empty `query`. A single space lists everything; `page_size` caps at 25.

```
mcp__notion__notion_search({ "query": " ", "page_size": 25 })
```

Result entries carry `id`, `title`, `type` (`page` | `database`), `url`.

## 2. Fetch a page / database schema

Param is `id` (not `page_id`). For a database page, the response includes a `<data-source url="collection://<uuid>">` block — that UUID is what you feed to the SQL query.

```
mcp__notion__notion_fetch({ "id": "744ccd20-97d7-8304-94f7-0115c979eeb9" })
```

## 3. Query a database (SQL mode)

`notion_query_data_sources` wants a `data` wrapper, not flat args:

```
mcp__notion__notion_query_data_sources({
  "data": {
    "mode": "sql",
    "data_source_urls": ["collection://7c3ccd20-97d7-82f6-8a31-078bbceb6a09"],
    "query": "SELECT \"名稱\", \"網址\", \"摘要\" FROM \"collection://7c3ccd20-97d7-82f6-8a31-078bbceb6a09\" LIMIT 100"
  }
})
```

Rules that bite:
- **Chinese column names → double quotes.** `SELECT 名稱` fails with `no such column`; `SELECT "名稱"` works.
- **Date columns are expanded:** `Deadline` is actually `date:Deadline:start`. `SELECT "Deadline"` → `no such column: "Deadline"`; use `date:Deadline:start`.
- Large results may spill to `~/.hermes/cache/spillover/*.txt` instead of returning inline.

## 4. Decode the (sometimes double-stringified) result

When the SQL result is itself a JSON string inside the outer object:

```python
import json, re
raw = open(r"C:\Users\dingj\AppData\Local\hermes\cache\spillover\chatcmpl-tool-XXXX.txt", encoding="utf-8").read()
m = re.search(r'\{"result":\s*"(.*)"\}\s*$', raw, re.S)
inner = m.group(1).encode().decode("unicode_escape")   # un-escape the embedded JSON string
data = json.loads(inner)
for row in data["results"]:
    name = row.get("名稱") or "(無名稱)"
    url = row.get("網址")
    # ...build markdown, write to vault...
```

## 5. OAuth token ≠ REST API key

- MCP OAuth `access_token` lives at `~/.hermes/mcp-tokens/notion.json`. It is scoped to `mcp.notion.com` and **401s** on `api.notion.com`.
- For direct REST API calls you need a separate `NOTION_API_KEY` (Notion → Settings → Integrations).
- `gh secret get` does NOT work for GitHub Actions secrets (read-back is disabled by design); use `vercel env pull` or the GitHub Web UI to source keys instead.
