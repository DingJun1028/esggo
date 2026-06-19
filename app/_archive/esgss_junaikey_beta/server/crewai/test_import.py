import sys
import os

# Add current directory to sys.path
sys.path.append(os.getcwd())

print("Importing FastMCP...", flush=True)
from mcp.server.fastmcp import FastMCP
print("FastMCP imported.", flush=True)

print("Starting import test...", flush=True)

try:
    print("Importing ESGCrew...", flush=True)
    from esg_crew import ESGCrew
    print("ESGCrew imported successfully.", flush=True)
    
    print("Initializing ESGCrew...", flush=True)
    crew = ESGCrew()
    print("ESGCrew initialized successfully.", flush=True)
    
except ImportError as e:
    print(f"ImportError: {e}", flush=True)
    import traceback
    traceback.print_exc()
except Exception as e:
    print(f"An error occurred: {e}", flush=True)
    import traceback
    traceback.print_exc()
