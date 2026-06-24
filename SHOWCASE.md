# Showcase & Screenshots

To properly showcase Apex Capital in a portfolio, GitHub, or LinkedIn post, capture screenshots of the following exact views to tell the "Narrative to Evidence" story.

## Recommended Screenshot Order

1. **Landing Page**
   - **Route:** `/`
   - **Capture:** Hero section and workflow visual. Shows the core value proposition.

2. **Presentation Mode**
   - **Route:** `/presentation`
   - **Capture:** Product thesis and workflow visual. Demonstrates system logic.

3. **Executive Command Center**
   - **Route:** `/command-center`
   - **Capture:** Fund overview, bottlenecks, top opportunities. Proves high-level dashboard capability.

4. **Compare Deals**
   - **Route:** `/compare`
   - **Capture:** NeuralDesk vs VetPulse AI vs CarbonLoop. Shows multi-deal analytics.

5. **NeuralDesk Deal Room**
   - **Route:** `/deals/{neuraldesk_id}/deal-room`
   - **Capture:** Top summary, scores, next best action.

6. **Decision Engine**
   - **Route:** Deal Room → Decision tab
   - **Capture:** Calibrated recommendation, blockers, evidence gaps. Shows deterministic logic overriding a high score.

7. **Conversation Intelligence**
   - **Route:** `/deals/{neuraldesk_id}/conversations`
   - **Capture:** Conversation score, contradiction risk, follow-ups. The "star" feature of the analysis.

8. **Diligence Command Center**
   - **Route:** `/deals/{neuraldesk_id}/diligence`
   - **Capture:** IC readiness, diligence tasks, founder follow-ups. Shows operational translation of risks.

9. **Fund Fit**
   - **Route:** `/deals/{neuraldesk_id}/fund-fit`
   - **Capture:** Ownership math and thesis fit. Brings real VC math into the equation.

10. **Memo**
    - **Route:** `/deals/{neuraldesk_id}/memo`
    - **Capture:** Executive summary and final recommendation. 

11. **IC One-Pager**
    - **Route:** `/deals/{neuraldesk_id}/ic`
    - **Capture:** Compact partner-ready view.

12. **Settings / AI Routing**
    - **Route:** `/settings`
    - **Capture:** Mock mode and provider routing. Shows technical orchestration layer.

---

## Suggested Copy for LinkedIn/GitHub

**Headline:** 
Apex Capital: An Agentic VC Analyst Operating System

**Description:**
I built Apex Capital to solve a major problem in early-stage investing: fragmented judgment. Investors often rely on intuition, scattered notes, and unverified pitch deck claims.

Apex Capital treats venture evaluation as a structured data pipeline. It separates the "narrative thesis" from "hard evidence." 

**Core Workflow:**
1. Ingests the deal and runs power-law heuristics.
2. Extracts claims from the pitch deck and cross-references them against web-scraped market intelligence.
3. Analyzes multi-round founder-investor conversations to flag contradictions and evasion.
4. Translates identified risks directly into a Diligence Command Center.
5. Deterministically calculates IC Readiness and generates the final Investment Memo.

**Technical Architecture:**
Built with Next.js, FastAPI, and Python, leveraging a model-agnostic routing layer that switches between OpenAI, Anthropic, Gemini, or a deterministic Mock Mode.

[Link to Repo] | [Link to Demo]

---

## Suggested Portfolio Project Description

**Role:** Full-Stack Engineer / Product Architect
**Project:** Apex Capital

**Overview:**
Designed and engineered a full-stack, institutional-grade VC analyst operating system. The platform orchestrates complex AI workflows to evaluate startups, extract evidence from pitch decks, analyze founder conversations for contradictions, and generate deterministic investment memos. 

**Key Technical Achievements:**
- Built a modular Python backend (FastAPI) utilizing an intelligent LLM routing layer.
- Designed a premium Next.js frontend with `shadcn/ui` and framer-motion, creating a cohesive "Command Center" experience.
- Engineered a 100% deterministic "Mock Mode" fallback state, allowing for flawless, zero-latency public demonstrations without third-party API dependencies.
