from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from app.agent import run_agent
from app.config import settings


router = APIRouter()


class SupportRequest(BaseModel):
    message: str


@router.post("/support")
async def support(
    request: SupportRequest,
    x_user_id: int = Header(...),
    x_internal_api_key: str = Header(...),
):
    if x_internal_api_key != settings.internal_api_key:
        raise HTTPException(status_code=401, detail="Unauthorized")

    answer = await run_agent(
        user_message=request.message,
        user_id=x_user_id,
    )

    return {
        "answer": answer,
    }
