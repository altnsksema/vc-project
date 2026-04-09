from fastapi import FastAPI
import models
from database import engine
from routers import stories, chapters, comments, users
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Wattpad Evreni API",
    description="Clean Architecture & Microservices Vibe",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Resepsiyonist yönlendirmeyi yapıyor:
app.include_router(stories.router)
app.include_router(chapters.router)
app.include_router(comments.router)
app.include_router(users.router)

@app.get("/")
def home():
    return {"vibe": "Clean Architecture Active! 🚀"}