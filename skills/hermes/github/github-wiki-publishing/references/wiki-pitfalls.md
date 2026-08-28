# GitHub Wiki — Session-concrete pitfalls

## 404 on REST wiki listing is not fatal
- `gh api repos/owner/repo/wiki --jq '.[].name'` returns `404 Not Found` even when `gh repo view --json hasWikiEnabled` returns `true`.
- This does **not** mean the wiki is disabled; it usually means no page exists yet or the endpoint requires an alternate write path.
- Always check `hasWikiEnabled` instead of relying on listing endpoints.

## Windows MSYS / git-bash token handling
- `git clone "https://$(gh auth token)@github.com/owner/repo.wiki.git"` works in git-bash/MSYS.
- PowerShell-style env injection (`$env:GITHUB_TOKEN`), `-c credential.helper=...`, and SSH paths are unreliable here.

## Free-tier fit
- Wikis are bundled with repos at no extra cost; no GitHub Pages or external service required.
- Publishing solely through `git clone` + `git push` keeps all operations inside the *GitHub free tier*.

## Verification after publish
- `gh api repos/owner/repo --jq '.has_wiki_enabled'` is the canonical state check.
- Web UI: `https://github.com/owner/repo/wiki` is the final arbiter.
- REST page listing/write endpoints may remain `404` until cache or state propagates; treat that as expected.
