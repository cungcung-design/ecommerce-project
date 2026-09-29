import json

from openai import OpenAI

from app.clients.commerce import search_products
from app.clients.inventory import get_inventory
from app.clients.approvals import request_order_cancellation
from app.clients.orders import (
    create_support_ticket,
    get_order_items,
    get_order_status,
)
from app.clients.products import get_product
from app.config import settings
from app.services.rag import retrieve_context
from app.tools.definitions import TOOLS


client = OpenAI(api_key=settings.openai_api_key)

SYSTEM_INSTRUCTIONS = """
You are the NovaTrend customer support assistant.

Use tools when the answer requires store data.

Rules:
- Never invent order information.
- Never invent store policies.
- Never invent product data.
- Use search_knowledge for policy questions.
- Use search_products, get_product, and get_inventory for product questions.
- Use get_order_status and get_order_items for the authenticated customer's orders.
- Use cancel_order only when the customer asks to cancel their own order.
- Use create_support_ticket when a person needs to follow up.
- Only access the authenticated customer's orders.
- Be concise and helpful.
"""


async def run_agent(*, user_message: str, user_id: int) -> str:
    input_items = [{"role": "user", "content": user_message}]

    for _ in range(5):
        response = client.responses.create(
            model=settings.openai_model,
            instructions=SYSTEM_INSTRUCTIONS,
            tools=TOOLS,
            input=input_items,
        )

        input_items += response.output

        tool_calls = [
            item for item in response.output if item.type == "function_call"
        ]

        if not tool_calls:
            return response.output_text

        for call in tool_calls:
            arguments = json.loads(call.arguments)
            result = await _execute_tool(call.name, arguments, user_id)
            input_items.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result, default=str),
            })

    return "I couldn't complete the request. Please try again."


async def _execute_tool(name: str, arguments: dict, user_id: int) -> dict:
    if name == "search_products":
        products = await search_products(
            search=arguments["query"],
            max_price=arguments.get("max_price"),
        )
        return {"products": products}

    if name == "get_product":
        return await get_product(product_id=arguments["product_id"])

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

    if name == "get_inventory":
        return await get_inventory(product_id=arguments["product_id"])

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

    return {"error": "Unknown tool"}
