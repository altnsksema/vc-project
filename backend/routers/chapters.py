from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import get_db
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/chapters",
    tags=["Chapters"]
)

class ChapterCreate(BaseModel):
    title: str
    content: str
    story_id: int

@router.post("/")
def create_chapter(chapter: ChapterCreate, db: Session = Depends(get_db)):
    # Önce hikaye var mı kontrol et (Data Integrity)
    story = db.query(models.Story).filter(models.Story.id == chapter.story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Bölüm eklemek istediğin hikaye bulunamadı!")

    yeni_bolum = models.Chapter(
        title=chapter.title,
        content=chapter.content,
        story_id=chapter.story_id
    )
    db.add(yeni_bolum)
    db.commit()
    db.refresh(yeni_bolum)
    return {"mesaj": "Bölüm başarıyla eklendi!", "data": yeni_bolum}