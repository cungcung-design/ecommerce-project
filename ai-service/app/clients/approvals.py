import httpx

from app.config import settings


async def create_approval(*, user_id: int, tool_name: str, arguments: dict):
    async with httpx.AsyncClient(timeout=10) as client:
        response = await client.post(
            f"{settings.commerce_api_url}/ai/approvals",
            headers={"x-internal-api-key": settings.internal_api_key},
            json={
                "userId": user_id,
                "toolName": tool_name,
                "arguments": arguments,
            },
        )

        response.raise_for_status()

        return response.json()


async def request_order_cancellation(*, user_id: int, order_id: int):
    approval = await create_approval(
        user_id=user_id,
        tool_name="cancel_order",
        arguments={"order_id": int(order_id)},
    )

    return {
        "status": "approval_required",
        "approval_id": approval["id"],
        "order_id": int(order_id),
        "expires_at": approval.get("expiresAt"),
    }
