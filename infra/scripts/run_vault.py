#!/usr/bin/env python3
"""Run OmniCore Vault logging for ESG GO project."""

import subprocess
import sys


def main() -> None:
    """Execute vault logging with trace message."""
    msg = """### Execution Trace (OmniCore Matrix):
- 🔍 Viewed: [app/page.tsx]
- ⚡ Ran: []
- 🛠️ Modified: [app/page.tsx] - Injected the WIKI knowledge base portal button into the homepage action group.

### Synthesis & Outcome:
The WIKI pages are now fully accessible from the ESGGO v5.1 homepage, bridging the gap between the landing portal and the newly integrated 51 WIKI Markdown documents."""

    vault_script = r"C:\Users\Administrator\.gemini\antigravity\scripts\omni_vault.py"
    try:
        result = subprocess.run(
            ["python", vault_script, "log", "--project", "ESG GO"],
            input=msg.encode('utf-8'),
            capture_output=True,
            timeout=30,
        )
        if result.returncode != 0:
            print(f"Vault log failed (code {result.returncode}): {result.stderr.decode('utf-8', errors='replace')}")
            sys.exit(result.returncode)
        print("Vault log recorded successfully.")
    except FileNotFoundError:
        print(f"Error: Vault script not found at {vault_script}")
        sys.exit(1)
    except subprocess.TimeoutExpired:
        print("Error: Vault script timed out")
        sys.exit(1)


if __name__ == '__main__':
    main()
