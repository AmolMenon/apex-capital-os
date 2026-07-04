import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000/api/v1"

def print_step(msg):
    print(f"\\n[STEP] {msg}")

def run_tests():
    print_step("Checking Health")
    r = requests.get(f"{BASE_URL}/health")
    print(r.json())
    
    print_step("Logging in (or registering)")
    # Register test user
    requests.post(f"{BASE_URL}/auth/register", json={"email": "test@apex.com", "password": "password", "name": "Test User"})
    # Login
    r = requests.post(f"{BASE_URL}/auth/login", data={"username": "test@apex.com", "password": "password"})
    token = r.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    
    print_step("Fetching Decisions")
    r = requests.get(f"{BASE_URL}/decisions", headers=headers)
    decisions = r.json()
    if not decisions:
        # Seed a domain pack via DB since API may not exist
        import sqlite3
        conn = sqlite3.connect('apex_capital.db')
        c = conn.cursor()
        c.execute("INSERT INTO domain_packs (id, name, description, config_json) VALUES (?, ?, ?, ?) ON CONFLICT DO NOTHING", ('test_pack_1', 'Test Pack', 'A test domain pack', '{}'))
        c.execute("INSERT INTO reasoning_agents (id, domain_pack_id, name, system_prompt, capabilities_json) VALUES (?, ?, ?, ?, ?) ON CONFLICT DO NOTHING", ('agent_1', 'test_pack_1', 'Strategic Analyst', 'Analyze the financials.', '{}'))
        # Seed a subject via DB since API may not exist
        c.execute("INSERT INTO decision_subjects (id, name, description, metadata_json, created_at, updated_at) VALUES (?, ?, ?, ?, datetime('now'), datetime('now')) ON CONFLICT DO NOTHING", (1, 'Test Company Inc.', 'Company', '{}'))
        conn.commit()
        conn.close()
        domain_pack_id = 'test_pack_1'
        
        # Create a decision if none exists
        print("No decisions found! Creating one...")
        r = requests.post(f"{BASE_URL}/decisions", json={
            "title": "Test Decision",
            "subject_id": 1,
            "domain_pack_id": domain_pack_id
        }, headers=headers)
        if r.status_code == 422 or r.status_code == 500:
            pass
        decisions = [r.json()]
        
    decision_id = decisions[0]["id"]
    print(f"Using Decision ID: {decision_id}")
    
    print_step("Creating Test Document")
    test_content = (
        "Apex Strategic Analysis - Q3 2026\\n"
        "The company generated $15 million in ARR last quarter. (Source Fact)\\n"
        "We are undeniably the market leader in enterprise AI. (Extracted Claim)\\n"
        "Assuming a 10% month-over-month growth rate, we will hit $25M by year end. (Assumption)\\n"
        "However, the new EU regulations pose a critical risk to our data processing pipelines. (Risk)\\n"
        "Wait, actually we are second in the market behind our main competitor. (Contradiction)\\n"
    )
    
    with open("test_document.txt", "w") as f:
        f.write(test_content)
        
    print_step("Uploading Document")
    with open("test_document.txt", "rb") as f:
        r = requests.post(f"{BASE_URL}/decisions/{decision_id}/upload", files={"file": ("test_document.txt", f, "text/plain")}, headers=headers)
    
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text}")
    upload_res = r.json()
    doc_id = upload_res.get("document_id")
    
    print_step("Fetching Evidence to Verify Persistence")
    r = requests.get(f"{BASE_URL}/decisions/{decision_id}/evidence", headers=headers)
    evidence = r.json()
    print(f"Total evidence items: {len(evidence)}")
    found = any(e.get("title") == "test_document.txt" for e in evidence)
    print(f"Test document found in list: {found}")
    
    print_step("Extracting Claims")
    r = requests.post(f"{BASE_URL}/decisions/{decision_id}/documents/{doc_id}/extract-claims", headers=headers)
    print(r.status_code, r.text)
    
    print_step("Fetching Claims")
    r = requests.get(f"{BASE_URL}/decisions/{decision_id}/claims", headers=headers)
    claims = r.json()
    print(f"Extracted {len(claims)} claims:")
    for c in claims:
        print(f"  - {c.get('provenance_type')}: {c.get('statement')} (Source: {c.get('source_chunk_id')})")
        
    print_step("Running Reasoning Engine (Expect failure if no API key)")
    r = requests.post(f"{BASE_URL}/decisions/{decision_id}/evaluate", headers=headers)
    print(f"Status: {r.status_code}")
    print(r.text)
    
    print_step("Testing Failure Path: Nonexistent Decision ID")
    r = requests.post(f"{BASE_URL}/decisions/99999/upload", files={"file": ("fake.txt", b"content")}, headers=headers)
    print(f"Status: {r.status_code}, Response: {r.json()}")

if __name__ == "__main__":
    run_tests()
