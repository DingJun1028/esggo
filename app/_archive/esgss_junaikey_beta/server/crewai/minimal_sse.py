
import asyncio
import uvicorn
from starlette.applications import Starlette
from starlette.routing import Route
from sse_starlette.sse import EventSourceResponse

async def numbers(request):
    async def generator():
        for i in range(1, 4):
            yield dict(data=i)
            await asyncio.sleep(0.1)
    return EventSourceResponse(generator())

routes = [
    Route("/sse", endpoint=numbers)
]

app = Starlette(debug=True, routes=routes)

if __name__ == "__main__":
    print("Starting minimal SSE...", flush=True)
    uvicorn.run(app, host="127.0.0.1", port=8000)
