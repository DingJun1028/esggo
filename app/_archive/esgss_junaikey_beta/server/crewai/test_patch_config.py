
import uvicorn
import asyncio
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

# PATCH UVICORN CONFIG
original_config_init = uvicorn.Config.__init__
def patched_config_init(self, *args, **kwargs):
    print("Applying patched uvicorn.Config with loop='asyncio'", flush=True)
    kwargs["loop"] = "asyncio"
    original_config_init(self, *args, **kwargs)
uvicorn.Config.__init__ = patched_config_init
# END PATCH

async def homepage(request):
    return JSONResponse({'hello': 'world'})

routes = [
    Route("/", endpoint=homepage)
]

app = Starlette(debug=True, routes=routes)

async def main():
    print("Starting minimal Starlette (patched Config)...", flush=True)
    # Simulate FastMCP usage
    config = uvicorn.Config(app, host="127.0.0.1", port=8000)
    server = uvicorn.Server(config)
    await server.serve()

if __name__ == "__main__":
    asyncio.run(main())
