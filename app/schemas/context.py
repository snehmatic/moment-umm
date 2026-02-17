from datetime import datetime
from pydantic import BaseModel
from typing import Optional

class ContextLogCreate(BaseModel):
    original_thought: str
    summary: Optional[str] = None

class ContextLogRead(BaseModel):
    id: int
    original_thought: str
    summary: Optional[str]
    timestamp: datetime
