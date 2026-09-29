import asyncio
import json
import time
from pathlib import Path

from app.orchestrator import run_multi_agent
from evals.answer_grader import grade_answer
from evals.metrics import check_agent, check_rag_source, check_tool


DATASET_PATH = Path(__file__).resolve().parent / "dataset.json"


async def main():
    dataset = json.loads(DATASET_PATH.read_text(encoding="utf-8"))
    results = []

    for case in dataset:
        print(f"Running {case['id']}...")
        started = time.perf_counter()
        result = await run_multi_agent(message=case["message"], user_id=1)
        latency_ms = round((time.perf_counter() - started) * 1000)

        agent_correct = check_agent(result["agent"], case["expected_agent"])
        tool_correct = check_tool(result["tools_used"], case.get("expected_tool"))
        source_correct = True

        if case.get("expected_source"):
            source_correct = check_rag_source(
                result.get("sources") or [],
                case["expected_source"],
            )

        answer_score = None
        if case.get("reference_answer"):
            answer_score = grade_answer(
                question=case["message"],
                answer=result["answer"],
                reference=case["reference_answer"],
            )

        results.append({
            "id": case["id"],
            "passed": agent_correct and tool_correct and source_correct,
            "agent_correct": agent_correct,
            "tool_correct": tool_correct,
            "source_correct": source_correct,
            "answer_score": answer_score,
            "actual_agent": result["agent"],
            "actual_tools": result["tools_used"],
            "latency_ms": latency_ms,
            "answer": result["answer"],
        })

    passed_count = sum(item["passed"] for item in results)
    total = len(results)
    score = passed_count / total if total else 0

    print()
    print(f"Score: {score:.2%}")

    for item in results:
        status = "PASS" if item["passed"] else "FAIL"
        extra = ""
        if item["answer_score"] is not None:
            extra = f" answer={item['answer_score']}"
        print(f"{status} {item['id']} {item['latency_ms']}ms{extra}")


if __name__ == "__main__":
    asyncio.run(main())
