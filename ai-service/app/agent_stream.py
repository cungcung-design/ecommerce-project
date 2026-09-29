import json
from typing import AsyncIterator

from app.agents.product_context import build_product_context
from app.clients.approvals import request_order_cancellation
from app.clients.commerce import search_products, semantic_search_products
from app.clients.inventory import get_inventory
from app.clients.orders import (
    create_support_ticket,
    get_order_items,
    get_order_status,
)
from app.clients.products import get_product
from app.config import settings
from app.llm import client
from app.services.embeddings import create_embedding
from app.services.rag import retrieve_context
from app.tools.definitions import TOOLS


SYSTEM_INSTRUCTIONS = """
You are the NovaTrend customer support assistant.

Use tools when necessary.

Rules:
- Never invent store data.
- Never invent order information.
- Only access the authenticated customer's orders.
- cancel_order only requests approval. Tell the customer to confirm in the chat. Do not say the order is already cancelled.
- Be concise and helpful.
"""


def _number(value):
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def compact_product(product):
    if not isinstance(product, dict) or product.get("id") is None:
        return None

    return {
        "id": product.get("id"),
        "name": product.get("name"),
        "price": _number(product.get("price")),
        "imageUrl": product.get("imageUrl"),
        "stock": product.get("stock"),
    }


def compact_products(products):
    compacted = []

    for product in products or []:
        item = compact_product(product)

        if item:
            compacted.append(item)

    return compacted[:6]


def compact_order(result):
    if not isinstance(result, dict) or result.get("found") is False or result.get("id") is None:
        return None

    return {
        "id": result.get("id"),
        "status": result.get("status"),
        "totalAmount": _number(result.get("totalAmount")),
        "createdAt": str(result.get("createdAt")) if result.get("createdAt") else None,
    }


def compact_sources(results):
    sources = []

    for item in results or []:
        if not isinstance(item, dict):
            continue

        content = item.get("content") or ""
        sources.append({
            "title": item.get("title") or item.get("source") or "Policy",
            "source": item.get("source"),
            "content": content[:280],
        })

    return sources[:3]


async def execute_tool(*, name: str, arguments: dict, user_id: int, product_context: dict | None) -> dict:
    try:
        if name == "search_products":
            return {
                "products": await search_products(
                    search=arguments["query"],
                    max_price=arguments.get("max_price"),
                )
            }

        if name == "get_product":
            return await get_product(product_id=arguments["product_id"])

        if name == "get_inventory":
            return await get_inventory(product_id=arguments["product_id"])

        if name == "get_order_status":
            return await get_order_status(
                order_id=arguments["order_id"],
                user_id=user_id,
            )

        if name == "get_order_items":
            return await get_order_items(
                order_id=arguments["order_id"],
                user_id=user_id,
            )

        if name == "cancel_order":
            return await request_order_cancellation(
                user_id=user_id,
                order_id=arguments["order_id"],
            )

        if name == "create_support_ticket":
            return await create_support_ticket(
                user_id=user_id,
                subject=arguments["subject"],
                message=arguments["message"],
            )

        if name == "search_knowledge":
            return {"results": await retrieve_context(arguments["query"])}

        if name == "find_similar_products":
            if not product_context:
                return {"products": [], "message": "No product is currently open."}

            extra = arguments.get("query") or ""
            text = f"{product_context.get('name', '')} {product_context.get('description') or ''} {extra}"
            embedding = create_embedding(text.strip())
            products = await semantic_search_products(embedding=embedding)
            current_id = product_context.get("id")
            products = [
                product
                for product in products
                if str(product.get("id")) != str(current_id)
            ]
            return {"products": products[:4]}

        return {"error": "Unknown tool"}
    except Exception:
        return {"error": "The tool could not complete the request."}


TOOL_AGENTS = {
    "search_products": "commerce",
    "get_product": "commerce",
    "get_inventory": "commerce",
    "find_similar_products": "commerce",
    "get_order_status": "support",
    "get_order_items": "support",
    "cancel_order": "support",
    "create_support_ticket": "support",
    "search_knowledge": "knowledge",
}

