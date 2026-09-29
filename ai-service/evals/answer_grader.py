from openai import OpenAI

from app.config import settings


client = OpenAI(api_key=settings.openai_api_key)


def grade_answer(*, question: str, answer: str, reference: str) -> float:
    response = client.responses.create(
        model=settings.openai_model,
        instructions=(
            "Grade the assistant answer against the reference answer.\n\n"
            "Score from 0 to 1.\n"
            "1 = correct and supported\n"
            "0.5 = partially correct\n"
            "0 = incorrect or unsupported\n"
            "Return only the numeric score."
        ),
        input=(
            f"Question:\n{question}\n\n"
            f"Reference:\n{reference}\n\n"
            f"Assistant:\n{answer}"
        ),
    )

    return float(response.output_text.strip())
