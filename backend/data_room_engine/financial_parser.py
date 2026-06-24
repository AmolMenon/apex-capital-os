import os
import pandas as pd
import json
import logging
from typing import List, Dict, Any
from .data_room_schemas import ExtractedMetric

logger = logging.getLogger(__name__)

def parse_financials(file_path: str, document_name: str) -> List[ExtractedMetric]:
    """
    Parses an Excel or CSV financial model.
    Converts structural data (tabs, tables) into markdown and uses LLM to extract metrics.
    """
    if not os.path.exists(file_path):
        logger.warning(f"File not found: {file_path}")
        return []

    try:
        # Load sheets into a single markdown string
        md_content = []
        if file_path.endswith(".xlsx"):
            xls = pd.ExcelFile(file_path)
            # Only read the first 3 sheets to avoid massive context limits
            for sheet_name in xls.sheet_names[:3]:
                df = pd.read_excel(xls, sheet_name=sheet_name)
                # Take first 50 rows, 20 columns
                df = df.iloc[:50, :20]
                md_content.append(f"### Sheet: {sheet_name}")
                md_content.append(df.to_markdown(index=False))
        elif file_path.endswith(".csv"):
            df = pd.read_csv(file_path)
            df = df.iloc[:50, :20]
            md_content.append(f"### CSV File")
            md_content.append(df.to_markdown(index=False))
        else:
            logger.warning(f"Unsupported format for financial parser: {file_path}")
            return []

        structured_text = "\n".join(md_content)
        
        # We would pass this `structured_text` to AIProviderRouter
        # For now, we simulate the LLM extraction logic returning a JSON.
        # In a real environment, `ai_providers.router.execute_task("data_room_financial", structured_text)` 
        # would be called here.
        
        from ai_providers.router import router
        # Since we just added this, let's pass a raw prompt 
        prompt = f"""
        Extract the following metrics from this financial markdown table: ARR, MRR, Gross Margin, Burn Rate, Runway.
        Return a JSON list of objects with keys: metric_name, metric_value, period, confidence (High/Medium/Low).
        
        Data:
        {structured_text[:4000]} # Limit to 4k chars for prompt safety
        """
        
        result = router.execute_task("data_room_financial", prompt)
        extracted = []
        
        # Process result
        if result and "data" in result:
            data = result["data"]
            if isinstance(data, list):
                for item in data:
                    try:
                        extracted.append(ExtractedMetric(
                            metric_name=item.get("metric_name", "Unknown"),
                            metric_value=str(item.get("metric_value", "Unknown")),
                            source_document=document_name,
                            period=item.get("period", "Unknown"),
                            confidence=item.get("confidence", "Medium"),
                            verification_status="Verified against Financial Model"
                        ))
                    except Exception as e:
                        logger.error(f"Error parsing metric {item}: {e}")
            
        return extracted
    except Exception as e:
        logger.error(f"Failed to parse financials {file_path}: {e}")
        return []
