# Hermes Update Procedures

## Automated Update Flow

The `hermes update` command follows this process:

1. Checks for running Hermes processes (gateway, desktop app, CLI)
2. Stops gateway processes if found
3. Attempts to update dependencies via pip/uv
4. Pulls latest changes from git (if git-installed)
5. Restarts gateway processes

## Windows-Specific Behavior

On Windows, the update process checks for `.pyd` file locks:
- If Desktop app is running → fails with "Other Hermes processes are running"
- Solution: Close Desktop app before updating

## Manual Update Procedures

### For Git-Installed Hermes

```bash
# Navigate to Hermes installation
cd "$HERMES_HOME/hermes-agent"

# Fetch latest changes
git fetch --depth=1 origin

# Reset to latest (safe - preserves local config)
git reset --hard origin/main

# Verify update
python -m hermes_cli.main --version
```

### For Pip/uv Installed Hermes

```bash
# Activate the Hermes venv
source "$HERMES_HOME/hermes-agent/venv/bin/activate"  # Linux/macOS
# or
& "$HERMES_HOME/hermes-agent/venv/Scripts/Activate.ps1"  # Windows PowerShell

# Update the package
pip install --upgrade hermes-agent

# Verify update
hermes --version
```

## Force Update Options

### `--force-venv`
Skips the process lock check. Use only when certain no Hermes processes are running.

```bash
hermes update --force-venv
```

## Common Update Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| Update hangs | Git state conflicts | Use `git reset --hard origin/main` |
| "No models provided" 400 | UTF-8 BOM in config | Re-save config.yaml as UTF-8 without BOM |
| Update fails silently | Locked .pyd files | Close Desktop app, retry |
| Version mismatch | Partial update | Manually reset to origin/main |