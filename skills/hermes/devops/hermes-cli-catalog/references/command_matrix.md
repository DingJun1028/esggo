# Hermes Command Matrix (annotated compendium)
> Snapshot generated: 2026-08-08. Source: real `hermes <cmd> --help` dumps (~1546 lines) + hermes-agent cli-reference.md.
> Legend: [LIVE] = executed locally and captured real stdout (exit=0). [DOC] = annotated from --help only; NOT executed (interactive / destructive / credentialed / heavy).

## A. Global flags (调度 / 低風險)
| Flag | Effect | Type | Usage | Integrations |
|---|---|---|---|---|
| (no subcmd) | interactive chat | core | general | chat |
| -V/--version | print version [LIVE v0.20.0] | info | report/debug | status |
| -z/--oneshot PROMPT | one-shot final response only | piping | CI | send, cron |
| -m MODEL --provider P | override model this run | config | A/B | model |
| -t/--toolsets LIST | enable toolsets this run | config | limit perms | tools |
| --resume/-r SESSION | resume by id/title | session | continue | sessions |
| --continue/-c [NAME] | resume latest/named | session | | sessions |
| --worktree/-w | isolated git worktree | git | parallel PRs | kanban |
| --skills/-s SKILL | preload skills | skills | | skills |
| --profile/-p NAME | named profile | profile | multi-id | profile |
| --yolo | skip danger prompts | approvals | scripts | approvals |
| --tui/--cli | force UI mode | ui | | |
| --ignore-rules | skip AGENTS/SOUL/memory | isolation | test | |
| --safe-mode | disable all customizations | debug | troubleshoot | doctor |
| --pass-session-id | include session id in prompt | debug | | |

## B. Chat & Model
- **chat** [DOC]: `hermes chat [-q QUERY] [--image IMG] [-Q] [--checkpoints] [--max-turns N] [--reasoning LVL] [--worktree] [--yolo] [--tui/--cli]`. Effect: interactive chat; -q single non-interactive; --checkpoints enables /rollback; --reasoning none..ultra. Usage: scripted single query (`chat -q "..." -Q`); image Q&A. Integrates: -z oneshot, --checkpoints→checkpoints, --skills→skills.
- **model** [DOC]: interactive provider/model picker. Flags --refresh (refetch /v1/models), --portal-url/--inference-url/--client-id/--scope, --no-browser, --timeout, --ca-bundle/--insecure. Usage: switch OpenAI/Codex/Qwen/xAI OAuth. Integrates: auth, portal, status, setup. (Opens TUI picker — not run live.)
- **moa** [DOC]: `{list,configure,delete}` configure /moa <prompt> model slots. Integrates: chat (/moa), model.
- **fallback** [DOC]: `{list,add,remove,clear}` fallback provider chain on rate-limit/overload. Integrates: model, moa, auth.

## C. Auth & Credentials
- **auth** [DOC]: `{add,list,remove,reset,status,logout,spotify}`. Credential pool auto-rotates, skips exhausted keys. `add` needs `--label` or it hangs on EOF. Usage: multi-key rotation. Integrates: model, portal, gateway, status, proxy. (Sensitive — not run live.)
- **login/logout** [DOC]: login deprecated → use auth/model/setup. `logout --provider {nous,openai-codex,xai-oauth,spotify}`.
- **portal** [DOC]: `{login,info,status,open,tools}`. No subcmd = login Nous Portal + pick model + set provider + Tool Gateway (alias for `auth add nous --type oauth` + `setup --portal`). Usage: 30s onboarding. Integrates: auth, model, tools, status.
- **secrets** [DOC]: `{bitwarden,onepassword}` pull keys from external manager at startup instead of .env. Integrates: config (env-path), auth.

