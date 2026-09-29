import json

from openai import OpenAI

from app.agents.product_context import build_product_context
from app.clients.commerce import search_products
from app.clients.inventory import get_inventory
from app.clients.products import get_product
from app.config import settings
from app.tools.definitions import TOOLS


client = OpenAI(api_key=settings.openai_api_key)

COMMERCE_TOOLS = [
    tool
    for tool in TOOLS
    if tool["name"] in [
        "search_products",
        "get_product",
        "get_inventory",
        "find_similar_products",
    ]
]


async def run_commerce_agent(*, message: str, user_id: int, product_context: dict | None = None) -> dict:
    input_items = [{"role": "user", "content": message}]
    tools_used = []

    for _ in range(5):
        response = client.responses.create(
            model=settings.openai_model,
            instructions=(
                "You are the NovaTrend Commerce Specialist. "
                "Help with product questions. "
                "Never invent product data. "
                + build_product_context(product_context)
            ),
            tools=COMMERCE_TOOLS,
            input=input_items,
        )

        input_items += response.output
        calls = [item for item in response.output if item.type == "function_call"]

        if not calls:
            return {"answer": response.output_text, "tools_used": tools_used}

        for call in calls:
            arguments = json.loads(call.arguments)
            tools_used.append(call.name)

            if call.name == "search_products":
                result = await search_products(
                    search=arguments["query"],
                    max_price=arguments.get("max_price"),
                )
            elif call.name == "get_product":
                result = await get_product(product_id=arguments["product_id"])
            elif call.name == "get_inventory":
                result = await get_inventory(product_id=arguments["product_id"])
            elif call.name == "find_similar_products":
                from app.agent_stream import execute_tool

                result = await execute_tool(
                    name=call.name,
                    arguments=arguments,
                    user_id=user_id,
                    product_context=product_context,
                )
            else:
                result = {"error": "Tool not implemented"}

            input_items.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result, default=str),
            })

    return {
        "answer": "Unable to complete the request.",
        "tools_used": tools_used,
    }
