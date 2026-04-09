from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from pydantic import BaseModel

router = APIRouter(prefix="/api/users", tags=["Users"])

# İstek Şablonu (Frontend'den gelen veri yapısı)
class UserUpdate(BaseModel):
    bio: str

# Kullanıcı bilgilerini getirme (Profil sayfasında bio'nun görünmesi için)
@router.get("/{username}")
def get_user_profile(username: str, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == username).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı")
    return db_user

# Profil güncelleme (PUT isteği)
@router.put("/{username}")
def update_profile(username: str, user_data: UserUpdate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.username == username).first()
    
    if not db_user:
        raise HTTPException(status_code=404, detail="Kullanıcı bulunamadı!")

    db_user.bio = user_data.bio
    db.commit()
    db.refresh(db_user)
    
    return {"message": "Profil başarıyla mühürlendi", "bio": db_user.bio}