# Secret-wiring pre-flight (placeholder, no real key)

Proves the `set_secrets.py` write + `delete` path is live WITHOUT ever touching a
real credential. Use when a "secret administrator" authorizes you but no real
keys exist client- or server-side (GitHub is write-only; `gh secret list` may be
empty; local `.env` has only placeholders).

## Steps (run from repo root)

1. Confirm there is nothing to read first:
   ```bash
   gh secret list --repo OWNER/REPO        # expect empty or placeholder names only
   grep -nE "^(OPENAI_API_KEY|ELEVENLABS_API_KEY)=sk-" .env 2>/dev/null || echo "no real keys in .env"
   ```

2. Set a clearly-fake key through the helper (env-driven, never echoed):
   ```bash
   OPENAI_API_KEY=sk-TEST_PLACEHOLDER_preflight_0000 python scripts/set_secrets.py
   # expect: "wrote 1 key(s) to .env" + "GitHub secret set: OPENAI_API_KEY"
   ```

3. Confirm it landed in BOTH places:
   ```bash
   gh secret list --repo OWNER/REPO | grep OPENAI_API_KEY     # name present
   grep -q "OPENAI_API_KEY=sk-TEST_PLACEHOLDER" .env && echo "local .env has it"
   ```

4. Delete it from BOTH places (non-interactive — `gh secret delete -y` does NOT exist):
   ```bash
   # GitHub side:
   gh api -X DELETE "repos/OWNER/REPO/actions/secrets/OPENAI_API_KEY"
   # local .env side: strip the line
   python - <<'PY'
   p=".env"; s=open(p,encoding="utf-8").read()
   open(p,"w",encoding="utf-8").write("\n".join(l for l in s.splitlines() if not l.startswith("OPENAI_API_KEY="))+"\n")
   PY
   ```

5. Verify both ends are clean:
   ```bash
   gh secret list --repo OWNER/REPO | grep -q OPENAI_API_KEY && echo "STILL THERE" || echo "github clean"
   grep -q "OPENAI_API_KEY=sk-TEST" .env && echo "STILL THERE" || echo "local clean"
   ```

If step 5 shows "clean" on both ends, the wiring is proven safe to use with real
pasted keys. If either end is NOT clean, fix the `delete` subcommand — usually it
shelled out to `gh secret delete -y` instead of `gh api -X DELETE`, or it forgot
to scrub the local `.env` line.
