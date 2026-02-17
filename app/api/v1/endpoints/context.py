from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.db.session import get_session
from app.models.context_log import ContextLog
from app.schemas.context import ContextLogCreate, ContextLogRead

router = APIRouter()

@router.post("/anchor", response_model=ContextLogRead)
def anchor_context(
    context: ContextLogCreate, 
    session: Session = Depends(get_session)
):
    """
    Saves the user's current thought process to the database.
    """
    db_log = ContextLog.model_validate(context)
    session.add(db_log)
    session.commit()
    session.refresh(db_log)
    return db_log

@router.get("/recover", response_model=ContextLogRead)
def recover_context(session: Session = Depends(get_session)):
    """
    Retrieves the most recent context log to help the user get back on track.
    """
    statement = select(ContextLog).order_by(ContextLog.timestamp.desc())
    result = session.exec(statement).first()
    
    if not result:
        raise HTTPException(status_code=404, detail="No context logs found.")
    
    return result
