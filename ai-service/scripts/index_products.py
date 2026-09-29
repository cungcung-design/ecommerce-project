import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx
from openai import AsyncOpenAI

from app.config import settings


openai_client = AsyncOpenAI(
    api_key=settings.openai_api_key,
)


async def main():
    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    async with httpx.AsyncClient(timeout=30.0) as http:
        response = await http.get(
            f"{settings.commerce_api_url}/products/embedding-source",
            headers=headers,
        )

        response.raise_for_status()

        products = response.json()["data"]
        items = []

        for product in products:
            category = (
                product["category"]["name"]
                if product.get("category")
                else ""
            )

            text = "\n".join([
                product["name"],
                product.get("description") or "",
                f"Category: {category}",
            ])

            embedding_response = await openai_client.embeddings.create(
                model=settings.openai_embedding_model,
                input=text,
            )

            items.append({
                "productId": product["id"],
                "embedding": embedding_response.data[0].embedding,
            })

        save_response = await http.post(
            f"{settings.commerce_api_url}/products/embeddings",
            headers=headers,
            json={
                "items": items,
            },
        )

        save_response.raise_for_status()

        print(save_response.json())


if __name__ == "__main__":
    asyncio.run(main())
