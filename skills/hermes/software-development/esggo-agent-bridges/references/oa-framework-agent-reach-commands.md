# Agent Reach — precise CLI routing (condensed knowledge bank)

Source: `Panniantong/agent-reach` `agent_reach/skill/SKILL.md` + `llms.txt` (fetched live via
`browser_navigate` to raw.githubusercontent.com because Firecrawl web_search/web_extract were
"Payment Required"). Install: `pip install agent-reach` (Python 3.10+). Self-diagnose:
`agent-reach doctor --json`. Auto-install backends: `agent-reach install --env=auto`.

## What it actually is
Agent Reach is a **router + health-checker**, NOT a self-contained search engine. It delegates
execution to upstream open-source CLIs. OA-Team adapter must emit the upstream command, not an
`agent-reach <channel> search` stub (that subcommand does not exist).

## Routing table (use EXACTLY these; do not invent)
| Intent | Upstream command |
|---|---|
| Web search (Exa) | `mcporter call exa.web_search_exa query="..." numResults=5` |
| Read any web page | `curl -s "https://r.jina.ai/<URL>"` |
| GitHub search | `gh search repos "..." --sort stars --limit 10` |
| YouTube transcript | `yt-dlp --write-sub --write-auto-sub --skip-download -o "/tmp/%(id)s" "<URL>"` |
| Bilibili search | `bili search "..." --type video -n 5` |
| Twitter/X search | `twitter search "..." -n 10` (needs env `TWITTER_AUTH_TOKEN` + `TWITTER_CT0`; never log values) |
| Reddit search | `opencli reddit search "..." -f yaml` (desktop) OR `rdt search "..." --limit 10` (server) |
| XiaoHongShu search | `opencli xiaohongshu search "..." -f yaml` |
| Facebook search/groups | `opencli facebook search "..." -f yaml` / `opencli facebook groups -f yaml` |
| Instagram search/user | `opencli instagram search "..." -f yaml` / `opencli instagram user <USERNAME> -f yaml` |
| V2EX hot | `curl -s "https://www.v2ex.com/api/topics/hot.json" -H "User-Agent: agent-reach/1.0"` |
| LinkedIn / XiaoYuzhou / Xueqiu / RSS | see official `references/{career,video,finance,web}.md`; fall back to Exa until implemented |

## Adapter wiring notes (oa-framework pattern)
- `dispatch()` routes by prompt keyword (MECE) → builds the upstream command → runs via
  `execFile` (`shell:true` for the `curl`/`mcporter`/`yt-dlp`/`bili` template forms).
- `doctor()` → `agent-reach doctor --json` (shows active backend per platform).
- `bootstrap()`/`health()` probe `agent-reach --version`, fall back to `python3 -m agent_reach --version`.
- If CLI absent: `health()` → `down`, `dispatch()` → scaffold string. Graceful, non-blocking.
- Sanitize prompt before shell interpolation: strip `"` `` ` `` `$` `\`.

## Channels count
15 platforms: Twitter/X, Reddit, Facebook, Instagram, YouTube, GitHub, Bilibili, XiaoHongShu,
LinkedIn, V2EX, Xueqiu, XiaoYuzhou Podcast, RSS, web search, any web page.
