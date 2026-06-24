# Deployment Guide

Apex Capital is designed as a modular full-stack application (Next.js + FastAPI). It can be run locally or deployed to the cloud for a public portfolio showcase.

## 1. Local Deployment

### Backend
1. `cd backend`
2. `python -m venv venv`
3. `source venv/bin/activate`
4. `pip install -r requirements.txt`
5. `uvicorn main:app --reload`
*(Runs on `http://localhost:8000`)*

### Frontend
1. `cd frontend`
2. `npm install`
3. `npm run dev`
*(Runs on `http://localhost:3000`)*

---

## 2. Environment Variables

Create `.env` in both directories using `.env.example` as a template.

**Frontend (`frontend/.env`)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_APP_MODE=mock
```

**Backend (`backend/.env`)**
```env
APP_ENV=development
APP_MODE=mock
ENABLE_REAL_LLM=false
ENABLE_AUTH=false
JWT_SECRET_KEY=generate_a_random_secret_for_production
DATABASE_URL=sqlite:///./apex_capital.db
CORS_ORIGINS=http://localhost:3000
GEMINI_API_KEY=
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
```

---

## 3. Frontend Deployment (Vercel)

1. Connect your GitHub repository to Vercel.
2. Select the `frontend` folder as the Root Directory in Vercel settings.
3. Add the Environment Variable:
   - `NEXT_PUBLIC_API_URL` = `[YOUR_BACKEND_LIVE_URL]`
   - `NEXT_PUBLIC_APP_MODE` = `mock`
4. Deploy.

---

## 4. Backend Deployment (Render or Railway)

### Using Render
1. Create a new "Web Service" linked to your GitHub repo.
2. Set Root Directory to `backend`.
3. Set Build Command: `pip install -r requirements.txt`
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Add Environment Variables:
   - `CORS_ORIGINS` = `[YOUR_VERCEL_FRONTEND_URL]`
   - `APP_ENV` = `production`
   - `APP_MODE` = `mock`
   - `ENABLE_AUTH` = `true` (if you want logins enabled)
   - `JWT_SECRET_KEY` = `[YOUR_SECURE_RANDOM_SECRET]`
   - `DATABASE_URL` = `sqlite:///./apex_capital.db` (for demo) or your Postgres URL.

### Using Railway
1. Connect repo and target the `backend` directory.
2. Railway automatically detects the Python environment.
3. Add the same Environment Variables as above.

---

## 5. Mock Mode vs. Real LLM Mode

### Mock Mode Deployment (Recommended for Portfolios)
- Set `APP_MODE=mock` on the backend.
- Do NOT provide API keys.
- **Why?** Guarantees zero latency, prevents API abuse, and costs nothing. Perfect for interviews.

### Real LLM Mode Setup
- Set `APP_MODE=real` and `ENABLE_REAL_LLM=true`.
- Provide `GEMINI_API_KEY`, `OPENAI_API_KEY`, or `ANTHROPIC_API_KEY`.
- The system will dynamically route tasks to live models.

---

## 6. Production Database Notes

By default, the backend uses a local `sqlite:///./apex_capital.db` database.
**Warning for Render/Railway:** Cloud providers spin down containers and reset local files. A SQLite database will lose state on every redeploy.
**Fix:** For a robust production environment, attach a managed PostgreSQL database and update the `DATABASE_URL`.

---

## 7. Troubleshooting

- **Frontend cannot reach backend:** Ensure `NEXT_PUBLIC_API_URL` exactly matches your deployed backend URL without a trailing slash.
- **CORS error:** The frontend is making a request, but the backend rejects it. Add your exact Vercel URL to `CORS_ORIGINS` in the backend environment variables.
- **Backend starts but seed data missing:** Make sure your `apex_capital.db` is either tracked in Git (for quick SQLite demos) or ensure the seed script runs on deployment startup.
- **Build fails due to TypeScript:** Ensure `npm run build` passes locally. Vercel runs a strict TS check.
- **API URL undefined:** Ensure the variable starts with `NEXT_PUBLIC_` so the browser can read it.
- **SQLite file issue on hosted backend:** If changes aren't saving on Render, remember that Render's free tier has an ephemeral disk. Use Postgres for persistent storage.
