from pydantic import BaseModel
from typing import List

from typing import Optional

class TaskRequest(BaseModel):
    objective: str
    model: Optional[str] = None
    api_key: Optional[str] = None
    system_instruction: Optional[str] = None

class MicroStep(BaseModel):
    step_number: int
    description: str
    estimated_duration: str  # e.g., "2 mins"
