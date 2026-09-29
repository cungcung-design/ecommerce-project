def check_agent(actual: str, expected: str) -> bool:
    return actual == expected


def check_tool(actual: list[str], expected: str | None) -> bool:
    if expected is None:
        return True

    return expected in actual


def check_rag_source(sources: list[str], expected_source: str) -> bool:
    return expected_source in sources
