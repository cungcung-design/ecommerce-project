from openai import OpenAI

from app.config import settings
from app.schemas.product_search import ProductSearchIntent


client = OpenAI(
    api_key=settings.openai_api_key,
)


def parse_product_search(query: str) -> ProductSearchIntent:
    response = client.responses.parse(
        model=settings.openai_model,
        input=[
            {
                "role": "developer",
                "content": (
                    "Convert the customer's product request "
                    "into search filters. "
                    "Extract useful product keywords. "
                    "Only set max_price when the user gives "
                    "a clear maximum budget."
                ),
            },
            {
                "role": "user",
                "content": query,
            },
        ],
        text_format=ProductSearchIntent,
    )

    result = response.output_parsed

    if result is None:
        raise RuntimeError("AI search parsing failed")

    return result
