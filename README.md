<div align="center">
  <div style="padding: 1rem; border-radius: 50%; background: rgba(59,130,246,0.1); display: inline-block; margin-bottom: 1rem;">
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  </div>
  
  # Apex Capital
  
  **An agentic VC analyst operating system for evidence-backed startup evaluation.**

  [View Live Demo](#) · [Report Bug](#) · [Request Feature](#)
</div>

---

<br />

Apex Capital is a full-stack, institutional-grade venture capital operating system. It transforms fragmented startup information—pitch decks, founders' claims, market research, and diligence Q&A—into a highly structured, deterministic investment workflow.

By separating the **narrative thesis** from **hard evidence**, Apex Capital ensures that investors make rigorous, data-backed decisions instead of falling in love with a story.

<br />

## ✨ Core Product Workflow

1. **Thesis-Driven Sourcing Engine**: Define investment theses, track market radar signals (hiring, compute), and proactively discover matching companies.
2. **Deal Intake**: Automated screening against VC power-law logic and baseline fund criteria. Converts sourced leads directly to pipeline.
3. **Analysis Engine**: Deep-dive grading of the team, market, and product.
4. **Research Intelligence**: AI-powered market sizing (TAM/SAM/SOM), competitive mapping, and tailwind identification.
4. **Deck Intelligence**: Extracts claims directly from founder decks and cross-references them against missing market evidence.
5. **Diligence Command**: Auto-generates exact diligence action items, customer reference scripts, and data room requests based on identified risks.
6. **Conversation Intelligence**: Multi-round transcript analysis identifying contradictions, evasion, and extracted evidence to assess founder credibility over time.
7. **Decision Engine**: A deterministic rules-engine highlighting exact upgrade/downgrade triggers for an investment and computing final IC Readiness.
8. **Fund Fit**: Real-time portfolio concentration and required exit scaling calculations based on actual fund mathematics.
9. **Investment Memo & IC One-Pager**: Instant markdown generation for final partner review.

<br />

## 🏗 Technical Architecture

Built for scale, stability, and intelligence.

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, `shadcn/ui`, Framer Motion.
- **Backend**: FastAPI, Python 3.9+, SQLAlchemy.
- **Production Readiness**: Full JWT authentication, workspace/team multitenancy, Alembic database migrations, Rate Limiting middleware, and S3 file storage abstraction.
- **AI Orchestration**: Model-agnostic routing layer with Tenacity retries and exponential backoff. Dynamically routes between OpenAI, Anthropic, Gemini, or local models based on task complexity.
- **Data Persistence**: SQLite (local development / mock mode), PostgreSQL (production-ready).
- **Stability First**: Incorporates a 100% deterministic fallback "Mock Mode" for flawless live demonstrations without API latency or rate limits.

<br />

## 🚀 Getting Started

### 1. Backend Setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 2. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:3000` to access the OS. To launch a guided product walkthrough, click **Start Guided Demo**.

<br />

## ⚙️ Environment Configuration

Ensure both frontend and backend have their environment variables set. Reference the `.env.example` files provided in both directories.

**Frontend:**
```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

**Backend:**
```env
APP_MODE=mock  # Set to 'real' to use live APIs
ENABLE_REAL_LLM=false # Set to true to route to live LLMs
OPENAI_API_KEY=sk-...
```

<br />

## 💡 The "Mock Mode" Paradigm

Apex Capital is engineered specifically to be a **robust portfolio piece and interview artifact**. By default, it operates in a fully simulated "Mock Mode" (`APP_MODE=mock`). 

This architecture guarantees:
- **Flawless Live Demos:** Zero third-party API latency or timeouts during critical presentations.
- **Cost Efficiency:** No LLM API costs incurred during routine development or public portfolio views.
- **Seeded Scenarios:** The flagship "NeuralDesk" deal is meticulously crafted to demonstrate edge cases like missing evidence and founder contradictions.

*To deploy in production with real AI reasoning, simply configure your API keys and switch to `APP_MODE=real`.*

<br />

## 🎙 Interview Talking Points

If reviewing this repository as part of an engineering, product, or VC interview:

1. **Thesis vs. Evidence**: *"Apex Capital forces intellectual honesty. It separates a compelling narrative thesis from the cold evidence required to underwrite a check. It prevents investors from falling in love with a story without verifying the facts."*
2. **Workflow, Not Just Chat**: *"Unlike typical 'ChatGPT wrappers' which rely on open-ended chat interfaces, this is an agentic workflow. The AI operates deterministically in the background, surfacing highly structured insights directly into an enterprise-grade UI."*
3. **Model-Agnostic Routing**: *"The backend orchestrator dynamically routes prompts to different LLMs based on task complexity and cost, seamlessly falling back to a deterministic mock data layer to ensure 100% demo uptime."*

<br />

## ⚠️ Disclaimer

Every public-facing document and output generated by this application must include the following notice:

> **Apex Capital** is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs run in mock mode by default unless real providers are configured.

---

<div align="center">
  <p>Built with precision and intellectual rigor.</p>
</div>

### Real Startup Benchmark Mode
Apex Capital supports evaluating high-profile public companies (e.g., Mistral AI, Zepto, Sarvam AI) as benchmarks to ground the AI's analysis in reality. 
- **No Hallucinations:** Real companies use strict `Public Source Registries` to back up claims.
- **Diligence Gates:** Since private metrics (like ARR and precise retention) aren't public, the system correctly flags them as "Not publicly available" and downgrades the investment confidence to "Requires Private Diligence".
- **Compare Mode:** Cross-evaluate your own pipeline against industry benchmarks.

### Agentic VC Research Workflow
Apex Capital now runs an autonomous, multi-agent evaluation pipeline consisting of 12 specialized agents:
- **Research Planner Agent**: Defines the objectives and search strategy.
- **Search Agent**: Interfaces with the Web Research Engine.
- **Source Quality Agent**: Scores domain authority.
- **Claim Extraction Agent**: Structures unstructured text into claims.
- **Evidence Verification Agent**: Cross-references claims and determines what enters the memo as fact.
- **Market Mapping Agent**: Assesses category dynamics.
- **Competitor Analysis Agent**: Maps direct/adjacent threats.
- **Diligence Gap Agent**: Flags critical missing private metrics (e.g. Cohort Retention).
- **Fund Fit Agent**: Checks cheque size and ownership feasibility.
- **Red Team Agent**: Actively attacks the thesis and highlights hype risks.
- **Memo Writer Agent**: Generates the final IC read-out.
- **IC Readiness Agent**: Sets deterministic blockers based on missing data.

### Thesis-Driven Sourcing Engine
Apex moves beyond reactive deal evaluation into proactive market mapping:
- **Thesis Engine**: Define rigid theses (e.g., India AI Infra) and score newly discovered companies against them.
- **Market Radar**: Scans public signals like hiring spikes, Github stars, and compute acquisitions to detect heating markets before companies actively fundraise.
- **Company Discovery**: Matches companies to theses and computes a unified Sourcing Score based on thesis fit, signal strength, and market timing.
- **Founder Outreach**: Auto-generates personalized email drafts, LinkedIn messages, and Analyst call prep notes directly from public signals.

### Cross-Fund Copilot & Knowledge Graph
Chat directly with the intelligence layer using the **Partner Copilot**:
- Ask questions across the entire portfolio: *"Which deal has the highest IC readiness?"*
- Extract patterns using the **Learning Loop**: *"Why do our AI Infra deals keep stalling in IC?"*
- Identify immediate priorities: *"Which sourced company should I look at first?"*

### Autonomous Deal War Room & IC Simulator
Apex Capital goes beyond static memos by simulating a live Investment Committee debate using the Autonomous Deal War Room. 
- **Conviction Dashboard**: Translates evidence quality and thesis strength into an actionable 0-100 score.
- **Partner Personas**: Simulates how different partners (e.g. Growth Partner, Deep Tech Partner) would react to the deal.
- **What Must Be True**: Tracks critical assumptions against current evidence confidence.
- **Fund Math Engine**: Projects required entry/exit valuations and ownership targets to achieve a 1x/3x fund return.
- **Change Our Mind Protocol**: Deterministic conditions outlining exact triggers that would upgrade a 'Pass' to an 'Invest'.
