
from mcp.server.fastmcp import FastMCP
import uvicorn
import anyio
import os
from dotenv import load_dotenv

from esg_crew import ESGCrew

# Patch anyio.run to force asyncio backend to avoid Trio dependency issues
original_anyio_run = anyio.run
def patched_anyio_run(func, *args, **kwargs):
    print(f"DEBUG: calling patched anyio.run with args={args} kwargs={kwargs}", flush=True)
    kwargs["backend"] = "asyncio"
    return original_anyio_run(func, *args, **kwargs)
anyio.run = patched_anyio_run

# Patch uvicorn.Config to force asyncio loop on Windows to avoid Trio loop issues
original_config_init = uvicorn.Config.__init__
def patched_config_init(self, *args, **kwargs):
    print(f"DEBUG: calling patched uvicorn.Config.__init__ with args={args} kwargs={kwargs}", flush=True)
    kwargs["loop"] = "asyncio"
    original_config_init(self, *args, **kwargs)
uvicorn.Config.__init__ = patched_config_init

# Load environment variables from project root
# Go up two levels from server/crewai to project root
project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
env_path = os.path.join(project_root, '.env')
load_dotenv(env_path)

# Initialize FastMCP server with OAuth dependencies
# Initialize FastMCP server with OAuth dependencies
mcp = FastMCP(
    "ESG CrewAI Service",
    dependencies=["google-auth", "google-auth-oauthlib", "google-auth-httplib2"]
)


@mcp.tool()
def generate_esg_report(organization_id: str, frameworks: list[str]) -> str:
    """
    Generate a comprehensive ESG report for an organization using the ESG CrewAI system.
    
    Args:
        organization_id: The ID of the organization (e.g., "ORG-001")
        frameworks: List of frameworks to use (e.g., ["GRI", "SASB", "TCFD"])
    """
    try:
        # Check for Google OAuth Credentials
        if not os.getenv("GOOGLE_OAUTH_CLIENT_ID") or not os.getenv("GOOGLE_OAUTH_CLIENT_SECRET"):
            return "Error: Google OAuth credentials not found in env. Please configure GOOGLE_OAUTH_CLIENT_ID and GOOGLE_OAUTH_CLIENT_SECRET."

        # Initialize Crew
        esg_crew = ESGCrew()
        
        # Create Report Crew
        crew = esg_crew.create_esg_report_crew(
            organization_id=organization_id,
            frameworks=frameworks
        )
        
        # Execute
        result = crew.kickoff()
        
        # Validate with SSOT
        validated = esg_crew.validate_with_ssot(result)
        
        return f"Report Generated Successfully!\nSSOT ID: {validated['ssot_id']}\nStatus: {validated['status']}\n\nResult:\n{result}"
    
    except Exception as e:
        return f"Error generating report: {str(e)}"

@mcp.tool()
def analyze_esg_trend(topic: str) -> str:
    """
    Analyze current ESG trends for a specific topic using the Intelligence Aggregator agent.
    
    Args:
        topic: The ESG topic to analyze (e.g., "Carbon Pricing 2026")
    """
    try:
        esg_crew = ESGCrew()
        agent = esg_crew.agents.create_intelligence_aggregator()
        
        task = f"Analyze the latest trends and authoritative sources regarding: {topic}"
        result = agent.execute_task(task)
        
        return f"Trend Analysis for {topic}:\n\n{result}"
    except Exception as e:
        return f"Error analyzing trend: {str(e)}"

if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(description="ESG CrewAI Service")
    parser.add_argument("--transport", default="stdio", choices=["stdio", "sse"], help="Transport protocol to use")
    parser.add_argument("--host", default="0.0.0.0", help="Host to bind to")
    parser.add_argument("--port", type=int, default=8000, help="Port to listen on")
    
    args = parser.parse_args()
    
    # Update settings based on arguments
    mcp.settings.host = args.host
    mcp.settings.port = args.port
    
    print(f"Starting ESG CrewAI Service on {args.host}:{args.port} with {args.transport} transport", flush=True)
    
    # Run with specified transport
    mcp.run(transport=args.transport)
