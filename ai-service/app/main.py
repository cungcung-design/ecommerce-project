from fastapi import FastAPI

from app.api.chat import router as chat_router
from app.api.knowledge import router as knowledge_router
from app.api.products import router as product_router
from app.api.support import router as support_router


app = FastAPI(
    title="NovaTrend AI Service",
    version="2.0.0",
)


@app.get("/health")
async def health():
    return {
        "status": "ok",
        "service": "ai-service",
    }


@app.middleware("http")
async def attach_request_id(request, call_next):
    request_id = request.headers.get("x-request-id")
    response = await call_next(request)
    if request_id:
        response.headers["x-request-id"] = request_id
    return response


app.include_router(
    product_router,
    prefix="/api/ai",
)
app.include_router(
    knowledge_router,
    prefix="/api/ai",
)
app.include_router(
    support_router,
    prefix="/api/ai",
)
app.include_router(
    chat_router,
    prefix="/api/ai",
)
