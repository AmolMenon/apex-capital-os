# Apex Capital — Building an Agentic VC Analyst OS

*(Note: This is a portfolio project and educational prototype. It is not financial advice, investment advice, or a substitute for professional diligence. Outputs are generated through mock-mode heuristics unless real providers are configured.)*
## 1. Problem
Early-stage investment analysis is highly fragmented. Analysts constantly context-switch between pitch decks, unstructured Notion pages, financial spreadsheets, research notes, founder calls, and diligence trackers. This fragmentation makes it difficult to trace exactly why an investment committee made a decision and whether it was based on hard evidence or just a strong founder narrative.

## 2. Product Thesis
Apex Capital brings deal intake, structured analysis, research intelligence, pitch deck review, diligence planning, IC readiness, and memo generation into one unified workflow. By abstracting the "grunt work" to specialized AI engines, it allows the human analyst to focus purely on judgment and relationship building.

## 3. Target User
- **VC Analyst**: Automates their weekend memo writing.
- **Founder’s Office Intern**: Rapidly screens competitors and partnership targets.
- **Angel Investor**: Organizes deal flow without paying for expensive enterprise software.
- **Startup Scout**: Generates highly standardized deal packages for syndicates.
- **Student**: Prepares for VC/PE/Consulting case study interviews.

## 4. Core Workflow
1. **Deal Intake**: Raw startup metrics and narrative are ingested.
2. **Analysis Engine**: Deterministic evaluation of unit economics based on the startup's archetype (e.g. Marketplace, SaaS).
3. **Research Intelligence**: Market sizing, competitor mapping, and an "Evidence Grader" that explicitly downgrades unverified claims.
4. **Deck Intelligence**: Unstructured pitch deck extraction that flags missing investor-critical information.
5. **Diligence Command Center**: An automated task list and follow-up generator derived from the deck and research gaps.
6. **Conversation Intelligence**: Evaluates multi-round founder-investor transcripts for contradiction risk, responsiveness, and credibility.
7. **Fund Fit Engine**: Power Law simulations, thesis alignment, and portfolio reserve strategy.
8. **Decision Engine**: Calibrated, multi-gate recommendation combining all intelligence outputs.
9. **Memo & IC One-Pager**: The final synthesized outputs for the Investment Committee.

## 5. Why it is not just a dashboard
Apex Capital is an operating system, not a generic GPT wrapper. 
- It uses **modular engines** (Deck, Research, Diligence, Fund Fit, Decision) that act independently and cross-reference each other.
- It separates **thesis quality** from **evidence quality**. A startup can have a brilliant thesis but a failing evidence score.
- It converts unstructured claims directly into actionable **diligence tasks**.
- It provides top-level portfolio views like a **Command Center**, **Decision Board (Kanban)**, and **Deal Comparisons** instead of just a raw pipeline list.

## 6. Technical Architecture
The system is entirely decoupled to ensure it remains model-agnostic and scalable.
- **Next.js 15 Frontend**: Uses App Router, React Server Components, and Tailwind CSS.
- **FastAPI Backend**: High-performance asynchronous Python backend.
- **SQLite Database**: Uses SQLAlchemy ORM for relational structuring of complex JSON outputs.
- **Pydantic Schemas**: Forces all LLMs to adhere strictly to predefined JSON outputs, preventing UI crashes.
- **Model-Agnostic AI Provider**: The `AIProviderRouter` abstracts the intelligence layer. If OpenAI breaks, the system instantly switches to Gemini or Claude.

## 7. Demo Deal: NeuralDesk
**NeuralDesk** serves as the flagship demonstration company within the app. It's an Enterprise AI SaaS platform.
When NeuralDesk moves through the system:
1. It receives an **82.5/100** score due to its high gross margin and low CAC payback.
2. The Deck Engine flags that their "100% retention" claim is unsupported by cohorts.
3. The Diligence Engine immediately creates a mandatory task: "Verify Month-over-Month cohort retention."
4. The IC One-Pager ultimately recommends a "Strong Invest," but legally conditions it upon finishing the cohort diligence task.

## 8. Limitations
- **Mock Mode**: Currently runs heavily on deterministically mocked LLM responses to ensure perfect demo reliability without API keys.
- **No Native OCR**: Currently accepts text extracts of pitch decks; true PDF parsing is a future milestone.
- **No Authentication**: Single-tenant local application.

## 9. Future Roadmap
- **Real LLM Integration**: Activating the Gemini and Claude integrations.
- **Pitch Deck OCR**: Auto-extracting charts and tables from PDFs.
- **Web Research Agent**: Enabling the system to auto-google competitor pricing to fact-check founder claims.
- **Data Room Uploads**: Accepting massive zips of financial docs to auto-generate the models.
- **Multi-Player Collaboration**: Adding commenting and tagging for deal teams.

## 10. Interview Positioning
*Use these points to frame your project during interviews:*
- "I built an orchestration layer, not just an LLM wrapper. I managed the chaos of AI outputs using strict Pydantic schemas."
- "I separated 'Thesis' from 'Evidence' because I understand that venture capital is about fighting cognitive bias."
- "I architected the backend to be model-agnostic. My business logic is entirely protected from OpenAI API changes."
- "The UI was built to feel like Palantir or Bloomberg—high data density over excessive whitespace."
- "It handles the entire lifecycle of an asset, proving I understand complex state management in Next.js 15."

### Feature Deep-Dive: Benchmark Mode
To prove the platform's analytical rigor, I added real startup benchmarks (e.g. Sarvam AI, Zepto). Instead of just spitting out "Invest" based on hype, the system flags that private diligence data is missing and recommends "Proceed to diligence if mandate fit" or "Requires Private Diligence." This demonstrates VC-grade epistemic humility.
