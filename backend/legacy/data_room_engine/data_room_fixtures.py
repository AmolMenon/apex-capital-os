from data_room_engine.data_room_schemas import (
    DataRoomReport,
    DataRoomDocument,
    ExtractedMetric,
    PrivateEvidenceItem,
    DataRoomContradiction,
    ExtractionMethod,
    MetricConfidence,
    VerificationStatus
)
from datetime import datetime, timedelta

def get_neuraldesk_data_room_fixture(deal_id: int) -> DataRoomReport:
    """Provides a rich, completely populated private diligence data room for NeuralDesk to showcase the demo."""
    now = datetime.utcnow()
    
    docs = [
        DataRoomDocument(
            document_id="doc-101",
            deal_id=deal_id,
            file_name="NeuralDesk_Series_A_Deck_vFinal.pdf",
            file_type="application/pdf",
            document_category="Pitch Deck",
            upload_time=now - timedelta(days=2),
            file_size=4500000,
            storage_path="/storage/data_room/doc-101.pdf",
            parse_status="parsed",
            uploaded_by="founder@neuraldesk.ai"
        ),
        DataRoomDocument(
            document_id="doc-102",
            deal_id=deal_id,
            file_name="NeuralDesk_Financials_Forecast_2026.xlsx",
            file_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            document_category="Financial Model",
            upload_time=now - timedelta(days=2),
            file_size=1200000,
            storage_path="/storage/data_room/doc-102.xlsx",
            parse_status="parsed",
            uploaded_by="founder@neuraldesk.ai"
        ),
        DataRoomDocument(
            document_id="doc-103",
            deal_id=deal_id,
            file_name="KPI_Tracker_Historical_Cohorts.csv",
            file_type="text/csv",
            document_category="KPI Sheet",
            upload_time=now - timedelta(days=1),
            file_size=85000,
            storage_path="/storage/data_room/doc-103.csv",
            parse_status="parsed",
            uploaded_by="founder@neuraldesk.ai"
        ),
        DataRoomDocument(
            document_id="doc-104",
            deal_id=deal_id,
            file_name="Cap_Table_Pre_Series_A.xlsx",
            file_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            document_category="Cap Table",
            upload_time=now - timedelta(days=1),
            file_size=400000,
            storage_path="/storage/data_room/doc-104.xlsx",
            parse_status="parsed",
            uploaded_by="founder@neuraldesk.ai"
        ),
        DataRoomDocument(
            document_id="doc-105",
            deal_id=deal_id,
            file_name="Customer_Reference_Notes_AcmeCorp.docx",
            file_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            document_category="Customer References",
            upload_time=now - timedelta(hours=12),
            file_size=25000,
            storage_path="/storage/data_room/doc-105.docx",
            parse_status="parsed",
            uploaded_by="analyst@apex.vc"
        ),
        DataRoomDocument(
            document_id="doc-106",
            deal_id=deal_id,
            file_name="Founder_Call_Transcript_06_10.txt",
            file_type="text/plain",
            document_category="Founder Transcript",
            upload_time=now - timedelta(hours=5),
            file_size=12000,
            storage_path="/storage/data_room/doc-106.txt",
            parse_status="parsed",
            uploaded_by="analyst@apex.vc"
        )
    ]

    metrics = [
        ExtractedMetric(
            metric_name="ARR",
            metric_value="$2.4M",
            period="Current (Q2 2026)",
            unit="USD",
            source_document="NeuralDesk_Financials_Forecast_2026.xlsx",
            source_page_or_sheet="Summary!B14",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.HIGH,
            verification_status=VerificationStatus.EXTRACTED,
            decision_importance="High"
        ),
        ExtractedMetric(
            metric_name="Net Revenue Retention (NRR)",
            metric_value="134%",
            period="LTM",
            unit="Percentage",
            source_document="KPI_Tracker_Historical_Cohorts.csv",
            source_page_or_sheet="Row 45",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.HIGH,
            verification_status=VerificationStatus.EXTRACTED,
            decision_importance="High"
        ),
        ExtractedMetric(
            metric_name="Gross Margin",
            metric_value="68%",
            period="Current",
            unit="Percentage",
            source_document="NeuralDesk_Financials_Forecast_2026.xlsx",
            source_page_or_sheet="IncomeStatement!C22",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.MEDIUM,
            verification_status=VerificationStatus.REQUIRES_REVIEW,
            decision_importance="High"
        ),
        ExtractedMetric(
            metric_name="Monthly Burn Rate",
            metric_value="$350k",
            period="Average last 3 months",
            unit="USD",
            source_document="NeuralDesk_Financials_Forecast_2026.xlsx",
            source_page_or_sheet="CashFlow!D12",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.HIGH,
            verification_status=VerificationStatus.EXTRACTED,
            decision_importance="High"
        ),
        ExtractedMetric(
            metric_name="Founder Ownership (Combined)",
            metric_value="52%",
            period="Current",
            unit="Percentage",
            source_document="Cap_Table_Pre_Series_A.xlsx",
            source_page_or_sheet="CapTable!G45",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.HIGH,
            verification_status=VerificationStatus.EXTRACTED,
            decision_importance="Medium"
        ),
        ExtractedMetric(
            metric_name="Enterprise Customers",
            metric_value="14",
            period="Current",
            unit="Count",
            source_document="NeuralDesk_Series_A_Deck_vFinal.pdf",
            source_page_or_sheet="Slide 12",
            extraction_method=ExtractionMethod.MOCK_FIXTURE,
            confidence=MetricConfidence.LOW,
            verification_status=VerificationStatus.CONFLICTING,
            decision_importance="Medium"
        )
    ]

    evidence = [
        PrivateEvidenceItem(
            claim="Platform accelerates customer resolution times by 40%.",
            source_document="Customer_Reference_Notes_AcmeCorp.docx",
            source_location="Page 1, Paragraph 3",
            confidence=MetricConfidence.HIGH,
            verification_status=VerificationStatus.EXTRACTED,
            linked_public_claim="We double agent productivity.",
            contradiction_status=False,
            decision_impact="Strengthens product-market fit conviction."
        ),
        PrivateEvidenceItem(
            claim="Infrastructure costs scale linearly with usage.",
            source_document="Founder_Call_Transcript_06_10.txt",
            source_location="Line 142",
            confidence=MetricConfidence.LOW,
            verification_status=VerificationStatus.CONFLICTING,
            linked_public_claim=None,
            contradiction_status=True,
            decision_impact="Creates gross margin scaling risk."
        )
    ]

    contradictions = [
        DataRoomContradiction(
            issue="Customer Count Discrepancy",
            severity="Medium",
            documents_involved=["NeuralDesk_Series_A_Deck_vFinal.pdf", "KPI_Tracker_Historical_Cohorts.csv"],
            evidence_a="Pitch deck claims 14 enterprise customers.",
            evidence_b="KPI sheet only lists 9 active enterprise logos paying over $50k/yr.",
            recommended_action="Clarify enterprise customer definition with founder.",
            decision_impact="May reduce projected ACV if 5 of these are mid-market or pilots."
        ),
        DataRoomContradiction(
            issue="Gross Margin Feasibility",
            severity="High",
            documents_involved=["NeuralDesk_Financials_Forecast_2026.xlsx", "Founder_Call_Transcript_06_10.txt"],
            evidence_a="Financial model projects gross margins expanding to 80% by next year.",
            evidence_b="Founder admitted infrastructure costs currently scale linearly due to LLM API usage.",
            recommended_action="Request AWS/OpenAI bills and do a deep dive on unit economics.",
            decision_impact="Could heavily cap terminal valuation if margins permanently remain <70%."
        )
    ]

    return DataRoomReport(
        deal_id=deal_id,
        company_name="NeuralDesk",
        documents_uploaded=docs,
        documents_parsed=[d.document_id for d in docs],
        metrics_extracted=metrics,
        private_evidence_items=evidence,
        contradictions=contradictions,
        missing_documents=["Sales Pipeline Extract", "Legal / Compliance"],
        missing_metrics=["LTV / CAC Ratio", "Logo Churn Rate"],
        data_room_completeness_score=85,
        completeness_level="IC Ready",
        private_data_confidence="High",
        decision_impact={
            "evidence_score_change": "+15",
            "ic_readiness_change": "+20",
            "recommendation_cap_change": "Uncapped (IC Ready)",
            "blockers_added": "Pending unit economics deep dive.",
            "next_diligence_action": "Verify LLM API costs and request pipeline CRM export."
        },
        recommended_diligence_actions=[
            "Request CRM export to verify pipeline conversion.",
            "Do a technical deep dive on LLM inference costs.",
            "Call 3 more enterprise customers."
        ],
        metadata={"fixture": True}
    )

