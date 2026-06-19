# CrewAI Setup & 4+1 Protocol Integration Guide

## 1. Prerequisites

- Python 3.10+

- Node.js Core Server running (Port 3001)

## 2. Installation

Install the official CrewAI CLI:

```bash

pip install crewai

```

## 3. Scaffolding the Swarm

Create a new crew project using the CLI:

```bash

crewai create crew esg_swarm

cd esg_swarm

```

## 4. Installing the Bridge

To enable **4+1 Protocol** verification (Traceable, Calculable, Immutable), you must use the `ESGssBridge`.

1. Copy `crew_bridge.py` into your `esg_swarm/src/esg_swarm/tools/` folder.

2. Install dependencies:

   ```bash

   pip install requests

   ```

## 5. Configuring Agents (`config/agents.yaml`)

Define your "Thousand-Face" personas here.

```yaml
chief_architect:
  role: >

    Chief Architect

  goal: >

    Design strictly typed, entropy-reduced system architectures.

  backstory: >

    You are a legendary software architect who despises redundancy.

    You enforce the "4+1 Protocol" in every design decision.

guardian_of_esg:
  role: >

    Guardian of ESG

  goal: >

    Audit system outputs for traceability and immutability.

  backstory: >

    You are the gatekeeper of digital trust. Nothing passes without a Hash Lock.
```

## 6. Configuring Tasks (`config/tasks.yaml`)

Bind tasks to the 4+1 Bridge.

```yaml
architectural_audit:
  description: >

    Review the codebase structure.

    Use the `BridgeTool` to log your auditing steps.

  expected_output: >

    A list of non-compliant files.

  agent: chief_architect

final_seal:
  description: >

    Generate the final project hash.

    Use `BridgeTool.lock_project` to seal the era.

  expected_output: >

    SHA-256 Hash of the final artifact.

  agent: guardian_of_esg
```

## 7. Connecting the Bridge (Python Code)

In your `crew.py`:

```python

from crewai import Agent, Crew, Process, Task

from crewai.project import CrewBase, agent, crew, task

from .tools.crew_bridge import ESGssBridge



@CrewBase

class EsgSwarmCrew:

    """EsgSwarm crew"""



    bridge = ESGssBridge(base_url="http://localhost:3001")



    @agent

    def chief_architect(self) -> Agent:

        return Agent(

            config=self.agents_config['chief_architect'],

            tools=[self.bridge.log_step_tool], # Bind Bridge Tool

            verbose=True

        )



    # ... define other agents and tasks ...

```

## 8. Running the Swarm

```bash

crewai run

```

_Watch your Node.js server logs for valid [4 Yes + 1 No] Webhook hits!_

## 9. Deployment Troubleshooting (Connecting to CrewAI AMP)

### Error: `Permission denied (publickey)`

If you see this error when connecting the GitHub Repository:

1.  **Locate the Deploy Key**: On the CrewAI AMP Dashboard, when you add the repository, look for a "Show Public Key" or "Configure" button. Copy the SSH Public Key (starts with `ssh-rsa` or `ssh-ed25519`).

2.  **Add to GitHub**:
    - Go to your GitHub Repository > **Settings** > **Deploy Keys**.

    - Click **Add deploy key**.

    - Title: `CrewAI AMP Deploy Key`.

    - Key: Paste the key you copied.

    - **Important**: Check "Allow write access" if the agent needs to push code changes.

3.  **Alternative (OAuth Reset)**:
    - If using "GitHub OAuth", go to CrewAI AMP Settings > Integrations > GitHub.

    - Disconnect and Reconnect the GitHub App, ensuring you grant permission to the `esgss_junaikey_beta` repository.
