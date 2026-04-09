from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from database import Base
import datetime

# KULLANICI TABLOSU (Yeni eklendi)
class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    # Profil bilgileri
    bio = Column(Text, default="Kelimelerin gücüyle evrenler inşa eden bir hayalperest.")
    avatar = Column(String, default="https://via.placeholder.com/150")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

# HİKAYE TABLOSU
class Story(Base):
    __tablename__ = "stories"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    summary = Column(Text)
    author = Column(String) # İleride User.username ile eşleşecek
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    chapters = relationship("Chapter", back_populates="story", cascade="all, delete-orphan")

# BÖLÜM TABLOSU
class Chapter(Base):
    __tablename__ = "chapters"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    content = Column(Text)
    story_id = Column(Integer, ForeignKey("stories.id"))

    story = relationship("Story", back_populates="chapters")