TOOLS = [
    {
        "type": "function",
        "name": "search_knowledge",
        "description": (
            "Search the store knowledge base "
            "for policies, shipping, warranty, "
            "payment, and support information."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": (
                        "The customer's question "
                        "or information request."
                    ),
                },
            },
            "required": ["query"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "search_products",
        "description": (
            "Search active store products. "
            "Use when the customer wants products "
            "matching a description, keyword, or budget."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Product search query",
                },
                "max_price": {
                    "type": ["number", "null"],
                    "description": "Maximum price if specified",
                },
            },
            "required": ["query", "max_price"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "get_product",
        "description": "Get detailed information for one product by product ID.",
        "parameters": {
            "type": "object",
            "properties": {
                "product_id": {"type": "integer"},
            },
            "required": ["product_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "get_order_status",
        "description": "Get the authenticated customer's order status.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "integer"},
            },
            "required": ["order_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "get_order_items",
        "description": "Get the products contained in the authenticated customer's order.",
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "integer"},
            },
            "required": ["order_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "get_inventory",
        "description": "Get current stock for a product.",
        "parameters": {
            "type": "object",
            "properties": {
                "product_id": {"type": "integer"},
            },
            "required": ["product_id"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "cancel_order",
        "description": (
            "Ask the customer to approve cancelling their own order. "
            "This does not cancel the order. "
            "The customer must confirm in the chat."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "order_id": {"type": "integer"},
                "reason": {"type": ["string", "null"]},
            },
            "required": ["order_id", "reason"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "create_support_ticket",
        "description": (
            "Create a customer support ticket "
            "when the issue cannot be resolved automatically."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "subject": {"type": "string"},
                "message": {"type": "string"},
            },
            "required": ["subject", "message"],
            "additionalProperties": False,
        },
        "strict": True,
    },
    {
        "type": "function",
        "name": "find_similar_products",
        "description": (
            "Find products similar to the product the customer is currently viewing."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": ["string", "null"],
                    "description": "Optional extra search words. Use null to use the current product.",
                },
            },
            "required": ["query"],
            "additionalProperties": False,
        },
        "strict": True,
    },
]
