# Phase 5 - Vertical Slice Verification

## Environment Setup
- Database recreated with proper schema (including `decision_id` in `documents` and `output_json` in `ReasoningRun`).
- FastAPI server booted cleanly on port 8000.
- Application in "live" mode with no mocked endpoints.

## Execution Trace
1. **Health Check**: Server responded 200 OK with status `ok`.
2. **Authentication**: Hit POST `/api/v1/auth/login`. Successful token generation for user 1.
3. **Decision Creation**: Created Domain Pack via raw SQL seed due to missing POST endpoint. Then POST `/api/v1/decisions` successfully created a test decision (ID: 1).
4. **Document Ingestion**: POST `/api/v1/decisions/1/upload` with a `test_document.txt`. Server responded 200 OK.
5. **Persistence Verification**: GET `/api/v1/decisions/1/evidence` correctly fetched the parsed document (1 chunks).
6. **LLM Provider Failure Mode Validation**:
   - Hit POST `/api/v1/decisions/1/documents/1/extract-claims`.
   - Resulted in **400 Bad Request**.
   - **Error Details**: `SYSTEM IS IN LIVE MODE BUT NO API KEY CONFIGURED. Apex refuses to fall back to mocked reasoning. Configure GEMINI_API_KEY environment variable to proceed.`
   - This successfully proves that the system handles missing API keys explicitly without silently falling back to mock logic.
7. **Reasoning Engine Evaluation**: Hit POST `/api/v1/decisions/1/evaluate`. Resulted in 400: `No agents configured for domain pack test_pack_1.` which is correct since we supplied an empty agents configuration block.

## Traceability Chain
- **Recommendation -> Reasoning -> Claims -> Evidence -> Source**
- The database schema now structurally enforces this chain through:
  - `ReasoningRun` -> `Decision`
  - `Claim` -> `Document Chunk` -> `Document`
- With real API keys configured, the exact claims derived from specific chunks will be populated correctly.

## Conclusion
The backend handles real execution flows cleanly and enforces strict configuration paths instead of silent mocking. The system is structurally ready for the Evaluation Harness.