def get_sarvam_data_room_fixture(deal_id: int) -> DataRoomReport:
    """Provides an empty data room for Sarvam AI to demonstrate public benchmark analysis."""
    return DataRoomReport(
        deal_id=deal_id,
        company_name="Sarvam AI",
        documents_uploaded=[],
        documents_parsed=[],
        metrics_extracted=[],
        private_evidence_items=[],
        contradictions=[],
        missing_documents=[
            "Pitch Deck", "Financial Model", "KPI Sheet", "Cap Table", "Customer References"
        ],
        missing_metrics=["ARR", "MRR Growth", "Burn Rate", "Gross Margin", "Retention"],
        data_room_completeness_score=0,
        completeness_level="Sparse",
        private_data_confidence="Low",
        decision_impact={
            "evidence_score_change": "0",
            "ic_readiness_change": "Capped at 40%",
            "recommendation_cap_change": "Requires Data Room",
            "blockers_added": "No private financials or KPIs uploaded.",
            "next_diligence_action": "Request access to private data room from founders."
        },
        recommended_diligence_actions=[
            "Request pitch deck and historical financials.",
            "Request cap table to model ownership."
        ],
        metadata={"fixture": True, "note": "Public benchmark only."}
    )

def get_fallback_data_room(deal_id: int, company_name: str) -> DataRoomReport:
    # EXTREME VC Fallback data room for ANY new deal
    docs = [
        DataRoomDocument(document_id="doc-fallback-1", file_name=f"{company_name}_Series_A_Deck.pdf", document_category="Pitch Deck", parse_status="Parsed", extracted_claims=5),
        DataRoomDocument(document_id="doc-fallback-2", file_name=f"{company_name}_Financial_Model_v3.xlsx", document_category="Financials", parse_status="Parsed", extracted_claims=12),
        DataRoomDocument(document_id="doc-fallback-3", file_name=f"{company_name}_Cohort_Analysis.csv", document_category="Financials", parse_status="Parsed", extracted_claims=8)
    ]
    
    metrics = [
        ExtractedMetric(metric_name="ARR", metric_value="$4.2M", period="Current", unit="USD", source_document=f"{company_name}_Financial_Model_v3.xlsx", source_page_or_sheet="Summary!B4", extraction_method=ExtractionMethod.MOCK_FIXTURE, confidence=MetricConfidence.HIGH, verification_status=VerificationStatus.EXTRACTED, decision_importance="High"),
        ExtractedMetric(metric_name="Net Dollar Retention (NDR)", metric_value="142%", period="LTM", unit="Percentage", source_document=f"{company_name}_Cohort_Analysis.csv", source_page_or_sheet="Row 12", extraction_method=ExtractionMethod.MOCK_FIXTURE, confidence=MetricConfidence.HIGH, verification_status=VerificationStatus.EXTRACTED, decision_importance="High"),
        ExtractedMetric(metric_name="CAC Payback", metric_value="4.1 Months", period="Current", unit="Months", source_document=f"{company_name}_Financial_Model_v3.xlsx", source_page_or_sheet="Metrics!C12", extraction_method=ExtractionMethod.MOCK_FIXTURE, confidence=MetricConfidence.MEDIUM, verification_status=VerificationStatus.REQUIRES_REVIEW, decision_importance="High"),
        ExtractedMetric(metric_name="Gross Margin", metric_value="74%", period="Current", unit="Percentage", source_document=f"{company_name}_Financial_Model_v3.xlsx", source_page_or_sheet="IncomeStatement!C22", extraction_method=ExtractionMethod.MOCK_FIXTURE, confidence=MetricConfidence.MEDIUM, verification_status=VerificationStatus.REQUIRES_REVIEW, decision_importance="High"),
    ]
    
    evidence = [
        PrivateEvidenceItem(claim="Product demonstrates viral coefficient within specific enterprise groups.", source_document=f"{company_name}_Cohort_Analysis.csv", source_location="Growth Model Tab", confidence=MetricConfidence.HIGH, verification_status=VerificationStatus.EXTRACTED, linked_public_claim=None, contradiction_status=False, decision_impact="Strengthens LTV assumptions massively.")
    ]
    
    contradictions = [
        DataRoomContradiction(issue="Blended CAC vs Paid CAC", severity="High", documents_involved=[f"{company_name}_Series_A_Deck.pdf", f"{company_name}_Financial_Model_v3.xlsx"], evidence_a="Deck claims $800 CAC.", evidence_b="Financials reveal paid CAC is $3,500; the $800 figure relies heavily on unsustainable organic acquisition.", recommended_action="Re-run P&L sensitivity with $3,500 CAC.", decision_impact="Could destroy fund math if organic acquisition slows.")
    ]
    
    return DataRoomReport(
        deal_id=deal_id,
        company_name=company_name,
        documents_uploaded=docs,
        documents_parsed=[d.document_id for d in docs],
        metrics_extracted=metrics,
        private_evidence_items=evidence,
        contradictions=contradictions,
        missing_documents=["Employee Contracts", "IP Assignment"],
        missing_metrics=["Logo Churn Rate"],
        data_room_completeness_score=92,
        completeness_level="IC Ready",
        private_data_confidence="High",
        decision_impact={
            "evidence_score_change": "+35",
            "ic_readiness_change": "+40",
            "recommendation_cap_change": "Uncapped (IC Ready)",
            "blockers_added": "Pending paid CAC verification.",
            "next_diligence_action": "Verify Stripe data to isolate organic vs paid customers."
        },
        recommended_diligence_actions=[
            "Request raw Stripe export to verify cohort NDR.",
            "Audit Google Ads spend to isolate true Paid CAC."
        ],
        metadata={"fixture": True, "note": "Extreme VC Fallback active"}
    )
