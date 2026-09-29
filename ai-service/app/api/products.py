from fastapi import APIRouter
from pydantic import BaseModel

from app.services.product_search import parse_product_search
from app.services.semantic_search import semantic_search


router = APIRouter()


class ProductSearchRequest(BaseModel):
    query: str


@router.post("/product-search")
async def product_search(request: ProductSearchRequest):
    intent = parse_product_search(request.query)

    products = await semantic_search(
        query=intent.search or request.query,
        max_price=intent.max_price,
    )

    return {
        "query": request.query,
        "filters": intent.model_dump(),
        "products": products,
    }
