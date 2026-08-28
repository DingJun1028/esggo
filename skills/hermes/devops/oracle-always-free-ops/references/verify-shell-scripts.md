# Verifying shell provisioning scripts without a live target

When `terminal`/SSH is locked or the cloud API is unreachable, you can still prove a
`bash` script's *control flow* (no early abort under `set -e`, retry loops fire, files emit)
using a stubbed binary. This does NOT verify real API behavior — only syntax + flow.

## Pattern (Windows git-bash, real execution)

```bash
SF="C:/Project/esggo-learning-center/oracle-always-free/oracle_always_free_setup.sh"
echo "=== syntax ==="
bash -n "$SF" && echo "SYNTAX_OK"

echo "=== mock-run (stub oci, set -e active) ==="
TMP=$(mktemp -d)
# stub oci: simulate Out-of-host-capacity once then succeed, else return ids
cat > "$TMP/oci" <<'STUB'
#!/usr/bin/env bash
a="$*"
[[ "$a" == *"instance launch"* ]] && { [ -f /tmp/ff ] || { touch /tmp/ff; echo 'ServiceError: Out of host capacity.' >&2; exit 1; }; echo '{"data":{"id":"x"}}'; exit 0; }
[[ "$a" == *"list"* ]] && { echo '{"data":[]}'; exit 0; }
echo '{"data":{"id":"x"}}'; exit 0
STUB
chmod +x "$TMP/oci"; rm -f /tmp/ff
export PATH="$TMP:$PATH" \
  TENANCY_OCID=ocid1.t COMPARTMENT_OCID=ocid1.c REGION=ap-singapore-1 \
  AD=xzUx:AD-1 PREFIX=esggo-af INVENTORY="$TMP/inv.json" \
  ADB_ADMIN_PWD='Test123!' SUBNET_OCID=ocid1.s ALARM_TOPIC_OCID=ocid1.tp
bash "$SF" > "$TMP/r.log" 2>&1; echo "exit=$?"
grep -q "佈建完成" "$TMP/r.log" && echo "END: YES" || echo "END: NO"
grep -q "Out of host capacity" "$TMP/r.log" && echo "RETRY: YES" || echo "RETRY: NO"
grep -q "keepalive.sh" "$TMP/r.log" && echo "KEEPALIVE: YES" || echo "KEEPALIVE: NO"
rm -f af_inventory.json 2>/dev/null
```

## Gotchas
- `env VAR=... bash` form breaks if a value contains a Windows path with spaces
  (e.g. `$(dirname $(which bash))` → `Files/...`). Prefer `export PATH=...` separately.
- The script's `INVENTORY` default (`af_inventory.json`) writes to cwd, not `$INVENTORY`,
  when the heredoc block uses a literal name — check the right path.
- A stub returning `'{"data":[]}'` for lists mimics "no resources yet" and proves the
  `set -e` guards (`|| true` on count-greps) do not abort the script.
