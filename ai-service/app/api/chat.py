import json

from fastapi import APIRouter, Header, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from app.agent_stream import stream_agent
from app.config import settings
from app.orchestrator import run_multi_agent


router = APIRouter()


class ProductContext(BaseModel):
    id: int
    name: str
    description: str | None = None
    price: float
    stock: int
    category: str | None = None


class ChatRequest(BaseModel):
    message: str
    conversation_messages: list[dict] = []
    product_context: ProductContext | None = None


def _require_internal_key(api_key: str) -> None:
    if api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")


@router.post("/chat")
async def chat(
    request: ChatRequest,
    x_user_id: int = Header(...),
    x_internal_api_key: str = Header(...),
):
    _require_internal_key(x_internal_api_key)

    return await run_multi_agent(
        message=request.message,
        user_id=x_user_id,
        product_context=(
            request.product_context.model_dump()
            if request.product_context
            else None
        ),
    )


@router.post("/chat/stream")
async def chat_stream(
    request: ChatRequest,
    x_user_id: int = Header(...),
    x_internal_api_key: str = Header(...),
):
    _require_internal_key(x_internal_api_key)

    async def event_generator():
        try:
            async for event in stream_agent(
                user_message=request.message,
                user_id=x_user_id,
                conversation_messages=request.conversation_messages,
                product_context=(
                    request.product_context.model_dump()
                    if request.product_context
                    else None
                ),
            ):
                event_type = event["type"]

                if event_type == "token":
                    payload = json.dumps({"text": event["text"]})
                    yield f"event: token\ndata: {payload}\n\n"
                elif event_type == "products":
                    payload = json.dumps({"products": event["products"]}, default=str)
                    yield f"event: products\ndata: {payload}\n\n"
                elif event_type == "order":
                    payload = json.dumps({"order": event["order"]}, default=str)
                    yield f"event: order\ndata: {payload}\n\n"
                elif event_type == "sources":
                    payload = json.dumps({"sources": event["sources"]}, default=str)
                    yield f"event: sources\ndata: {payload}\n\n"
                elif event_type == "approval_required":
                    payload = json.dumps({
                        "approval_id": event["approval_id"],
                        "tool": event["tool"],
                        "data": event["data"],
                        "expires_at": event.get("expires_at"),
                    }, default=str)
                    yield f"event: approval_required\ndata: {payload}\n\n"
                elif event_type == "status":
                    payload = json.dumps({"message": event["message"]})
                    yield f"event: status\ndata: {payload}\n\n"
                elif event_type == "tool":
                    payload = json.dumps({
                        "tool": event["tool"],
                        "agent": event["agent"],
                        "status": event["status"],
                    })
                    yield f"event: tool\ndata: {payload}\n\n"
                elif event_type == "usage":
                    payload = json.dumps({
                        "input": event["input"],
                        "output": event["output"],
                        "total": event["total"],
                    })
                    yield f"event: usage\ndata: {payload}\n\n"

            yield "event: done\ndata: {}\n\n"
        except Exception as error:
            print("AI streaming error:", error)
            payload = json.dumps({"message": "AI request failed"})
            yield f"event: error\ndata: {payload}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
        },
    )
