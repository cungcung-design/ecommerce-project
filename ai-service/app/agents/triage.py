from openai import OpenAI

from app.config import settings
from app.schemas.triage import TriageResult


client = OpenAI(api_key=settings.openai_api_key)

TRIAGE_INSTRUCTIONS = """
Classify the customer's request into exactly one specialist.

commerce:
- product search
- product details
- product availability

support:
- order status
- order items
- cancellation
- customer support issues

knowledge:
- return policy
- shipping policy
- warranty
- payment policy
- store information

Choose the specialist that should own the request.
"""


def classify_request(message: str) -> TriageResult:
    response = client.responses.parse(
        model=settings.openai_model,
        instructions=TRIAGE_INSTRUCTIONS,
        input=[{"role": "user", "content": message}],
        text_format=TriageResult,
    )

    result = response.output_parsed

    if result is None:
        raise RuntimeError("Triage classification failed")

    return result
