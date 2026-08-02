from services.groq_service import groq_service
from services.prompt_service import COMPLETENESS_SYSTEM_PROMPT
from utils.json_parser import extract_and_parse_json
from utils.logger import get_logger

logger = get_logger(__name__)

def run_completeness_agent(question: str, response: str) -> dict:
    logger.info("Running Completeness Agent")
    user_prompt = f"Question: {question}\n\nAI Response: {response}"
    
    try:
        raw_response = groq_service.get_json_response(COMPLETENESS_SYSTEM_PROMPT, user_prompt)
        parsed_json = extract_and_parse_json(raw_response)
        
        if "score" not in parsed_json:
            parsed_json["score"] = 0
            parsed_json["omissions"] = []
            parsed_json["reason"] = "Failed to extract proper score."
            
        return parsed_json
    except Exception as e:
        logger.error(f"Completeness Agent failed: {e}")
        return {"score": 0, "omissions": [], "reason": f"Error: {str(e)}"}
