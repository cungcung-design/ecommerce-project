from typing import Literal

from pydantic import BaseModel


class TriageResult(BaseModel):
    agent: Literal["commerce", "support", "knowledge"]
    reason: str
