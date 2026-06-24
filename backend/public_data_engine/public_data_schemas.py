from pydantic import BaseModel, Field
from typing import List, Optional

class Source(BaseModel):
    source_title: str
    source_type: str # company announcement, investor announcement, news article, regulatory filing, public database, analyst estimate
    source_url: str
    date_published: str
    claims_supported: List[str]
    confidence: str # High, Medium, Low
    verification_status: str # Verified public source, Media reported, Company claimed, Analyst assumption, Needs verification

class CompanyPublicProfile(BaseModel):
    company_name: str
    sector: str
    geography: str
    stage: str
    business_model: str
    public_description: str
    known_funding_rounds: List[str]
    known_investors: List[str]
    known_valuation_if_public: str
    public_sources: List[Source]
    unavailable_metrics: List[str]
    analyst_assumptions: List[str]
    source_quality_score: int
    data_confidence: str
    last_updated: str
