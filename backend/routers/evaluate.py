from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from agents.relevance_agent import run_relevance_agent
from agents.accuracy_agent import run_accuracy_agent
from agents.hallucination_agent import run_hallucination_agent
from utils.logger import get_logger

logger = get_logger(__name__)

router = APIRouter(
    prefix="/evaluate",
    tags=["evaluate"]
)

class EvaluationRequest(BaseModel):
    question: str
    response: str
    reference_answer: Optional[str] = ""
    source_context: Optional[str] = ""

@router.post("/all")
async def evaluate_all(request: EvaluationRequest):
    logger.info("Received request for /evaluate/all")
    
    if not request.question or not request.response:
        raise HTTPException(status_code=400, detail="Question and response are required fields.")
        
    try:
        # Run Relevance Agent
        relevance_result = run_relevance_agent(request.question, request.response)
        
        # Run Accuracy Agent
        accuracy_result = run_accuracy_agent(
            request.question, 
            request.response, 
            request.reference_answer, 
            request.source_context
        )
        
        # Run Hallucination Agent
        hallucination_result = run_hallucination_agent(
            request.response, 
            request.source_context
        )
        
        # Enforce rule: High accuracy means zero hallucination
        if accuracy_result.get("score", 0) >= 90:
            hallucination_result["hallucination_score"] = 0
            if "Overridden" not in hallucination_result.get("reason", ""):
                hallucination_result["reason"] += " (Note: Hallucination score forced to 0 because accuracy is exceptionally high)."

        # Combine results
        combined_result = {
            "relevance": relevance_result,
            "accuracy": accuracy_result,
            "hallucination": hallucination_result,
        }
        
        return combined_result
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during evaluation.")
