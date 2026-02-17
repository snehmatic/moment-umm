from abc import ABC, abstractmethod
from typing import List
from app.schemas.task import MicroStep

class LLMService(ABC):
    @abstractmethod
    async def decompose_task(self, objective: str, model: str = None, api_key: str = None, system_instruction: str = None) -> List[MicroStep]:
        pass
