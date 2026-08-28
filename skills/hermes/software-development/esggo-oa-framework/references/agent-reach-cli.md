# Agent Reach CLI (Panniantong/agent-reach) — real commands

Source: upstream `agent_reach/skill/SKILL.md` (read via browser raw during session).
Python package: `pip install agent-reach` (Python 3.10+). NOT a Node CLI.

## Install
- `pip install agent-reach` — installs `agent-reach` command + `agent_reach` module
- `agent-reach install <channel>` — installs one upstream CLI channel
  - Available channels (from `agent-reach list --all`): `rss`, `youtube` (no `--env=auto` flag; that form is wrong)
  - `youtube` pulls `yt-dlp` (uv tool); `rss` pulls `feedparser`
  - Other channels (twitter/reddit/xiaohongshu/facebook/instagram) need auth tokens / opencli and were NOT in the local index
- `agent-reach list` — shows installed channels (base `list` says "No channels installed")
- `agent-reach list --all` — shows the full channel index

## Diagnostics
- `agent-reach doctor` — outputs `No channels installed.` (exit 0) when nothing installed; this exit-0 is the signal the CLI is present
- There is NO `--version` flag (a common wrong guess) — use `doctor` to probe presence
- `agent-reach doctor --json` referenced in some docs, but base `doctor` returned plain text; prefer `doctor` + parse, don't assume JSON

## Routing table (real upstream CLIs the adapter delegates to)
- web search (Exa): `mcporter call exa.web_search_exa query="..." numResults=5`
- web page read:    `curl -s "https://r.jina.ai/<URL>"`
- GitHub:          `gh search repos "..." --sort stars --limit 10` (or `gh api`)
- YouTube subtitle: `yt-dlp --write-sub --write-auto-sub --skip-download -o "/tmp/%(id)s" "<URL>"`
- V2EX:            `curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"`
- Bilibili:        `bili search "..." --type video -n 5`
- Twitter/X:       `twitter search "..." -n 10`   (needs TWITTER_AUTH_TOKEN / TWITTER_CT0)
- Reddit:          `opencli reddit search "..." -f yaml`  OR  `rdt search "..." --limit 10`
- XiaoHongShu:     `opencli xiaohongshu search "..." -f yaml`
- Facebook:        `opencli facebook search "..." -f yaml` / `opencli facebook groups -f yaml`
- Instagram:       `opencli instagram search "..." -f yaml` / `opencli instagram user USERNAME -f yaml`

## Adapter probe pattern (oa-framework/src/adapters/agentreach.ts)
- `health()` / `bootstrap()`: `execFileP('agent-reach', ['doctor'], {timeout:8000})` → ok if exits 0
- fallback to `python3 -m agent_reach doctor` if the bare command isn't on PATH
- `dispatch()`: map `AgentReachChannel` → upstream CLI above; wrap in `{timeout:60000, encoding:'utf8'}`; `String(stdout)` (promisified execFile stdout is `string|Buffer`)
- never fabricate CLI output when the channel/tool is absent — return `down` + scaffold note
