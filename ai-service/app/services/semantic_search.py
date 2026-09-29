from app.clients.commerce import semantic_search_products
from app.services.embeddings import create_embedding


async def semantic_search(
    query: str,
    max_price: float | None = None,
):
    embedding = create_embedding(query)

    return await semantic_search_products(
        embedding=embedding,
        max_price=max_price,
    )
