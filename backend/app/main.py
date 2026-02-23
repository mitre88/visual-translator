from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("🚀 Starting Visual Translator Backend")
    
    # Create database tables (to be implemented)
    # Base.metadata.create_all(bind=engine)
    
    # Initialize services (to be implemented)
    # app.state.video_service = VideoService()
    # app.state.ai_service = AIService()
    
    yield
    
    # Shutdown
    print("👋 Shutting down Visual Translator Backend")

app = FastAPI(
    title="Visual Translator API",
    description="Backend para traducción de videos a lenguaje de señas con avatares IA",
    version="0.1.0",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://visual-translator.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint
@app.get("/")
async def root():
    return {
        "message": "Visual Translator API",
        "version": "0.1.0",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "pending",
            "ai_models": "pending",
            "video_processing": "pending"
        }
    }

# Mount static files for uploaded videos
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
