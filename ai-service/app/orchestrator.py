from app.agents.commerce import run_commerce_agent
from app.agents.knowledge import run_knowledge_agent
from app.agents.support import run_support_agent
from app.agents.triage import classify_request


async def run_multi_agent(*, message: str, user_id: int, product_context: dict | None = None):
    triage = classify_request(message)

    if triage.agent == "commerce":
        result = await run_commerce_agent(
            message=message,
            user_id=user_id,
            product_context=product_context,
        )
    elif triage.agent == "support":
        result = await run_support_agent(message=message, user_id=user_id)
    elif triage.agent == "knowledge":
        result = await run_knowledge_agent(message=message)
    else:
        raise RuntimeError("Unknown specialist")

    return {
        "agent": triage.agent,
        "reason": triage.reason,
        "answer": result["answer"],
        "tools_used": result["tools_used"],
        "sources": result.get("sources", []),
    }
