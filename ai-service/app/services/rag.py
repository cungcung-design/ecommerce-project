from openai import OpenAI

from app.clients.commerce import search_knowledge
from app.config import settings
from app.services.embeddings import create_embedding


client = OpenAI(
    api_key=settings.openai_api_key,
)


async def retrieve_context(query: str):
    query_embedding = create_embedding(query)

    return await search_knowledge(
        embedding=query_embedding,
        limit=5,
    )


def generate_answer(query: str, documents: list[dict]) -> str:
    context = "\n\n".join(
        f"Source: {doc['source']}\n{doc['content']}"
        for doc in documents
    )

    response = client.responses.create(
        model=settings.openai_model,
        instructions=(
            "Answer using only the provided "
            "business knowledge. "
            "Do not invent policies or facts. "
            "If the answer is not supported by "
            "the context, say that the information "
            "is not available in the knowledge base."
        ),
        input=(
            f"Question:\n{query}\n\n"
            f"Knowledge:\n{context}"
        ),
    )

    return response.output_text
