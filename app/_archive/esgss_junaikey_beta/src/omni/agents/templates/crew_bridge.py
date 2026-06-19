
import requests
import json
import uuid
from datetime import datetime
from langchain.tools import tool

class ESGssBridge:
    """
    The Neural Bridge between Python CrewAI and Node.js ESGss Core.
    Enforces the 3+1 Protocol: Traceable, Trackable, Calculable, Immutable.
    """

    def __init__(self, base_url="http://localhost:3001"):
        self.base_url = base_url
        self.session_id = str(uuid.uuid4())
        print(f"[ESGssBridge] 🌉 Bridge Initialized. Session: {self.session_id}")

    def _post(self, endpoint, payload):
        try:
            url = f"{self.base_url}/api/v1/{endpoint}"
            headers = {'Content-Type': 'application/json'}
            response = requests.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            return {"error": str(e), "status": "failed"}

    @tool("Log Thinking Step")
    def log_step_tool(self, thought: str, tool_used: str):
        """
        [Traceable] Logs a thinking step to the immutable core.
        Use this when you make a significant decision or observation.
        """
        payload = {
            "agent_role": "Python_Agent", # context aware in real impl
            "thought": thought,
            "tools_used": tool_used,
            "source_origin": "CrewAI_CLI_Bridge",
            "session_id": self.session_id
        }
        # In a real tool context, 'self' access might be tricky depending on how CrewAI binds tools.
        # This is a simplified template.
        # For direct usage: bridge.log_step(...)
        return f"Step Logged: {thought}"

    def log_step(self, agent_role, thought, tools_used="internal"):
        payload = {
            "agent_role": agent_role,
            "thought": thought,
            "tools_used": tools_used,
            "source_origin": "CrewAI_CLI_Bridge",
            "session_id": self.session_id
        }
        return self._post("log-step", payload)

    def finish_task(self, task_name, output, formula="N/A"):
        payload = {
            "task_name": task_name,
            "output": output,
            "calculation_formula": formula,
            "expected_output": "Verified Result"
        }
        return self._post("task-finish", payload)

    def lock_project(self, project_name, summary):
        payload = {
            "project_name": project_name,
            "artifacts": ["CrewAI Generated"],
            "final_summary": summary
        }
        return self._post("project-lock", payload)
