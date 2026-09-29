import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import httpx

from app.config import settings
from app.services.chunking import chunk_text
from app.services.document_loader import extract_pdf_text
from app.services.embeddings import create_embedding


KNOWLEDGE_DIR = Path(__file__).resolve().parents[1] / "data" / "knowledge"


async def main():
    headers = {
        "x-internal-api-key": settings.internal_api_key,
    }

    async with httpx.AsyncClient(timeout=60.0) as client:
        for pdf_path in KNOWLEDGE_DIR.glob("*.pdf"):
            print(f"Indexing: {pdf_path.name}")

            text = extract_pdf_text(pdf_path)
            chunks = chunk_text(text)

            document_response = await client.post(
                f"{settings.commerce_api_url}/knowledge/documents",
                headers=headers,
                json={
                    "title": pdf_path.stem,
                    "source": pdf_path.name,
                },
            )

            document_response.raise_for_status()

            document_id = document_response.json()["data"]["id"]
            chunk_payload = []

            for index, chunk in enumerate(chunks):
                embedding = create_embedding(chunk)
                chunk_payload.append({
                    "chunkIndex": index,
                    "content": chunk,
                    "embedding": embedding,
                })

            save_response = await client.post(
                f"{settings.commerce_api_url}/knowledge/chunks",
                headers=headers,
                json={
                    "documentId": document_id,
                    "chunks": chunk_payload,
                },
            )

            save_response.raise_for_status()

            print(f"Indexed {len(chunks)} chunks")


if __name__ == "__main__":
    asyncio.run(main())
