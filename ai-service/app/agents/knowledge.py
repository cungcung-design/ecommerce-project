import json

from openai import OpenAI

from app.config import settings
from app.services.rag import retrieve_context
from app.tools.definitions import TOOLS


client = OpenAI(api_key=settings.openai_api_key)

KNOWLEDGE_TOOLS = [
    tool for tool in TOOLS if tool["name"] == "search_knowledge"
]


async def run_knowledge_agent(*, message: str) -> dict:
    input_items = [{"role": "user", "content": message}]
    tools_used = []
    sources = []

    for _ in range(3):
        response = client.responses.create(
            model=settings.openai_model,
            instructions=(
                "You are the NovaTrend Knowledge Specialist. "
                "Answer only from the store knowledge base. "
                "Never invent policies."
            ),
            tools=KNOWLEDGE_TOOLS,
            input=input_items,
        )

        input_items += response.output
        calls = [item for item in response.output if item.type == "function_call"]

        if not calls:
            return {
                "answer": response.output_text,
                "tools_used": tools_used,
                "sources": sources,
            }

        for call in calls:
            arguments = json.loads(call.arguments)
            tools_used.append(call.name)
            results = await retrieve_context(arguments["query"])
            sources.extend(
                result.get("source")
                for result in results
                if result.get("source")
            )

            input_items.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps({"results": results}, default=str),
            })

    return {
        "answer": "Unable to answer from the knowledge base.",
        "tools_used": tools_used,
        "sources": sources,
    }
