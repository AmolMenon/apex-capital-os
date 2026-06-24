import json
import re
import logging
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

def extract_json_from_text(text: str) -> str:
    """Extracts a JSON block from a markdown or messy text string."""
    text = text.strip()
    
    # Try to find a markdown json block
    match = re.search(r"```(?:json)?\s*(.*?)\s*```", text, re.DOTALL)
    if match:
        return match.group(1).strip()
        
    # Fallback: try to find the outermost braces
    start_idx = text.find('{')
    end_idx = text.rfind('}')
    
    if start_idx != -1 and end_idx != -1 and end_idx > start_idx:
        return text[start_idx:end_idx+1]
        
    # Return as is, might just be plain JSON
    return text

def safe_parse_json(text: str) -> Optional[Dict[str, Any]]:
    """Safely extracts and parses JSON from text, repairing common issues if needed."""
    try:
        extracted = extract_json_from_text(text)
        return json.loads(extracted)
    except json.JSONDecodeError as e:
        logger.warning(f"Failed to parse initial JSON: {e}")
        
        # Attempt basic repair: remove trailing commas before closing braces/brackets
        try:
            extracted = extract_json_from_text(text)
            repaired = re.sub(r',\s*([\]}])', r'\1', extracted)
            return json.loads(repaired)
        except Exception as repair_e:
            logger.error(f"Failed to parse repaired JSON: {repair_e}")
            return None

def validate_or_fallback(parsed_data: Optional[Dict[str, Any]], fallback_data: Dict[str, Any], required_keys: list = None) -> Dict[str, Any]:
    """Validates the parsed JSON against required keys. If invalid or None, returns fallback."""
    if not parsed_data:
        logger.warning("No parsed data provided. Using fallback.")
        return fallback_data
        
    if required_keys:
        for key in required_keys:
            if key not in parsed_data:
                logger.warning(f"Missing required key '{key}' in parsed JSON. Using fallback.")
                return fallback_data
                
    return parsed_data
