from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import redis

# Docker-compose'da ayarladığımız veritabanı bilgilerimiz
# Format: postgresql://kullanici_adi:sifre@host:port/veritabani_adi
SQLALCHEMY_DATABASE_URL = "postgresql://admin:password123@127.0.0.1:5433/wattpad_evreni"

# Veritabanı motorumuzu ateşliyoruz
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Veritabanı ile konuşacak oturumlar (Session) için bir fabrika kuruyoruz
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Tablolarımızı türeteceğimiz ana iskelet
Base = declarative_base()

redis_client = redis.Redis(host='127.0.0.1', port=6379, db=0, decode_responses=True)

# Dependency: API'ye her istek geldiğinde yeni bir bağlantı açıp, iş bitince temizce kapatmak için
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()