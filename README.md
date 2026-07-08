# Apex Capital OS

Apex Capital OS is a decision-support infrastructure designed for evidence-intensive investment workflows. It bridges the gap between raw data analysis and human investment committee (IC) decisions by structurally enforcing evidence integrity and explicitly blocking decisions when material conflicts exist.

## 1. The Investment Workflow Problem
In venture capital and private equity, investment diligence is difficult because claims, evidence, assumptions, and contradictions are often spread across disparate documents, models, and analyst workflows. Standard AI summarizing tools often gloss over critical discrepancies, generating confident summaries that bury material risks. 

## 2. The Product Thesis
A useful investment intelligence system must do more than summarize documents; it must rigorously map management claims against ground-truth evidence, deterministically flag conflicts, and force human review when AI certainty breaks down. 

Apex Capital OS treats investment diligence not as a text-generation problem, but as an **integrity enforcement problem**.

## 3. The Nexus Data Systems Canonical Case
To demonstrate this architecture, we use a repeatable, canonical test case: **Nexus Data Systems (Series A)**.
*   **Management Claim:** The startup claims $8.0M in ARR.
*   **Supporting Evidence:** Audited financials only support $5.4M in recurring revenue.
*   **Material Discrepancy:** $2.6M.

## 4. The Workflow
1.  **Evidence Room:** The system maps the management claims to the raw data room documents.
2.  **Conflict Detection:** The AI synthesis engine detects the $2.6M discrepancy.
3.  **Targeted Review:** The system generates an open diligence question requiring investigation into the revenue gap.
4.  **Decision Blocker:** A deterministic integrity policy flags the material conflict and blocks the "Invest" recommendation, shifting the state to `BLOCKED_PENDING_REVIEW`.
5.  **Human IC Decision:** The human Investment Committee must explicitly review the blocker, provide a written rationale, and manually override the system to proceed.
6.  **Institutional Memory:** The override, alongside the rationale and the original AI warning, is immutably logged in the ledger for future reference.

## 5. Deterministic Integrity Outside the LLM
LLMs are probabilistic and prone to hallucination; they should not be trusted with final policy enforcement. In Apex, the LLM is only used for data extraction and synthesis. The actual **Decision Integrity Envelope** is a deterministic, rule-based system running on the backend that evaluates the LLM's output and hard-blocks the workflow if a discrepancy exceeds the defined threshold.

## 6. High-Level Architecture
*   **Frontend:** Next.js (React), TailwindCSS, providing a clean, professional "Command Center" and Investment Memorandum UI.
*   **Backend:** Python (FastAPI), managing state, orchestration, and the deterministic integrity policies.
*   **Data Persistence:** Relational database ensuring lossless traceability of decisions and overrides.

## 7. Validation Methodology
The project is validated through strict, automated end-to-end (E2E) testing:
*   **Deterministic Workflows:** Uses a mocked LLM provider during tests to ensure 100% repeatable execution.
*   **Playwright E2E:** A canonical test suite runs the entire Nexus Data Systems workflow, asserting that the blocker is triggered, the UI renders correctly, the human override succeeds, and the data persists.
*   **Repeatability:** Tests are mandated to pass consecutive repeatability runs to prove architectural stability.

## 8. Current Limitations
*   **Fictional Data:** The canonical Nexus Demo uses mocked, fictional data designed specifically to trigger the integrity policies.
*   **No Autonomous Decisions:** The system explicitly does not make investment decisions; it strictly acts as a diligence blocker and support tool.
*   **Test Provider Dependency:** Real-world LLM variability is bypassed during E2E testing using deterministic mocks.

## 9. Local Development
1. Clone the repository.
2. Backend: `cd backend && python -m venv venv && source venv/bin/activate && pip install -r requirements.txt`
3. Seed the DB: `python scripts/seed_demo.py`
4. Start Backend: `uvicorn main:app --reload`
5. Frontend: `cd frontend && npm install && npm run dev`
6. Access at `http://localhost:3000`