## D. Configuration
- **config** [LIVE show/path/env-path/check]: `{show,edit,get,set,unset,path,env-path,check,migrate}`. show [LIVE] prints config (paths, redacted keys, model, display, terminal, compression). path [LIVE]→config.yaml. env-path [LIVE]→.env. check [LIVE] lists required/optional env vars (config v33 ✓). set/unset modify. Usage: troubleshoot via show/check first. Integrates: doctor, status, skills config, tools.
- **setup** [DOC]: wizard `[model|tts|terminal|gateway|tools|telemetry|agent]`. Flags --non-interactive/--reset/--reconfigure/--quick/--portal. Integrates: model, auth, gateway, tools.
- **doctor** [DOC, heavy]: `[--fix] [--ack ID]`. NOTE: live run timed out at 60s (exit 124) — heavy dep/network checks. Use background or raise timeout. Integrates: config check, hooks doctor, computer-use doctor.
- **status** [LIVE]: `[--all] [--deep]`. Prints env, API keys, Auth Providers (Nous Portal ✓), Tool Gateway (Firecrawl/Browser/Image/Video/TTS/STT ✓), Terminal (local), Messaging (Telegram ✓), Gateway (stopped), Jobs (11 active). Usage: health at a glance. Integrates: doctor, config, auth, gateway, cron.

## E. Tools & Skills
- **tools** [LIVE]: `{list,enable,disable,post-setup} [--summary]`. Lists/enables toolset + MCP (server:tool). Live enabled: web,browser,terminal,file,code_execution,vision,video,image_gen,bfl,x_search,tts,skills,todo,memory,session_search,clarify,delegation,cronjob,homeassistant,spotify,computer_use. Disabled: stt,context_engine,yuanbao. Integrates: computer-use (post-setup), mcp.
- **skills** [LIVE search/list]: `{browse,search,install,inspect,list,check,update,audit,uninstall,reset,list-modified,diff,opt-out,opt-in,repair-official,publish,snapshot,tap,config}`. search test [LIVE] returned 25 from skills.sh/clawhub. Integrates: bundles, curator, sync, kanban, model. (install/uninstall are writes — [DOC].)
- **bundles** [DOC]: `{list,show,create,delete,reload}` one /<name> loads many skills. Integrates: skills.
- **curator** [DOC]: `{status,usage,run,pause,resume,pin,unpin,list-unmanaged,adopt,restore,list-archived,archive,prune,backup,rollback}` background skill maintenance; never auto-deletes. Integrates: skills, memory-graph.
- **sync** [DOC]: `{status,pull,push,now,enable,disable,device,propose}` cross-device + org skill sync. Integrates: skills, profile.

## F. MCP
- **mcp** [DOC]: `{serve,add,remove,list,test,configure,login,reauth,picker,catalog,install}`. add connects server; catalog/install one-click Nous-approved; serve exposes Hermes as MCP server. Integrates: tools, delegate_task, skills.

## G. Messaging Gateway
- **gateway** [DOC]: `{run,start,stop,restart,status,install,uninstall,list,setup,migrate-legacy,enroll}`. run foreground (WSL/Docker/Termux); start/stop systemd/launchd. Integrates: send, cron, webhook, pairing, status.
- **send** [DOC]: `[-t TARGET] [-f PATH] [-s SUBJECT] [-l] [-q] [--json] [msg]`. Pipe shell text to configured platform (reuses .env+config, no LLM). MEDIA:<path> attaches. Target `platform[:chat_id[:thread_id]]`/`platform:#channel`. Usage: CI notify. Integrates: gateway, cron, webhook.
- **whatsapp / whatsapp-cloud / slack** [DOC]: Baileys QR pair; Meta Business Cloud API; slack manifest generator. Integrates: gateway, send.
- **pairing** [DOC]: `{list,approve,revoke,clear-pending}` DM pairing codes. Integrates: gateway, portal.
- **webhook** [DOC]: `{subscribe,list,remove,test}` event-driven activation. Integrates: gateway, send, cron, kanban.
- **proxy** [DOC]: `{start,status,providers}` local OpenAI-compatible proxy to OAuth provider. Integrates: auth, portal, model.

## H. Cron
- **cron** [DOC]: `{list,create,add,edit,pause,resume,run,remove,status,runs,history,tick}`. Schedules '30m'/'every 2h'/'0 9 * * *'/ISO. Live: 11 active jobs. run next tick; tick runs due once. Integrates: send (deliver), gateway, webhook, kanban. (create is a write — [DOC].)

