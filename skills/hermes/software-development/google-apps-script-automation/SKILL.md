---
name: google-apps-script-automation
description: Deploy/automate Google Apps Script projects from CLI using clasp, verify doGet/JSONP endpoints, and fix deployment issues without manual editor work.
---

# Google Apps Script Automation via clasp

Use Google Apps Script to automate backend tasks: Drive folder watching, Sheets sync, JSON/JSONP web endpoints, and trigger-based workflows.

## When to use

- You want Drive/Sheets automation without a server
- You need a public JSONP/JSON webhook for a static frontend
- You need to redeploy `doGet` quickly from local terminal

## Prerequisites

1. `npm install -g @google/clasp`
2. `clasp login` once, running interactively
3. The target Google account must have access to the script project. If `clasp list` shows the project but `clasp clone` fails with `Invalid argument`, the script ID is likely a project alias-form. Use the actual script ID from the `d/<ID>/edit` path, not the display name.

## Core workflow

### 1. Discover the script ID

```bash
clasp list
```

Output lines like:
```
Project Name - https://script.google.com/d/<SCRIPT_ID>/edit
```

### 2. Clone existing project

```bash
mkdir -p /tmp/myapp && cd /tmp/myapp
clasp clone <SCRIPT_ID>
```

Creates:
- `程式碼.js` / `Code.gs` (server JS)
- `appsscript.json` (manifest)
- `.clasp.json`

If `appsscript.json` was removed or is malformed, create `.clasp.json` only:

```json
{"scriptId":"<SCRIPT_ID>","rootDir":"."}
```

### 3. Update source

Copy the new `.gs` source into `程式碼.js` or `Code.gs`. Keep manifest minimal:

```json
{"timeZone":"Asia/Taipei","exceptionLogging":"STACKDRIVER","runtimeVersion":"V8"}
```

### 4. Push deploy

```bash
clasp push
clasp deploy
```

`clasp deploy` prints the new deployment ID and Web App URL. Note: this generates a new deployment; the old URL no longer represents the updated code.

## Verification

```bash
curl -sL "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec"
curl -sL "https://script.google.com/macros/s/<DEPLOYMENT_ID>/exec?callback=test123"
```

The `/exec` path returns 302 redirect; follow with `-L`.

Expected responses:
- No callback: `{"updatedAt":"...","videos":[...]}`
- With callback: `test123({"updatedAt":"...","videos":[...]})`

## Frontend integration

Frontends should read the Web App URL from env vars instead of hardcoding it:

```js
import.meta.env.VITE_REPLAY_WEB_APP_URL
```

## Pitfalls

- **"找不到 doGet" with code that already has doGet**: The deployment type is likely wrong. Even if the code contains `doGet`, if it was deployed as a **Library / Database** instead of **Web app**, accessing `/exec` returns `Script function not found: doGet`. Fix: redeploy explicitly as **Web app** with `Anyone` access.
- **"找不到 doGet" when code lacks doGet**: Deployed code lacks `doGet(e)`. Re-push; if `clasp push` errors with "Invalid argument", check `appsscript.json` and `.clasp.json` formatting.
- **401 / access-denied HTML**: The Web App isn't set to "Anyone" access. `clasp deploy` cannot change this. Reopen the Apps Script editor once to set it.
- **videos: []**: Usually not an Apps Script error; check the Drive folder ID and MIME allowlist first.
- **Empty `clasp token` command**: No such command in 3.x; use `clasp login` state directly.
- **Google Form creation script as Web App**: If your project's goal is to automate Google Form creation via `doGet()`, you must deploy as Web App type. A Library/Database deployment with `/exec` URL will never expose `doGet` regardless of access settings.

## References

- `references/apps-script-drive-video-automation.md` — sample `replaySync.gs` pattern
- `references/apps-script-common-errors.md` — quick triage for doGet/auth/redirect errors
