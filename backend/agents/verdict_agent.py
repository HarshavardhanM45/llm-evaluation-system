from services.groq_service import groq_service
from services.prompt_service import VERDICT_SYSTEM_PROMPT
from utils.json_parser import extract_and_parse_json
from utils.logger import get_logger

logger = get_logger(__name__)

def run_verdict_agent(relevance: dict, accuracy: dict, hallucination: dict, completeness: dict) -> dict:
    logger.info("Running Verdict Agent")
    
    rel_score = relevance.get("score", 0)
    acc_score = accuracy.get("score", 0)
    comp_score = completeness.get("score", 0)
    hal_score = hallucination.get("hallucination_score", 0)
    
    # Weighted Scoring Model
    # Relevance 30%, Accuracy 40%, Completeness 30%
    # Hallucination Penalty: Subtract hal_score * 0.5
    base_score = (rel_score * 0.3) + (acc_score * 0.4) + (comp_score * 0.3)
    overall_score = max(0, min(100, round(base_score - (hal_score * 0.5))))
    
    fallback_verdict = "Fail"
    if overall_score >= 80:
        fallback_verdict = "Pass"
    elif overall_score >= 60:
        fallback_verdict = "Needs Improvement"

    user_prompt = f"""
Relevance Score: {rel_score} - Reason: {relevance.get('reason')}
Accuracy Score: {acc_score} - Evidence: {accuracy.get('evidence')}
Completeness Score: {comp_score} - Reason: {completeness.get('reason')}
Hallucination Score: {hal_score} - Reason: {hallucination.get('reason')}

Calculated Overall Score: {overall_score}

Please provide a consolidated reasoning summary and final verdict.
"""
    
    try:
        raw_response = groq_service.get_json_response(VERDICT_SYSTEM_PROMPT, user_prompt)
        parsed_json = extract_and_parse_json(raw_response)
        
        parsed_json["overall_score"] = overall_score
        
        if "final_verdict" not in parsed_json:
            parsed_json["final_verdict"] = fallback_verdict
            
        return parsed_json
    except Exception as e:
        logger.error(f"Verdict Agent failed: {e}")
        return {
            "overall_score": overall_score,
            "final_verdict": fallback_verdict,
            "consolidated_reasoning": f"Error generating summary: {str(e)}"
        }
