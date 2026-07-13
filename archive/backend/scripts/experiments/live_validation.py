import sys
import os
import json
import time

sys.path.insert(0, os.path.abspath('backend'))
from dotenv import load_dotenv
load_dotenv()

from sqlalchemy.orm import Session
from db.database import SessionLocal, engine
from db.models import Base, Decision, DomainPack, DecisionSubject, Document, Chunk, Claim, Assumption, EvidenceConflict, ReasoningRun

def setup_case_a(db: Session, domain_pack_id: int):
    # Case A: CLEAN DECISION
    subject = DecisionSubject(name="TechCorp Acquisition", metadata_json=json.dumps({"entity_type": "COMPANY", "entity_id": "TC-001"}))
    db.add(subject)
    db.flush()
    decision = Decision(title="Acquire TechCorp", status="Pending", domain_pack_id=domain_pack_id, subject_id=subject.id)
    db.add(decision)
    db.flush()
    
    doc = Document(decision_id=decision.id, filename="financials_a.pdf", content_hash="hash_a")
    db.add(doc)
    db.flush()
    chunk = Chunk(document_id=doc.id, content="TechCorp shows strong YoY growth and solid margins.", page_number=1)
    db.add(chunk)
    db.flush()
    claim = Claim(decision_id=decision.id, source_chunk_id=chunk.id, statement="TechCorp has strong YoY growth.", confidence=95)
    db.add(claim)
    
    db.commit()
    return decision.id

def setup_case_b(db: Session, domain_pack_id: int):
    # Case B: EXPLICIT CONTRADICTION
    subject = DecisionSubject(name="BioMed Investment", metadata_json=json.dumps({"entity_type": "COMPANY", "entity_id": "BM-002"}))
    db.add(subject)
    db.flush()
    decision = Decision(title="Invest in BioMed Series A", status="Pending", domain_pack_id=domain_pack_id, subject_id=subject.id)
    db.add(decision)
    db.flush()
    
    doc = Document(decision_id=decision.id, filename="clinical_b.pdf", content_hash="hash_b")
    db.add(doc)
    db.flush()
    chunk1 = Chunk(document_id=doc.id, content="Phase 2 trials showed 80% efficacy.", page_number=1)
    chunk2 = Chunk(document_id=doc.id, content="An independent audit found Phase 2 efficacy was only 40%.", page_number=2)
    db.add_all([chunk1, chunk2])
    db.flush()
    
    claim1 = Claim(decision_id=decision.id, source_chunk_id=chunk1.id, statement="Efficacy is 80%.", confidence=90)
    claim2 = Claim(decision_id=decision.id, source_chunk_id=chunk2.id, statement="Efficacy is 40%.", confidence=90)
    db.add_all([claim1, claim2])
    db.flush()
    
    conflict = EvidenceConflict(decision_id=decision.id, claim_a_id=claim1.id, claim_b_id=claim2.id, relationship_type="CLAIM_CONTRADICTS_CLAIM", resolution_status="UNRESOLVED")
    db.add(conflict)
    db.commit()
    return decision.id

def setup_case_c(db: Session, domain_pack_id: int):
    # Case C: CRITICAL ASSUMPTION OR GOVERNANCE RISK
    subject = DecisionSubject(name="CryptoDefi Launch", metadata_json=json.dumps({"entity_type": "PROJECT", "entity_id": "CD-003"}))
    db.add(subject)
    db.flush()
    decision = Decision(title="Approve CryptoDefi Token", status="Pending", domain_pack_id=domain_pack_id, subject_id=subject.id)
    db.add(decision)
    db.flush()
    
    doc = Document(decision_id=decision.id, filename="whitepaper_c.pdf", content_hash="hash_c")
    db.add(doc)
    db.flush()
    chunk = Chunk(document_id=doc.id, content="We assume regulatory approval in the US within 6 months.", page_number=1)
    db.add(chunk)
    db.flush()
    
    claim = Claim(decision_id=decision.id, source_chunk_id=chunk.id, statement="Project plans US launch in 6 months.", confidence=80)
    db.add(claim)
    db.flush()
    
    assumption = Assumption(decision_id=decision.id, category="Regulatory", statement="Regulatory approval will be granted in the US within 6 months.", status="Unverified")
    db.add(assumption)
    db.commit()
    return decision.id

def run_live_validation():
    db = SessionLocal()
    Base.metadata.create_all(bind=engine)
    
    from db.models import ReasoningAgent
    domain_pack = db.query(DomainPack).first()
    if not domain_pack:
        domain_pack = DomainPack(id="vc_eval", name="Venture Capital", description="VC Evaluation")
        db.add(domain_pack)
        db.commit()
        
        agent = ReasoningAgent(id="general_vc", name="General VC Analyst", system_prompt="You are a VC analyst.", domain_pack_id=domain_pack.id)
        db.add(agent)
        db.commit()
        
    print("Setting up Case A...")
    case_a_id = setup_case_a(db, domain_pack.id)
    print("Setting up Case B...")
    case_b_id = setup_case_b(db, domain_pack.id)
    print("Setting up Case C...")
    case_c_id = setup_case_c(db, domain_pack.id)
    
    from reasoning_engine.adaptive_controller import AdaptiveReasoningController
    controller = AdaptiveReasoningController(db)
    
    for case_name, case_id in [("Case A (Clean)", case_a_id), ("Case B (Contradiction)", case_b_id), ("Case C (Assumption)", case_c_id)]:
        print(f"\nExecuting {case_name} (Decision ID {case_id})...")
        try:
            out = controller.evaluate_decision_adaptive(case_id)
            print(f"{case_name} execution completed successfully.")
            
            run = db.query(ReasoningRun).filter_by(decision_id=case_id).order_by(ReasoningRun.id.desc()).first()
            if run:
                print(f"OUTPUT: {run.output_json}")
                print(f"TOKENS: {run.token_usage_json}")
                print(f"LATENCY: {run.latency_ms_json}")
                
        except Exception as e:
            print(f"{case_name} execution failed: {e}")
            import traceback
            traceback.print_exc()

if __name__ == "__main__":
    run_live_validation()
