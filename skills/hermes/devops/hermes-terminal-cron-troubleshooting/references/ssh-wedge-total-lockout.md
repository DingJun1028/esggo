# SSH Wedge — Total Lockout Diagnostic

Exact error strings observed (2026-08-07) when `terminal.backend` points at a dead
SSH host `161.118.248.180`:

```
# terminal tool:
Failed to execute command: SSH connection failed: getsockname failed: Not a socket
Read from remote host 161.118.248.180: Unknown error

# read_file / write_file / patch / search_files:
SSH connection failed: getsockname failed: Not a socket
Read from remote host 161.118.248.180: Unknown error

# computer_use capture/key targeting Hermes.exe:
Permission denied: Cua Driver refuses operations that target its own authorization process
```

## Copy-paste recovery checklist (run OUT-OF-BAND, by the user)

1. Open a real local shell (Windows Terminal / PowerShell — NOT the agent):
   ```
   hermes config set terminal.backend local
   ```
2. Fully close Hermes (exit the app) and relaunch it.
3. In the agent, test:
   ```
   echo OK && pwd
   ```
   - Success → local paths, no SSH error. Wedge cleared.
   - Still `getsockname failed` → the config write didn't apply. Edit manually:
     notepad `C:\Users\<user>\AppData\Local\hermes\config.yaml`
     set `terminal.backend: local`, save, restart Hermes again.

## What does NOT work (do not retry)
- Running `hermes config set ...` through the agent's own wedged terminal (dies on SSH init).
- `computer_use` to start a local terminal / drive Hermes.exe (self-protect refusal + focus theft).
- `read_file` to inspect `config.yaml` (also SSH-wedged).
- Assuming `open_preview` is callable (it's a GUI feature, not an agent tool).

## After recovery
Reach the remote host via the local SSH client, independent of the backend:
```
ssh esggo-vps "uptime && uname -a"
```
