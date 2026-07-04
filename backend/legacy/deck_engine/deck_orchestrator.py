from deck_engine.deck_schemas import DeckAnalysisOutput, DeckClaimOutput, MissingDeckSectionOutput
from deck_engine.deck_parser import DeckParser
from deck_engine.section_classifier import SectionClassifier
from deck_engine.claim_extractor import ClaimExtractor
from deck_engine.missing_info_detector import MissingInfoDetector
from deck_engine.financials_extractor import FinancialsExtractor
from deck_engine.traction_extractor import TractionExtractor
from deck_engine.risk_extractor import RiskExtractor
from deck_engine.deck_quality_scorer import DeckQualityScorer
from ai_providers.router import router

class DeckOrchestrator:
    @staticmethod
    def analyze_deck(deal_id: int, deck_name: str, raw_text: str) -> DeckAnalysisOutput:
        # 1. Parse text into chunks
        parsed_sections = DeckParser.parse_text(raw_text)
        
        # 2. Classify sections
        extracted_sections = SectionClassifier.classify(parsed_sections)
        
        # 3. Extract claims (Deterministic base)
        claims = ClaimExtractor.extract(extracted_sections)
        
        # 4. Extract specialized data
        financials = FinancialsExtractor.extract(extracted_sections)
        traction = TractionExtractor.extract(extracted_sections)
        
        # 5. Missing Info (Deterministic base)
        missing_sections = MissingInfoDetector.detect(extracted_sections)
        
        # 6. Risks
        risks = RiskExtractor.extract(extracted_sections, financials.model_dump(), claims)
        
        # 7. AI Augmentation for Claims and Missing Info
        context_str = raw_text[:5000] # Pass first 5000 chars of deck to AI
        ai_deck_analysis_raw = router.execute_task("deck_claim_extraction", context_str)
        ai_deck_analysis = ai_deck_analysis_raw.get("data", {})
        ai_deck_analysis["_ai_metadata"] = ai_deck_analysis_raw.get("metadata", {})
        
        if ai_deck_analysis:
            # Merge AI claims if present
            ai_claims = ai_deck_analysis.get("extracted_claims", [])
            for ac in ai_claims:
                if isinstance(ac, dict) and "claim" in ac:
                    claims.append(DeckClaimOutput(
                        claim_type=ac.get("category", "General"),
                        claim_text=ac.get("claim"),
                        verification_required=not ac.get("is_supported", False),
                        evidence_level="AI Extracted",
                        diligence_question=f"Can you verify the claim: {ac.get('claim')}?"
                    ))
            
            # Merge AI missing info
            ai_missing = ai_deck_analysis.get("missing_info_flags", [])
            for am in ai_missing:
                if isinstance(am, str) and am not in [m.section_name for m in missing_sections]:
                    missing_sections.append(MissingDeckSectionOutput(
                        section_name=am,
                        severity="Medium",
                        why_it_matters="Identified as missing by AI.",
                        suggested_fix="Provide further clarification.",
                        likely_investor_question=f"Can you provide more information on {am}?"
                    ))
        
        # 8. Quality Scorer
        quality_breakdown, readiness_breakdown = DeckQualityScorer.score(extracted_sections, missing_sections, claims)
        
        # Formulate summary
        summary = "The deck presents a complete narrative." if len(missing_sections) < 3 else "The deck is missing several critical components."
        
        questions = [
            "What is the exact breakdown of your customer acquisition cost?",
            "Can you provide a detailed cohort retention analysis?",
            "How do you defend against incumbent platforms bundling this feature?"
        ]
        
        return DeckAnalysisOutput(
            deal_id=deal_id,
            deck_name=deck_name,
            deck_summary=summary,
            deck_quality_score=readiness_breakdown.deck_quality_score,
            investor_readiness_score=readiness_breakdown.investor_readiness_score,
            extracted_sections=extracted_sections,
            key_claims=claims,
            financials=financials,
            traction=traction,
            risks=risks,
            missing_sections=missing_sections,
            quality_breakdown=quality_breakdown,
            readiness_breakdown=readiness_breakdown,
            recommended_follow_up_questions=questions
        )
