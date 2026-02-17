from typing import Optional
from datetime import datetime
from sqlmodel import Field, SQLModel

class ContextLogBase(SQLModel):
    original_thought: str
    summary: Optional[str] = None

class ContextLog(ContextLogBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
