from typing import List
from fastapi import APIRouter, HTTPException, Depends
from app.schemas.task import TaskRequest, MicroStep
from app.services.ai.gemini_service import GeminiService
from app.services.ai.base import LLMService

router = APIRouter()

def get_ai_service() -> LLMService:
    return GeminiService()

@router.post("/decompose", response_model=List[MicroStep])
async def decompose_task(
    request: TaskRequest,
    ai_service: LLMService = Depends(get_ai_service)
):
    """
    Takes a vague task and breaks it down into atomic micro-steps using AI.
    """
    steps = await ai_service.decompose_task(
        request.objective,
        model=request.model,
        api_key=request.api_key,
        system_instruction=request.system_instruction
    )
    if not steps:
        raise HTTPException(
            status_code=500, 
            detail="Failed to decompose task. The AI might have returned an invalid format."
        )
    return steps