## I. Sessions
- **sessions** [LIVE list/stats]: `{list,export,delete,prune,archive,optimize,clean-markers,optimize-storage,repair,recover,stats,rename,retitle-skills,browse}`. list [LIVE] shows recent (workspace/last active/id). stats [LIVE]: 1391 sessions, 85166 msgs, DB 828.3 MB. export JSONL/MD/QMD; optimize FTS5+VACUUM; repair/recover state.db. Integrates: chat (--resume), session_search, insights.

## J. Insights & Monitoring
- **insights** [LIVE]: `[--days N] [--source SRC]`. 30d: 1391 sessions, 30975 msgs, 13637 tool calls, 2.45B tokens; top model hy3:free; top tool terminal 43%; top skill oa-team-swarm. Usage: cost/usage review. Integrates: sessions, memory-graph, journey.
- **monitoring** [DOC]: `status` only. OTLP export, content-free redaction. Integrates: gateway, status.
- **prompt-size** [LIVE]: `[--platform] [--json]`. Reports fixed prompt budget: system 86.5KB, skills index 22.8KB, tool schemas 78.8KB (44 tools). Usage: context-bloat diagnosis. Integrates: skills, config, memory.

## K. Memory
- **memory** [DOC]: `{setup,status,off,reset}`. External providers (honcho/openviking/mem0/hindsight/holographic/retaindb/byterover), one active. off→built-in only; reset→erase MEMORY.md/USER.md. Integrates: skills, journey, memory-graph.
- **journey / learning / memory-graph** [DOC]: identical impl — terminal Star Map timeline + constellation scrubber. `--reveal/--play/--fps/--width/--height/--no-color/--json`; `{list,delete,edit}`. Integrates: memory, curator, insights.

## L. UI & Personalization
- **skin** [LIVE]: `{list,use,set}`. 9 builtin (default/ares/mono/slate/daylight/warm-lightmode/poseidon/sisyphus/charizard). set ui_tool '#hex'. Integrates: config.
- **pets** [DOC]: `{list,install,select,show,off,scale,remove,doctor}` Petdex animated pets. Integrates: desktop, dashboard.
- **console** [DOC]: curated safe command REPL (not raw shell).

## M. Projects & Kanban
- **project** [DOC]: `{create,list,show,add-folder,remove-folder,rename,set-primary,use,archive,restore,bind-board}`. Multi-folder workspaces; bind kanban for worktree+branch. Integrates: kanban, desktop, profile.
- **kanban** [DOC ~50 verbs]: SQLite task board shared across profiles. init/create/swarm(parallel→verifier→synthesizer)/list/claim/complete/block/schedule/dispatch(daemon→use `gateway start`)/watch/stats/decompose/gc/repair/notify-*. Usage: multi-agent pipelines (OA-Team 30 swarm). Integrates: gateway, project, profile, delegate_task, webhook.

## N. Hooks & Approvals
- **hooks** [DOC]: `{list,test,revoke,remove,doctor}` config.yaml shell-script hooks + allowlist. Integrates: config, approvals, cron (--accept-hooks).
- **approvals** [DOC]: `suggest` mines past approvals → command_allowlist proposals. Integrates: config, hooks, chat (--yolo).

## O. Security & Backup
- **security** [DOC]: `audit` OSV.dev scan of venv/plugins/MCP deps. Integrates: update, plugins, mcp.
- **backup** [DOC]: `[-o OUT] [-q] [-l LABEL]` zip config/skills/sessions (--quick = critical only). Integrates: import, update, checkpoints.
- **import** [DOC]: `[-f] zipfile` restore backup. Integrates: backup.
- **checkpoints** [DOC]: `{status,list,prune,clear,clear-legacy}` shadow-git before destructive ops. clear wipes /rollback history. Integrates: chat (--checkpoints), import.
- **import-agent** [DOC]: `{claude-code,codex}` map another agent's setup (never imports keys). `--dry-run/--overwrite/--yes`. Integrates: setup, skills, config.

