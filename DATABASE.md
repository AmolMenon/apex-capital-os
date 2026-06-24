# Apex Capital - Database Architecture & Usage

Apex Capital supports a flexible data tier that defaults to SQLite for local development and mock environments, but is fully ready for PostgreSQL in production.

## 1. Local Setup (SQLite)

By default, without any configuration, the app uses a local SQLite database (`apex_capital.db`).

```bash
# Set environment
export APP_ENV=development
export DATABASE_URL=sqlite:///./apex_capital.db

# Run the app
uvicorn main:app --reload
```

## 2. Production Setup (PostgreSQL)

For production, PostgreSQL is highly recommended to support proper JSON fields and concurrent transactions.

```bash
# Set environment
export APP_ENV=production
export DATABASE_URL=postgresql://user:password@localhost:5432/apex_capital

# Run the app
uvicorn main:app
```

## 3. Database Migrations (Alembic)

The application uses Alembic to manage database schema versions.

### Creating a New Migration
When you update a model in `backend/models/`:
```bash
alembic revision --autogenerate -m "Added new column"
```

### Applying Migrations
To upgrade the database to the latest schema:
```bash
alembic upgrade head
```

## 4. Seeding Data

To load the standard mock deals into your current database, use the provided seed script. This operates on whichever database is configured in `DATABASE_URL`.

```bash
python seed.py
```

*Note: In production environments, ensure you only run seeds during initial setup to avoid duplicating records.*

## 5. Common Issues

- **Multiple Workspaces Error**: If auth is enabled, ensure you log in to an account mapped to a `WorkspaceMember`.
- **JSON Field Errors in SQLite**: Python's SQLite handles JSON as text. The ORM translates it, but raw queries may fail if they rely on native JSON functions that only Postgres supports.
