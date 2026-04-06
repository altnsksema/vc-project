from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db

router = APIRouter(
    prefix="/api/comments",
    tags=["Comments"]
)

@router.get("/{story_id}")
def get_comments(story_id: int, db: Session = Depends(get_db)):
    # Burayı ileride Yorumlar tablosunu ekleyince dolduracağız
    return {"mesaj": f"{story_id} nolu hikaye için henüz yorum sistemi aktif değil."}