TOOL_STATUS = {
    "search_products": "Searching products...",
    "find_similar_products": "Searching similar products...",
    "get_product": "Looking up that product...",
    "get_inventory": "Checking stock...",
    "get_order_status": "Checking your order...",
    "get_order_items": "Checking your order...",
    "cancel_order": "Preparing cancellation...",
    "search_knowledge": "Checking store policies...",
    "create_support_ticket": "Creating a support ticket...",
}


def tool_status(name: str, result: dict) -> str:
    if result.get("status") == "approval_required":
        return "APPROVAL_REQUIRED"

    if result.get("error"):
        return "ERROR"

    return "SUCCESS"


def collect_usage(response, totals: dict) -> None:
    usage = getattr(response, "usage", None)

    if not usage:
        return

    totals["seen"] = True
    totals["input"] += getattr(usage, "input_tokens", 0) or 0
    totals["output"] += getattr(usage, "output_tokens", 0) or 0
    totals["total"] += getattr(usage, "total_tokens", 0) or 0


def ui_events_for_tool(name: str, result: dict):
    events = [{
        "type": "tool",
        "tool": name,
        "agent": TOOL_AGENTS.get(name, "assistant"),
        "status": tool_status(name, result),
    }]

    if name in {"search_products", "find_similar_products"}:
        products = compact_products(result.get("products"))

        if products:
            events.append({"type": "products", "products": products})

    elif name == "get_product":
        products = compact_products([result])

        if products:
            events.append({"type": "products", "products": products})

    elif name == "get_order_status":
        order = compact_order(result)

        if order:
            events.append({"type": "order", "order": order})

    elif name == "search_knowledge":
        sources = compact_sources(result.get("results"))

        if sources:
            events.append({"type": "sources", "sources": sources})

    elif name == "cancel_order" and result.get("status") == "approval_required":
        events.append({
            "type": "approval_required",
            "approval_id": result["approval_id"],
            "tool": "cancel_order",
            "data": {"order_id": result["order_id"]},
            "expires_at": result.get("expires_at"),
        })

    return events


async def stream_agent(
    *,
    user_message: str,
    user_id: int,
    conversation_messages: list[dict],
    product_context: dict | None = None,
) -> AsyncIterator[dict]:
    instructions = SYSTEM_INSTRUCTIONS + build_product_context(product_context)
    input_items = [
        *conversation_messages,
        {"role": "user", "content": user_message},
    ]
    totals = {"seen": False, "input": 0, "output": 0, "total": 0}

    for _ in range(5):
        async with client.responses.stream(
            model=settings.openai_model,
            instructions=instructions,
            tools=TOOLS,
            input=input_items,
        ) as stream:
            async for event in stream:
                if event.type == "response.output_text.delta":
                    yield {"type": "token", "text": event.delta}

            response = await stream.get_final_response()

        input_items += response.output
        collect_usage(response, totals)

        tool_calls = [
            item for item in response.output if item.type == "function_call"
        ]

        if not tool_calls:
            if totals["seen"]:
                yield {
                    "type": "usage",
                    "input": totals["input"],
                    "output": totals["output"],
                    "total": totals["total"],
                }
            return

        for call in tool_calls:
            arguments = json.loads(call.arguments)
            yield {
                "type": "status",
                "message": TOOL_STATUS.get(call.name, "Working..."),
            }
            result = await execute_tool(
                name=call.name,
                arguments=arguments,
                user_id=user_id,
                product_context=product_context,
            )

            for ui_event in ui_events_for_tool(call.name, result):
                yield ui_event

            input_items.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result, default=str),
            })

    if totals["seen"]:
        yield {
            "type": "usage",
            "input": totals["input"],
            "output": totals["output"],
            "total": totals["total"],
        }

    yield {"type": "token", "text": "I couldn't complete the request. Please try again."}
