# Security Policy

Apex Capital uses industry-standard security practices to ensure data isolation, authentication, and robust operations.

## 1. Authentication and Authorization
- **JWT Tokens:** Authentication uses JSON Web Tokens (JWT) with HS256 algorithm and a 30-minute expiry window.
- **Password Hashing:** Passwords are hashed using `bcrypt` via `passlib`.
- **Role-Based Access Control (RBAC):** Users are assigned roles (`owner`, `admin`, `analyst`, `viewer`) managed at the application level.

## 2. Workspace Data Isolation
- Apex Capital relies on a hard multi-tenant architecture logic.
- All endpoints automatically inject the `get_current_workspace()` dependency.
- Operations that fetch deals, memos, or upload files strictly validate the request against the caller's workspace.
- The `WorkspaceMember` junction table guarantees that users can only access their allocated workspaces.

## 3. Storage Security
- File uploads are verified strictly by content-type (`application/pdf`, etc.) and limited to 50MB per file.
- Path traversal vulnerabilities are mitigated by using UUIDs instead of raw filenames.
- Cloud storage abstracts access with pre-signed URLs or backend proxies.

## 4. API Protections
- **CORS:** Only allowed origins (configured via `ALLOWED_ORIGINS` in `.env`) can access the API. Wildcard `*` origins are strictly prohibited in production.
- **Rate Limiting:** IP-based and user-based rate limiting via SlowAPI prevents brute force and scraping.
- **Global Exception Handling:** Stack traces are suppressed from HTTP responses. Standardized JSON errors prevent leakage of internal DB structures.

## 5. Secret Management
- Do not commit `.env` or any hardcoded API keys.
- Required production secrets include `JWT_SECRET_KEY`, `DATABASE_URL`, and relevant LLM keys (`OPENAI_API_KEY`, etc.).
- The backend refuses to boot in `production` mode if critical secrets (like `JWT_SECRET_KEY`) are missing or using weak default values.
