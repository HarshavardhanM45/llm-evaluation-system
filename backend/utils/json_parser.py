import json
import re
from typing import Dict, Any

def extract_and_parse_json(text: str) -> Dict[str, Any]:
    """
    Attempts to extract JSON from a string and parse it into a dictionary.
    Handles potential markdown formatting or prefix/suffix text from LLM.
    """
    try:
        # First attempt: direct parse
        return json.loads(text)
    except json.JSONDecodeError:
        pass

    # Second attempt: extract from markdown blocks
    match = re.search(r'```(?:json)?(.*?)```', text, re.DOTALL)
    if match:
        json_str = match.group(1).strip()
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
            
    # Third attempt: find the first '{' and last '}'
    start = text.find('{')
    end = text.rfind('}')
    if start != -1 and end != -1 and end > start:
        json_str = text[start:end+1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError:
            pass
            
    # Fallback if all fails
    return {"error": "Failed to parse JSON from LLM output", "raw_output": text}
