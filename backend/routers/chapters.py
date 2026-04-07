from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models
from database import get_db
from pydantic import BaseModel
from typing import List

router = APIRouter(
    prefix="/api/chapters",
    tags=["Chapters"]
)

# --- PYDANTIC MODELLERİ ---
class ChapterCreate(BaseModel):
    title: str
    content: str
    # story_id'yi URL'den alacağımız için buradan sildik!

class ChapterUpdate(BaseModel):
    title: str
    content: str

# --- ENDPOINT'LER ---

# 1. HİKAYEYE BÖLÜM EKLE (POST) -> URL'den story_id alır
@router.post("/story/{story_id}/")
def create_chapter_for_story(story_id: int, chapter: ChapterCreate, db: Session = Depends(get_db)):
    # Hikaye var mı kontrolü (Alstom güvenlik protokolü gibi!)
    story = db.query(models.Story).filter(models.Story.id == story_id).first()
    if not story:
        raise HTTPException(status_code=404, detail="Bölüm eklemek istediğin hikaye bulunamadı!")

    yeni_bolum = models.Chapter(
        title=chapter.title,
        content=chapter.content,
        story_id=story_id  # URL'den gelen ID buraya işlenir
    )
    db.add(yeni_bolum)
    db.commit()
    db.refresh(yeni_bolum)
    return {"mesaj": f"{story_id} ID'li hikayeye bölüm başarıyla eklendi!", "data": yeni_bolum}

# 2. BELİRLİ BİR HİKAYENİN BÖLÜMLERİNİ GETİR (GET)
@router.get("/story/{story_id}/")
def get_chapters_by_story(story_id: int, db: Session = Depends(get_db)):
    chapters = db.query(models.Chapter).filter(models.Chapter.story_id == story_id).all()
    return chapters

# 3. TEK BİR BÖLÜMÜ SİL (DELETE)
@router.delete("/{chapter_id}/")
def delete_chapter(chapter_id: int, db: Session = Depends(get_db)):
    db_chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    if not db_chapter:
        raise HTTPException(status_code=404, detail="Silinecek bölüm bulunamadı!")
    db.delete(db_chapter)
    db.commit()
    return {"mesaj": "Bölüm başarıyla silindi."}

# 5. TEK BİR BÖLÜMÜN DETAYINI GETİR (GET)
# Postman: /api/chapters/1/
@router.get("/{chapter_id}/")
def get_chapter_detail(chapter_id: int, db: Session = Depends(get_db)):
    # Veritabanında bu ID'ye sahip bölümü ara
    chapter = db.query(models.Chapter).filter(models.Chapter.id == chapter_id).first()
    
    if not chapter:
        raise HTTPException(status_code=404, detail="Bölüm içeriği yüklenemedi, belki de silinmiştir!")
    
    return chapter