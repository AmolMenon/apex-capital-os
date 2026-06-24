# Apex Capital Production Architecture Plan

This document outlines the transition of Apex Capital from a localized portfolio MVP to a production-ready SaaS foundation.

## 1. Current MVP Architecture
- **Frontend:** Next.js application designed primarily for local demonstrations with no authentication or protected routes.
- **Backend:** FastAPI application running on a local SQLite database (`apex_capital.db`). Models use simple SQLAlchemy configurations without migrations.
- **Data Isolation:** All data exists globally. There are no users or workspaces.
- **AI Providers:** Currently heavily mocks functionality; no resilient retry mechanisms, robust timeout handling, or detailed provider status logging.
- **File Storage:** No actual file storage logic. Deck and conversation transcripts rely on mocked seed data or raw text inputs.

## 2. Target Production Architecture
- **Frontend:** Deployed on Vercel with structured routing, API error boundaries, loading skeletons, and Opt-In authentication.
- **Backend:** Deployed on Render/Railway/Fly.io. Supports multi-environment configurations via `pydantic-settings`.
- **Database:** PostgreSQL for production storage with Alembic for schema migrations. Maintains SQLite compatibility for local mock/demo deployments.
- **Authentication:** Opt-In JWT-based authentication supporting user registration, login, and protected endpoints.
- **Data Isolation:** Workspace/Team support ensuring strict data siloing.
- **File Storage:** Abstraction layer supporting both local file storage (for dev) and S3-compatible object storage (for production).
- **AI Routing:** Resilient multi-provider routing supporting Gemini, OpenAI, Claude, and Mock mode with timeout/backoff handling.
- **Observability:** Structured logging, comprehensive health check endpoints, request ID tracking, and audit logging.
- **CI/CD:** Automated GitHub Actions pipeline for testing and build verification.

## 3. What Changes are Required

### Environment Configuration
- Implement `backend/core/config.py` using `pydantic-settings`.
- Normalize `.env.example` across backend and frontend to support `APP_ENV`, `ENABLE_AUTH`, `ENABLE_WORKSPACES`, and AI API keys safely.

### Database Migrations
- Introduce Alembic for schema management.
- Update all SQLAlchemy models to include `workspace_id`, `created_at`, `updated_at`, and proper indexing.

### Authentication & Workspaces
- Build `backend/auth/` modules: `password.py`, `jwt.py`, `dependencies.py`, `auth_routes.py`.
- Add `User` and `Workspace` models with hierarchical associations to deals and analyses.
- Implement frontend login/registration UI and route wrappers.

### File Storage Abstraction
- Build `backend/storage/base.py`, `local_storage.py`, and `s3_storage.py`.
- Add an `UploadedFile` model to track physical assets securely.

### Security & Observability
- Strict CORS configuration based on environment variables.
- Simple in-memory rate limiting and request size validations.
- Build `backend/core/logging.py` for structured events.
- Implement `/health`, `/health/db`, and `/health/ai` endpoints.

### Real LLM Readiness
- Update `ai_providers/` logic to gracefully handle missing keys and API timeouts.
- Implement a fallback mechanism mapping failed live calls to deterministic mock responses.

### CI/CD and Testing
- Create `.github/workflows/ci.yml` to run `pytest` and `npm run build`.
- Add minimal testing infrastructure for backend routes.

## 4. Remaining Limitations (Post-Upgrade)
- **Billing & Stripe Integration:** Not included in this foundation phase.
- **Advanced RBAC:** Roles will exist in DB but granular permissions (e.g. view-only vs edit) may require future expansion.
- **Real Market DB Connections:** PitchBook and Crunchbase remain simulated.
- **SOC2 Compliance:** The foundation is solid, but enterprise audit trails and data retention policies require further legal/security specification.
