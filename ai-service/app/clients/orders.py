import httpx

from app.config import settings


async def get_order_status(
    *,
    order_id: int,
    user_id: int,
) -> dict:
    url = (
        f"{settings.commerce_api_url}"
        f"/orders/{order_id}/status"
    )

    headers = {
        "x-internal-api-key": settings.internal_api_key,
        "x-user-id": str(user_id),
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url, headers=headers)

        if response.status_code == 404:
            return {
                "found": False,
                "message": "Order not found",
            }

        response.raise_for_status()

        return response.json()["data"]


async def get_order_items(
    *,
    order_id: int,
    user_id: int,
) -> dict:
    url = f"{settings.commerce_api_url}/orders/{order_id}/items"
    headers = {
        "x-internal-api-key": settings.internal_api_key,
        "x-user-id": str(user_id),
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url, headers=headers)

        if response.status_code == 404:
            return {
                "found": False,
                "message": "Order not found",
            }

        response.raise_for_status()

        return response.json()["data"]


async def cancel_order(
    *,
    order_id: int,
    user_id: int,
    reason: str | None,
) -> dict:
    url = f"{settings.commerce_api_url}/orders/{order_id}/cancel"
    headers = {
        "x-internal-api-key": settings.internal_api_key,
        "x-user-id": str(user_id),
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            headers=headers,
            json={"reason": reason},
        )

        if response.status_code == 404:
            return {
                "found": False,
                "message": "Order not found",
            }

        response.raise_for_status()

        return response.json()["data"]


async def create_support_ticket(
    *,
    user_id: int,
    subject: str,
    message: str,
) -> dict:
    url = f"{settings.commerce_api_url}/support/tickets"
    headers = {
        "x-internal-api-key": settings.internal_api_key,
        "x-user-id": str(user_id),
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.post(
            url,
            headers=headers,
            json={
                "subject": subject,
                "message": message,
            },
        )

        response.raise_for_status()

        return response.json()["data"]
