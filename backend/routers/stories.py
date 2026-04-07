from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
from pydantic import BaseModel
from typing import List, Optional
import models
from database import get_db, redis_client

router = APIRouter(prefix="/api/stories", tags=["Stories"])

# --- PYDANTIC MODELLERİ (Veri Doğrulama Şablonları) ---

class StoryBase(BaseModel):
    title: str
    summary: str
    author: str

class StoryCreate(StoryBase):
    pass

class StoryUpdate(StoryBase):
    # PUT isteği için gerekli şablon
    pass

# --- ENDPOINT'LER ---

# 1. TÜM HİKAYELERİ LİSTELE (GET)
@router.get("/")
def list_stories(db: Session = Depends(get_db), skip: int = 0, limit: int = 10):
    stories = db.query(models.Story).offset(skip).limit(limit).all()
    return {"toplam": len(stories), "kesfet": stories}

# 2. HİKAYE DETAYI VE CANLI İZLENME (GET)
@router.get("/{story_id}/")
def get_story(story_id: int, db: Session = Depends(get_db)):
    story = db.query(models.Story).options(joinedload(models.Story.chapters)).filter(models.Story.id == story_id).first()
    
    if not story:
        raise HTTPException(status_code=404, detail="Böyle bir hikaye bulunamadı!")
    
    # Redis ile canlı izlenme sayısını artırıyoruz
    redis_key = f"story:{story_id}:views"
    live_views = redis_client.incr(redis_key)
    
    return {
        "story_info": story, 
        "chapters": story.chapters, 
        "live_views": live_views
    }

# 3. YENİ HİKAYE OLUŞTUR (POST)
@router.post("/")
def create_story(story: StoryCreate, db: Session = Depends(get_db)):
    yeni_hikaye = models.Story(
        title=story.title,
        summary=story.summary,
        author=story.author
    )
    db.add(yeni_hikaye)
    db.commit()
    db.refresh(yeni_hikaye)
    return {"mesaj": "Hikaye başarıyla oluşturuldu", "data": yeni_hikaye}

# 4. HİKAYE GÜNCELLE (PUT)
@router.put("/{story_id}/")
def update_story(story_id: int, story_data: StoryUpdate, db: Session = Depends(get_db)):
    db_story = db.query(models.Story).filter(models.Story.id == story_id).first()
    
    if not db_story:
        raise HTTPException(status_code=404, detail="Güncellenecek hikaye bulunamadı!")

    db_story.title = story_data.title
    db_story.summary = story_data.summary
    db_story.author = story_data.author

    db.commit()
    db.refresh(db_story)
    return {"mesaj": "Hikaye başarıyla güncellendi", "data": db_story}

# 5. TEK BİR HİKAYEYİ SİL (DELETE)
@router.delete("/{story_id}/")
def delete_story(story_id: int, db: Session = Depends(get_db)):
    db_story = db.query(models.Story).filter(models.Story.id == story_id).first()
    
    if not db_story:
        raise HTTPException(status_code=404, detail="Silinmek istenen hikaye bulunamadı!")

    db.delete(db_story)
    db.commit()
    return {"mesaj": f"{story_id} ID'li hikaye başarıyla silindi."}

# 6. TÜM HİKAYELERİ SİL (TOPLU TEMİZLİK - DELETE)
@router.delete("/clear/all/")
def delete_all_stories(db: Session = Depends(get_db)):
    try:
        # DB'deki tüm Story kayıtlarını tek hamlede siler
        num_deleted = db.query(models.Story).delete()
        db.commit()
        return {"mesaj": "Tüm hikayeler silindi, evren sıfırlandı!", "silinen_sayisi": num_deleted}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))