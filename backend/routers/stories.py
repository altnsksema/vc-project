from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session, joinedload
import models, database
from database import get_db, redis_client

router = APIRouter(prefix="/api/stories", tags=["Stories"])

# --- MOCK DATA (Postgres tamir edilene kadar can simidimiz) ---
MOCK_DATA = {
    1: {
        "story_info": {"id": 1, "title": "Vadideki Zambak", "author": "Balzac", "summary": "İmkansız bir aşkın ve sadakatin derin hikayesi."},
        "chapters": [{"id": 101, "title": "1. Bölüm: Vadinin Esrarı"}, {"id": 102, "title": "2. Bölüm: Kontesin Sırrı"}],
        "live_views": 1250
    },
    2: {
        "story_info": {"id": 2, "title": "Sefiller", "author": "Victor Hugo", "summary": "Jean Valjean'ın adalet arayışı."},
        "chapters": [{"id": 201, "title": "Karanlık Bir Gece"}],
        "live_views": 850
    }
}

@router.get("/")
def list_stories(db: Session = Depends(get_db), skip: int = 0, limit: int = 10):
    try:
        # Önce DB'den çekmeyi dene
        stories = db.query(models.Story).offset(skip).limit(limit).all()
        if stories:
            return {"toplam": len(stories), "kesfet": stories}
    except Exception as e:
        print(f"DB Bağlantı Hatası: {e}")
    
    # DB yoksa veya boşsa MOCK veriyi dön (Frontend "string" görmesin!)
    mock_list = [v["story_info"] for v in MOCK_DATA.values()]
    return {"toplam": len(mock_list), "kesfet": mock_list}

@router.get("/{story_id}")
def get_story(story_id: int, db: Session = Depends(get_db)):
    try:
        story = db.query(models.Story).options(joinedload(models.Story.chapters)).filter(models.Story.id == story_id).first()
        if story:
            redis_key = f"story:{story_id}:views"
            live_views = redis_client.incr(redis_key)
            return {"story_info": story, "chapters": story.chapters, "live_views": live_views}
    except Exception:
        pass

    # DB hatasında MOCK veriden getir
    if story_id in MOCK_DATA:
        return MOCK_DATA[story_id]
    
    raise HTTPException(status_code=404, detail="Hikaye bulunamadı")