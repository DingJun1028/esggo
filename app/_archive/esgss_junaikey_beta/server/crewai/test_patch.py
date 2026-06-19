
import uvicorn
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

# PATCH UVICORN RUN
original_run = uvicorn.run
def patched_run(*args, **kwargs):
    print("Applying patched uvicorn.run with loop='asyncio'", flush=True)
    kwargs["loop"] = "asyncio"
    return original_run(*args, **kwargs)
uvicorn.run = patched_run
# END PATCH

async def homepage(request):
    return JSONResponse({'hello': 'world'})

routes = [
    Route("/", endpoint=homepage)
]

app = Starlette(debug=True, routes=routes)

if __name__ == "__main__":
    print("Starting minimal Starlette (patched)...", flush=True)
    uvicorn.run(app, host="127.0.0.1", port=8000)
