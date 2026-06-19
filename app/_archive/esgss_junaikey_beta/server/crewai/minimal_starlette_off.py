
import uvicorn
from starlette.applications import Starlette
from starlette.responses import JSONResponse
from starlette.routing import Route

async def homepage(request):
    return JSONResponse({'hello': 'world'})

routes = [
    Route("/", endpoint=homepage)
]

app = Starlette(debug=True, routes=routes)

if __name__ == "__main__":
    print("Starting minimal Starlette (lifespan=off)...", flush=True)
    uvicorn.run(app, host="127.0.0.1", port=8000, lifespan="off")
