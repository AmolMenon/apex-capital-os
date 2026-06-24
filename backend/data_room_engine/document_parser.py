import logging
from typing import List
from .financial_parser import parse_financials
from .deck_parser import parse_pitch_deck
from .data_room_schemas import ExtractedMetric

logger = logging.getLogger(__name__)

def parse_document(file_path: str, file_name: str, document_category: str) -> List[ExtractedMetric]:
    """
    Routes the uploaded document to the correct specialized parser.
    """
    logger.info(f"Parsing document {file_name} of category {document_category}")
    
    extracted_metrics = []
    
    # Simple routing based on file extension and category
    if file_path.endswith(".xlsx") or file_path.endswith(".csv") or document_category == "financials":
        metrics = parse_financials(file_path, file_name)
        extracted_metrics.extend(metrics)
        
    elif file_path.endswith(".pptx") or document_category == "pitch_deck":
        metrics = parse_pitch_deck(file_path, file_name)
        extracted_metrics.extend(metrics)
        
    else:
        logger.info(f"No specialized parser implemented for {file_name} ({document_category})")
        
    return extracted_metrics
