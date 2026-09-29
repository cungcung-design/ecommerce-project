import httpx

from app.config import settings


async def get_inventory(product_id: int) -> dict:
    url = f"{settings.commerce_api_url}/products/{product_id}/inventory"
    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(url, headers=headers)

        if response.status_code == 404:
            return {
                "found": False,
                "message": "Product not found",
            }

        response.raise_for_status()

        return response.json()["data"]
