import os
from typing import Dict, Any

class ReportGenerator:
    
    @staticmethod
    def generate_baseline_report(results: Dict[str, Any], output_path: str = "EVALUATION_BASELINE.md"):
        md = f"""# Apex Intelligence Pipeline: Evaluation Baseline

**Execution Mode**: {results.get('execution_mode', 'UNKNOWN')}
**Total Cases Run**: {results.get('total_cases', 0)}
**Domains Represented**: {', '.join(results.get('domains', []))}

## Claim Extraction Metrics
- **Average Precision**: {results.get('avg_precision', 0):.2%}
- **Average Recall**: {results.get('avg_recall', 0):.2%}
- **Unsupported Claim Rate**: {results.get('avg_unsupported_rate', 0):.2%}

## Grounding & Traceability Metrics
- **End-to-End Traceability Pass Rate**: {results.get('traceability_pass_rate', 0):.2%}
- **Total Claims Checked**: {results.get('total_claims_checked', 0)}
- **Orphaned Claims (No Chunk ID)**: {results.get('orphaned_claims', 0)}

## Reasoning Metrics
- **Reasoning Coverage**: {results.get('avg_reasoning_coverage', 0):.2%}
- **Risk Recall**: {results.get('avg_risk_recall', 0):.2%}
- **Agent Diversity Score**: {results.get('avg_agent_diversity', 0):.2%}

## Synthesis Metrics
- **Average Confidence**: {results.get('avg_confidence', 0):.2f}%
- **Synthesis Schema Compliance Rate**: {results.get('schema_compliance_rate', 0):.2%}

## Known Weaknesses & Failures
"""
        
        for failure in results.get("failures", []):
            md += f"- **{failure['case_id']}**: {failure['error']}\n"
            
        if not results.get("failures"):
            md += "- None observed in this run.\n"
            
        md += """
## Live-Model Verification Status
"""
        if results.get('execution_mode') == 'live':
            md += "**VERIFIED**: End-to-End Live Model execution was successfully completed.\n"
        else:
            md += "**BLOCKED BY MISSING CREDENTIAL**: System is in test mode. Live Model Verification was skipped to prevent silent mocking.\n"
            
        md += "\n*Note: Do not claim Apex intelligence is improving yet. This report establishes the baseline.*\n"
            
        with open(output_path, "w") as f:
            f.write(md)
            
        return output_path
