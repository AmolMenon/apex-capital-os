# Apex Capital OS: Staging Deployment Handoff

This document details the exact requirements, commands, and architecture for deploying the Apex Capital OS to a controlled staging environment.

## Deployment Architecture
* **Frontend**: Next.js 16.2.7 (Turbopack) running on Node.js. Serves static and dynamic React pages.
* **Backend**: FastAPI running on Python 3.9+ via Uvicorn.
* **Database**: PostgreSQL (staging environment requirement).
* **Storage**: Local filesystem (`./data/uploads`) or S3 bucket depending on `FILE_STORAGE_PROVIDER`.

## Required Services
* **PostgreSQL Database**: Must be provisioned and accessible.
* **Node.js (v18+) Runtime**: For Next.js frontend.
* **Python (v3.9+) Runtime**: For FastAPI backend.

## Environment Variables
The following environment variables are read by the current frontend and backend codebase:

| Variable | Classification | Description |
| :--- | :--- | :--- |
| `APP_ENV` | Required in staging | Must be set to `staging` or `production` to enforce security rules. |
| `APP_MODE` | Optional | `live` or `mock`. Defaults to `mock`. |
| `DATABASE_URL` | Required in staging, Secret | The PostgreSQL connection string. |
| `ENABLE_AUTH` | Required in staging | Must be `True`. |
| `ENABLE_WORKSPACES` | Required in staging | Must be `True`. |
| `CORS_ORIGINS` | Required in staging | The allowed frontend URL (e.g. `https://staging.apexcapital.com`). |
| `JWT_SECRET_KEY` | Required in staging, Secret | Cryptographically secure random string for JWT signatures. |
| `FILE_STORAGE_PROVIDER` | Optional | `local` or `s3`. Defaults to `local`. |
| `GEMINI_API_KEY` | Optional, Secret | Required if `APEX_EXTRACTION_PROVIDER=gemini`. |
| `OPENAI_API_KEY` | Optional, Secret | Required if routing to OpenAI models. |
| `ANTHROPIC_API_KEY` | Optional, Secret | Required if routing to Anthropic models. |
| `NEXT_PUBLIC_API_URL` | Required in staging (Frontend) | The deployed backend URL. |

## Migration Sequence
Before starting the backend, apply database migrations:
```bash
cd backend
source venv/bin/activate
alembic upgrade head
```

## Backend Deployment Command
```bash
cd backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

## Frontend Deployment Command
```bash
cd frontend
npm ci
npm run build
npm start
```

## Health Checks
* **Backend**: `GET /` -> Returns `{"status": "ok", "service": "Apex Capital OS API"}`

## Seeded Staging Data Procedure
1. Create a Staging Admin User and Workspace via the database CLI or a temporary secure seed script.
2. Ensure the `WorkspaceMembership` table assigns the staging user to the workspace with the role `Admin`.
3. Create at least two `Decision` records associated with `DecisionSubject` records scoped to the staging workspace to verify list views.

## Smoke-Test Sequence
1. **Load Frontend**: Navigate to staging URL; ensure login screen appears.
2. **Authenticate**: Log in with the seeded staging admin credentials.
3. **Workspace Verification**: Ensure the deal pipeline loads without throwing a 401/403.
4. **LLM Connection**: Upload a sample PDF to a deal and trigger "Generate IC One-Pager". Verify the job completes.

## Rollback Procedure
1. **Frontend**: Re-deploy the previous successful image/commit.
2. **Backend**: Re-deploy the previous successful image/commit.
3. **Database**: Run `alembic downgrade -1` (if the latest migration caused the failure).

## Known Remaining Runtime Validation Items
* End-to-end browser journey validation with a real human (or Playwright on the staging URL).
* Real-world LLM latency evaluation with complex multi-document contexts.
* PostgreSQL concurrency validation (currently only proven on SQLite WAL).
