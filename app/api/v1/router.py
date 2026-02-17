from fastapi import APIRouter
from app.api.v1.endpoints import tasks, context

api_router = APIRouter()
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
api_router.include_router(context.router, prefix="/context", tags=["context"])
