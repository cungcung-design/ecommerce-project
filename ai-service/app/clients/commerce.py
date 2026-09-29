import httpx

from app.config import settings


async def search_products(
    *,
    search: str,
    max_price: float | None = None,
) -> list[dict]:
    url = f"{settings.commerce_api_url}/products/search"

    params = {
        "search": search,
    }

    if max_price is not None:
        params["maxPrice"] = max_price

    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    async with httpx.AsyncClient(timeout=5.0) as client:
        response = await client.get(
            url,
            params=params,
            headers=headers,
        )

        response.raise_for_status()

        data = response.json()

        return data["data"]


async def semantic_search_products(
    *,
    embedding: list[float],
    max_price: float | None = None,
):
    url = f"{settings.commerce_api_url}/products/semantic-search"

    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    payload = {
        "embedding": embedding,
    }

    if max_price is not None:
        payload["maxPrice"] = max_price

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            json=payload,
            headers=headers,
        )

        response.raise_for_status()

        return response.json()["data"]


async def search_knowledge(
    *,
    embedding: list[float],
    limit: int = 5,
):
    url = f"{settings.commerce_api_url}/knowledge/search"

    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    async with httpx.AsyncClient(timeout=10.0) as client:
        response = await client.post(
            url,
            headers=headers,
            json={
                "embedding": embedding,
                "limit": limit,
            },
        )

        response.raise_for_status()

        return response.json()["data"]
