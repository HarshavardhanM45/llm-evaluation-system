from services.groq_service import groq_service
from services.prompt_service import ACCURACY_SYSTEM_PROMPT
from utils.json_parser import extract_and_parse_json
from utils.logger import get_logger

logger = get_logger(__name__)

def run_accuracy_agent(question: str, response: str, reference: str, context: str) -> dict:
    logger.info("Running Accuracy Agent")
    user_prompt = f"Question: {question}\n\nAI Response: {response}\n\nReference Answer: {reference}\n\nSource Context: {context}"
    
    try:
        raw_response = groq_service.get_json_response(ACCURACY_SYSTEM_PROMPT, user_prompt)
        parsed_json = extract_and_parse_json(raw_response)
        
        # Ensure schema defaults if missing
        if "score" not in parsed_json:
            parsed_json["score"] = 0
            parsed_json["evidence"] = "Failed to extract evidence."
            parsed_json["missing_information"] = "Failed to extract missing information."
            
        return parsed_json
    except Exception as e:
        logger.error(f"Accuracy Agent failed: {e}")
        return {"score": 0, "evidence": "Error", "missing_information": str(e)}