## P. Debug & Support
- **dump** [DOC]: `[--show-keys]` compact setup summary for Discord/GitHub. Integrates: doctor, status.
- **debug** [DOC]: `{share,delete}` upload debug report to paste service. `--yes/--lines/--expire/--local/--no-redact/--nous`. Integrates: logs, dump.
- **logs** [LIVE]: `[-n LINES] [-f] [--level] [--session ID] [--since TIME] [--component NAME] [log_name]`. agent/errors/gateway/gui/desktop. Live agent.log showed plugin registration, empty credential pool, tool-availability warnings. Integrates: doctor, status, monitoring.

## Q. Infra (LSP / computer-use / egress / migrate)
- **lsp** [DOC]: `{status,list,install,install-all,restart,which}` post-write semantic diagnostics. Integrates: write_file/patch.
- **computer-use** [DOC]: `{install,status,doctor,permissions}` cua-driver backend. Windows: capture works, click/key need per-approval. Integrates: tools, write_file hook.
- **egress** [DOC]: `{install,setup,start,stop,restart,reload,status,disable,config}` iron-proxy TLS-intercept egress firewall (off by default). Integrates: secrets, config.
- **migrate** [DOC]: `{xai}` rewrite config for retired models. Integrates: config, model.

## R. Desktop / Dashboard / Serve
- **desktop / gui** [DOC]: launch Electron app (install Node deps + build + launch). `--source/--build-only/--skip-build/--force-build/--cwd`. Integrates: serve, dashboard, project, computer-use.
- **dashboard** [DOC]: `[--port 9119] [--host 127.0.0.1] [--skip-build] [--isolated] [--stop] [--status] [--no-open] {register}`. Web admin (requires auth). register → Nous Portal OAuth client id. Integrates: serve, portal, profile.
- **serve** [DOC]: headless JSON-RPC/WebSocket backend for desktop/remote. Same flags as dashboard. Integrates: desktop, dashboard, mcp (serve).

## S. Files / Migrate / Update
- **claw** [DOC]: `{migrate,cleanup,clean}` import from OpenClaw. Integrates: import-agent, skills, memory.
- **update** [DOC high-risk]: `[--gateway] [--check] [--no-backup|--backup] [--yes] [--branch NAME] [--force] [--force-venv]`. Pull git + reinstall. `--check` dry-run. Windows --force may WinError 32; --force-venv dangerous. Integrates: backup, security, doctor.
- **uninstall** [DOC high-risk]: `[--full|--gui|--dry-run|--yes]` remove Hermes. Integrates: backup.
- **acp** [DOC]: `[--accept-hooks|--version|--check|--setup|--setup-browser|--yes]` IDE integration (VS Code/Zed/JetBrains). --setup-browser installs ~400MB Chromium. Integrates: desktop, computer-use.
- **profile** [DOC]: `{list,use,create,delete,describe,show,alias,rename,export,import,install,update,info}` named profiles (own skills/plugins/cron/memories). Integrates: sync, skills, kanban, project, dashboard.
- **completion** [DOC]: `{bash,zsh,fish}` shell completion script.
- **version** [DOC]: print version (alias -V).

## T. Honesty Log
- [LIVE executed, real stdout]: --version, status, config show/path/env-path/check, skin list, skills search, tools list, sessions list/stats, insights, prompt-size, logs.
- [DOC annotated from --help, not executed]: model, moa, fallback, auth, login/logout, portal, secrets, setup, doctor (timed out), gateway, send, whatsapp*, slack, pairing, webhook, proxy, cron (create), skills install/uninstall, bundles, curator, sync, mcp, sessions export/delete/prune, monitoring, memory, journey/learning/memory-graph, pets, console, project, kanban, hooks, approvals, security, backup, import, checkpoints, import-agent, dump, debug, lsp, computer-use, egress, migrate, desktop/gui, dashboard, serve, claw, update, uninstall, acp, profile, completion.
- doctor note: foreground 60s exceeded (exit 124); not a failure, a timeout.
