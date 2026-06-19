from mcp.server.fastmcp import FastMCP

print("Initializing Minimal FastMCP...", flush=True)
mcp = FastMCP("Debug Service")

@mcp.tool()
def hello() -> str:
    return "Hello world"

if __name__ == "__main__":
    print("Running Minimal FastMCP...", flush=True)
    mcp.run()
