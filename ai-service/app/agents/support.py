import json

from openai import OpenAI

from app.clients.approvals import request_order_cancellation
from app.clients.orders import (
    create_support_ticket,
    get_order_items,
    get_order_status,
)
from app.config import settings
from app.tools.definitions import TOOLS


client = OpenAI(api_key=settings.openai_api_key)

SUPPORT_TOOLS = [
    tool
    for tool in TOOLS
    if tool["name"] in [
        "get_order_status",
        "get_order_items",
        "cancel_order",
        "create_support_ticket",
    ]
]


async def run_support_agent(*, message: str, user_id: int) -> dict:
    input_items = [{"role": "user", "content": message}]
    tools_used = []

    for _ in range(5):
        response = client.responses.create(
            model=settings.openai_model,
            instructions=(
                "You are the NovaTrend Customer Support Specialist. "
                "Help with orders and support. "
                "Never access another customer's order."
            ),
            tools=SUPPORT_TOOLS,
            input=input_items,
        )

        input_items += response.output
        calls = [item for item in response.output if item.type == "function_call"]

        if not calls:
            return {"answer": response.output_text, "tools_used": tools_used}

        for call in calls:
            arguments = json.loads(call.arguments)
            tools_used.append(call.name)

            if call.name == "get_order_status":
                result = await get_order_status(
                    order_id=arguments["order_id"],
                    user_id=user_id,
                )
            elif call.name == "get_order_items":
                result = await get_order_items(
                    order_id=arguments["order_id"],
                    user_id=user_id,
                )
            elif call.name == "cancel_order":
                result = await request_order_cancellation(
                    user_id=user_id,
                    order_id=arguments["order_id"],
                )
            elif call.name == "create_support_ticket":
                result = await create_support_ticket(
                    user_id=user_id,
                    subject=arguments["subject"],
                    message=arguments["message"],
                )
            else:
                result = {"error": "Unknown tool"}

            input_items.append({
                "type": "function_call_output",
                "call_id": call.call_id,
                "output": json.dumps(result, default=str),
            })

    return {
        "answer": "Unable to complete the request.",
        "tools_used": tools_used,
    }
