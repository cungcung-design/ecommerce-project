from pydantic import BaseModel


class ProductRecommendation(BaseModel):
    product_id: int
    reason: str


class RecommendationResponse(BaseModel):
    recommendations: list[ProductRecommendation]
