from services.groq_service import groq_service
from services.prompt_service import HALLUCINATION_SYSTEM_PROMPT
from utils.json_parser import extract_and_parse_json
from utils.logger import get_logger

logger = get_logger(__name__)

def run_hallucination_agent(response: str, context: str) -> dict:
    logger.info("Running Hallucination Agent")
    user_prompt = f"AI Response: {response}\n\nSource Context: {context}"
    
    try:
        raw_response = groq_service.get_json_response(HALLUCINATION_SYSTEM_PROMPT, user_prompt)
        parsed_json = extract_and_parse_json(raw_response)
        
        # Ensure schema defaults if missing
        if "hallucination_score" not in parsed_json:
            parsed_json["hallucination_score"] = 0
            parsed_json["supported_claims"] = []
            parsed_json["unsupported_claims"] = []
            parsed_json["reason"] = "Failed to extract hallucination data."
            
        return parsed_json
    except Exception as e:
        logger.error(f"Hallucination Agent failed: {e}")
        return {
            "hallucination_score": 0, 
            "supported_claims": [], 
            "unsupported_claims": [], 
            "reason": f"Error: {str(e)}"
        }
