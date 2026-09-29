from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag import generate_answer, retrieve_context


router = APIRouter()


class KnowledgeQuestion(BaseModel):
    query: str


@router.post("/knowledge")
async def knowledge(request: KnowledgeQuestion):
    documents = await retrieve_context(request.query)
    answer = generate_answer(request.query, documents)

    return {
        "query": request.query,
        "answer": answer,
        "sources": [
            {
                "title": doc["title"],
                "source": doc["source"],
                "similarity": doc["similarity"],
            }
            for doc in documents
        ],
    }
