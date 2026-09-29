from pydantic import BaseModel, Field


class ProductSearchIntent(BaseModel):
    search: str = ""
    max_price: float | None = Field(
        default=None,
        ge=0,
    )
