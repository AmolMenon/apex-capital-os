from datetime import datetime
import json
import logging
from sqlalchemy.orm import Session
from database.crud import get_deal
from db.models import DealDataRoomReport, DealDocument
from .data_room_schemas import DataRoomReport
from .data_room_fixtures import get_neuraldesk_data_room_fixture, get_sarvam_data_room_fixture, get_fallback_data_room

logger = logging.getLogger(__name__)

def get_or_create_data_room_report(db: Session, deal_id: int) -> DataRoomReport:
    """Gets the data room report. For demo purposes, we inject rich fixtures for NeuralDesk and empty for Sarvam."""
    deal = get_deal(db, deal_id)
    if not deal:
        raise ValueError(f"Deal {deal_id} not found.")

    # Check if a report already exists in DB
    existing_report = db.query(DealDataRoomReport).filter(DealDataRoomReport.deal_id == deal_id).first()
    if existing_report and existing_report.report_json:
        try:
            return DataRoomReport.parse_raw(existing_report.report_json)
        except Exception as e:
            logger.error(f"Failed to parse existing report for deal {deal_id}: {e}")

    # Generate Fixture based on deal name
    if "NeuralDesk" in deal.name:
        report = get_neuraldesk_data_room_fixture(deal_id)
    elif "Sarvam" in deal.name:
        report = get_sarvam_data_room_fixture(deal_id)
    else:
        report = get_fallback_data_room(deal_id, deal.name)

    # Save to DB
    new_report = DealDataRoomReport(
        deal_id=deal_id,
        report_json=report.json()
    )
    if existing_report:
        existing_report.report_json = report.json()
    else:
        db.add(new_report)
    db.commit()

    return report

def process_uploaded_document(db: Session, deal_id: int, file_name: str, file_type: str, category: str, storage_path: str, file_size: int, user: str):
    """Registers an uploaded document into the database."""
    doc_id = f"doc-{int(datetime.utcnow().timestamp())}"
    new_doc = DealDocument(
        document_id=doc_id,
        deal_id=deal_id,
        file_name=file_name,
        file_type=file_type,
        document_category=category,
        file_size=file_size,
        storage_path=storage_path,
        parse_status="pending",
        uploaded_by=user
    )
    db.add(new_doc)
    db.commit()
    db.refresh(new_doc)
    return new_doc

def run_data_room_parsing(db: Session, deal_id: int) -> DataRoomReport:
    """Simulates parsing all documents. For the demo, it just re-generates the fixture."""
    # In a real system, we'd iterate over DealDocument, call document_parser.py, kpi_extractor.py, etc.
    report = get_or_create_data_room_report(db, deal_id)
    
    # Update status of any pending docs
    docs = db.query(DealDocument).filter(DealDocument.deal_id == deal_id).all()
    for doc in docs:
        doc.parse_status = "parsed"
    db.commit()
    
    # For demo, if it's NeuralDesk, we just rely on the fixture's rich data.
    return report

def get_data_room_status():
    return {
        "enabled": True,
        "storage_provider": "local",
        "upload_support": True,
        "parser_support": True,
        "mock_fixtures_loaded": True,
        "routes_healthy": True,
        "supported_file_types": ["pdf", "csv", "xlsx", "docx", "txt"]
    }
