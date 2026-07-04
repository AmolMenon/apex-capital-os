from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
from datetime import datetime

class WebResearchRequest(BaseModel):
    company_name: str
    sector: Optional[str] = None
    geography: Optional[str] = None

class SearchQueryPlan(BaseModel):
    query: str
    purpose: str
    priority: str
    expected_source_type: str

class SearchResult(BaseModel):
    title: str
    url: str
    snippet: str
    published_date: Optional[str] = None
    source_domain: str
    provider: str
    query: str
    rank: int

class FetchedSource(BaseModel):
    url: str
    title: str
    domain: str
    raw_text_excerpt: str
    extracted_text: str
    fetch_status: str
    fetched_at: str
    content_type: str
    error_message: Optional[str] = None

class ExtractedClaim(BaseModel):
    claim_text: str
    claim_type: str
    value: Optional[str] = None
    currency: Optional[str] = None
    source_url: str
    source_title: str
    source_type: str
    confidence: str
    verification_status: str

class SourceConflict(BaseModel):
    claim_a: str
    source_a: str
    claim_b: str
    source_b: str
    severity: str
    likely_resolution: str
    recommended_treatment: str

class EvidenceItem(BaseModel):
    fact: str
    supporting_sources: List[Dict[str, str]]
    conflicting_sources: List[Dict[str, str]]
    confidence: str
    last_updated: str
    importance: str

class PublicDataValidationOutput(BaseModel):
    metric: str
    is_publicly_available: bool
    source_count: int
    confidence: str
    should_use_in_scoring: bool
    should_mark_unknown: bool
    diligence_required: str

class WebResearchSynthesis(BaseModel):
    public_company_snapshot: str
    market_category: str
    funding_signal: str
    investor_signal: str
    product_interpretation: str
    public_traction: str
    what_public_data_supports: str
    what_remains_unknown: str
    private_diligence_questions: List[str]
    hype_vs_evidence: str
    vc_benchmark_conclusion: str

class CitationOutput(BaseModel):
    claim_id: str
    claim_text: str
    sources: List[Dict[str, str]]
    confidence: str
    display_label: str

class WebResearchBrief(BaseModel):
    company_name: str
    research_mode: str
    queries_used: List[SearchQueryPlan]
    sources_reviewed: List[FetchedSource]
    claims_extracted: List[ExtractedClaim]
    verified_public_facts: List[str]
    media_reported_facts: List[str]
    company_claims: List[str]
    investor_claims: List[str]
    analyst_assumptions: List[str]
    unknown_private_metrics: List[PublicDataValidationOutput]
    source_conflicts: List[SourceConflict]
    evidence_graph: List[EvidenceItem]
    source_quality_score: int
    public_data_confidence: str
    vc_synthesis: WebResearchSynthesis
    citations: List[CitationOutput]
    metadata: Dict[str, Any]

