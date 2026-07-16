from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from utils.logger import get_logger
from routers import evaluate

logger = get_logger(__name__)

app = FastAPI(
    title="AI Evaluation Platform API",
    description="API for evaluating AI-generated answers using Groq models.",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(evaluate.router)

@app.get("/")
def read_root():
    logger.info("Root endpoint accessed")
    return {"status": "ok", "message": "AI Evaluation Platform API is running"}
