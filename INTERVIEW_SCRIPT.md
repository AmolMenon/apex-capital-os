# Apex Capital - Interview & Demo Script

This script is designed for product management, consulting, or software engineering interviews to showcase Apex Capital.

## 🎤 The "One-Liner"
> "Apex Capital is an agentic VC analyst operating system that moves startups from first look to evidence-backed investment judgment, diligence planning, fund-fit assessment, and IC readiness."

---

## ⏱ 1-Minute Demo (The Elevator Pitch)
**Goal:** Show the core value proposition instantly.

1. **Landing Page (`/`)**: 
   - *"This is Apex Capital, a full-stack operating system for venture evaluation."*
2. **Executive Command Center (`/command-center`)**: 
   - *"Here is the firm's pipeline. We can see which deals are moving to the Investment Committee and which are stuck in diligence."*
3. **NeuralDesk Deal Room (`/deal/deal-1/deal-room`)**: 
   - *"Let's look at NeuralDesk. The system separates the 'Apex Score' (how good the story is) from the 'Evidence Score' (how much proof we have). Because evidence is low, the Decision Engine has flagged it as 'Watchlist'."*
4. **IC One-Pager (`/deal/deal-1/ic-one-pager`)**: 
   - *"Ultimately, it takes the unstructured data, fills the diligence gaps, and outputs a deterministic, print-ready memo for the partners."*

---

## ⏱ 3-Minute Demo (The Product Walkthrough)
**Goal:** Prove that it is a multi-step workflow, not a simple AI wrapper.

1. **Landing Page & Command Center**: (Same as above)
2. **Compare (`/compare`)**:
   - *"We can compare deals against each other across core VC metrics like team and market size."*
3. **Deal Room**: (Same as above)
4. **Research Intelligence (`/deal/deal-1/research`)**:
   - *"We don't just take the founder's word. The system automatically builds a market map and competitor analysis."*
5. **Diligence Command Center (`/deal/deal-1/diligence`)**:
   - *"It reads the pitch deck, flags unsupported claims, and automatically creates a risk resolution plan, down to the exact questions we need to ask the founder."*
6. **IC One-Pager (`/deal/deal-1/ic-one-pager`)**:
   - *"Once the evidence is gathered, it generates the final memo."*

---

## ⏱ 5-Minute Demo (The Institutional Deep Dive)
**Goal:** Show deep domain knowledge of venture capital mechanics (Fund Fit, Deal Mechanics).

1. **Presentation Mode (`/presentation`)**: Start here for a clean slide-like intro.
2. **Command Center & Compare**: (Standard flow)
3. **Deal Room**: (Standard flow)
4. **Decision Engine (`/deal/deal-1/decision`)**:
   - *"The Decision Engine is deterministic. It explicitly asks: 'Why not automatically invest?' and highlights the primary diligence risk."*
5. **Research & Deck Intelligence**: Show how claims are extracted from the deck and cross-referenced.
6. **Conversation Intelligence**: Show how the platform automatically ingests and assesses multiple back-and-forth rounds between founders and investors to flag contradictory claims and rate founder credibility.
7. **Diligence Command Center**: (Standard flow)
7. **Fund Fit (`/deal/deal-1/fund-fit`)**:
   - *"This is the institutional layer. A deal might be great, but does it fit a $500M fund? The engine simulates ownership targets, follow-on reserves, and the required exit size to return the fund."*
8. **Memo & IC**: Show the final outputs.
9. **Settings (`/settings`)**:
   - *"The backend is completely model-agnostic. It runs locally in Mock Mode for safe offline demos, but seamlessly routes to Gemini, OpenAI, or Claude for production data."*

---

## ⏱ 10-Minute Demo (Full Technical Walkthrough)
**Goal:** For engineering or technical PM roles. Walk through the entire app, focusing on architecture and technical decisions.

- Walk through the **5-Minute flow**, but pause to explain the architecture.
- *"The frontend is Next.js 15 using Server Components for speed."*
- *"The backend is FastAPI, structured around specialized Python engines: Analysis, Research, Deck, Diligence, Fund Fit, and Decision."*
- *"Each engine processes data independently and passes it through an AI Provider Router."*
- *"I built a deterministic Mock Mode because generative AI demos frequently break or hallucinate during live presentations. This guarantees a perfect demo every time while preserving the real integration paths."*

---

## 🧠 Anticipated Interview Questions

**Q: Why not just use ChatGPT?**
"ChatGPT generates generic summaries. A VC doesn't need a summary; they need structured diligence, evidence grading, and risk tracking. I built software that thinks structurally like an investor, chaining outputs from a deck extraction into a diligence plan, and finally into an IC memo."

**Q: How do you prevent hallucinations?**
"The system uses a 'Mock Mode' for deterministic, safe fallbacks. When using real LLMs, it utilizes strict JSON schemas and system prompts to force structured outputs, rather than open-ended text generation."

**Q: What is the biggest limitation right now?**
"It currently runs on local/mock data. The next major technical hurdle is wiring up robust PDF parsing (OCR) so founders can just drag-and-drop a 30-page pitch deck directly into the UI."

### Section: Real Benchmarks
**Interviewer:** "How do you handle real-world companies?"
**You:** "I built a Public Benchmark mode. You can load companies like Mistral AI or Zepto. Because they are real, the platform uses a strict Source Registry so it doesn't hallucinate facts. More importantly, because their private metrics like exact ARR aren't public, the Decision Engine correctly downgrades the confidence to 'Requires Private Diligence'. It proves the platform understands the difference between public signal and private verification."
