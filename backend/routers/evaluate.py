from fastapi import APIRouter, HTTPException, File, UploadFile
from pydantic import BaseModel
from typing import Optional
import csv
import io

from agents.relevance_agent import run_relevance_agent
from agents.accuracy_agent import run_accuracy_agent
from agents.hallucination_agent import run_hallucination_agent
from agents.completeness_agent import run_completeness_agent
from agents.verdict_agent import run_verdict_agent
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

def evaluate_single(request: EvaluationRequest):
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

    # Run Completeness Agent
    completeness_result = run_completeness_agent(request.question, request.response)

    # Run Verdict Agent
    verdict_result = run_verdict_agent(
        relevance_result,
        accuracy_result,
        hallucination_result,
        completeness_result
    )

    # Combine results
    return {
        "relevance": relevance_result,
        "accuracy": accuracy_result,
        "hallucination": hallucination_result,
        "completeness": completeness_result,
        "verdict": verdict_result
    }

@router.post("/all")
async def evaluate_all(request: EvaluationRequest):
    logger.info("Received request for /evaluate/all")
    
    if not request.question or not request.response:
        raise HTTPException(status_code=400, detail="Question and response are required fields.")
        
    try:
        combined_result = evaluate_single(request)
        return combined_result
    except Exception as e:
        logger.error(f"Evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during evaluation.")

@router.post("/batch")
async def evaluate_batch(file: UploadFile = File(...)):
    logger.info("Received request for /evaluate/batch")
    
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are supported.")
    
    try:
        contents = await file.read()
        decoded = contents.decode('utf-8')
        reader = csv.DictReader(io.StringIO(decoded))
        
        results = []
        for row in reader:
            req = EvaluationRequest(
                question=row.get('question', ''),
                response=row.get('response', ''),
                reference_answer=row.get('reference_answer', ''),
                source_context=row.get('source_context', '')
            )
            
            if not req.question or not req.response:
                continue
                
            res = evaluate_single(req)
            
            results.append({
                "original_data": row,
                "evaluation": res
            })
            
        return {"batch_results": results}
    except Exception as e:
        logger.error(f"Batch evaluation failed: {str(e)}")
        raise HTTPException(status_code=500, detail="An error occurred during batch evaluation.")
