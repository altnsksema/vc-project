from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

# HİKAYE PLANI (Anne tablo)
class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    author = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    # Bu satır sihirli: "Hikayeye gitince bölümleri de göreyim" diyor
    chapters = relationship("Chapter", back_populates="owner", cascade="all, delete-orphan")

# BÖLÜM PLANI (Çocuk tablo)
class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    # Bu satır bölümü hikayeye zincirliyor
    story_id = Column(Integer, ForeignKey("stories.id"))

    owner = relationship("Story", back_populates="chapters")