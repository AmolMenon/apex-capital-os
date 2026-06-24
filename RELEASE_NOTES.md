# Release Notes

## v1.0 Portfolio MVP

Apex Capital is an agentic VC analyst operating system designed to move a startup from deal intake through to an evidence-backed investment memo. This release represents a feature-complete portfolio prototype.

### What Apex Capital Does
It acts as a digital Investment Committee (IC) analyst, breaking down the traditional venture capital workflow into a series of deterministic evaluations powered by an LLM backend.

### Core Workflow
1. **Intake & Screen:** Rapid evaluation of the startup against VC power-law math.
2. **Analysis & Research:** Market sizing, competitive mapping, and automated web research.
3. **Deck & Conversations:** Extracts claims from the pitch deck and cross-references them against multi-round founder conversations to detect contradictions.
4. **Diligence:** Translates risks into operational diligence tasks and reference call scripts.
5. **Decision & Memo:** Calculates final IC readiness and generates an institutional-grade investment memo.

### Major Modules
- **Command Center:** Portfolio overview and pipeline management.
- **Deal Room:** Hub for analyzing an individual startup.
- **Conversation Intelligence:** Detects contradiction risk across transcript history.
- **Fund Fit:** Models target ownership and required exit scale.

### Flagship Demo Deal
- **NeuralDesk:** A seeded Series A enterprise SaaS deal crafted specifically to demonstrate the system's ability to identify missing evidence and founder contradictions, capping its IC readiness despite a high initial "Apex Score."

### Mock Mode Paradigm
By default, the application runs in `APP_MODE=mock`. This ensures a flawless, zero-latency experience for live demonstrations, interviews, and portfolio reviews without the risk of API timeouts or rate limits. Real LLM capabilities (OpenAI, Anthropic, Gemini) can be activated in the backend configuration.

### Known Limitations
- The system defaults to mock-mode heuristics for stability.
- There is no real pitch deck PDF OCR currently enabled (deck intelligence relies on simulated extraction).
- Authentication (Auth0/Clerk) has been disabled to reduce friction for public reviewers.
- Team collaboration features are not yet implemented.
- Market database integrations (e.g., PitchBook, Crunchbase) are simulated.
- Default local database is SQLite; production requires PostgreSQL.
- **Not Financial Advice:** The outputs are illustrative and not intended as legal or financial guidance.
- Real LLM integration requires valid backend API keys and a change to `APP_MODE=real`.

### Recommended Demo Route
1. Start at the **Landing Page**.
2. Click **Start Guided Demo** to view the presentation thesis.
3. Open the **Command Center**.
4. Enter the **NeuralDesk Deal Room**.
5. Explore the **Conversation Intelligence** and **Decision** tabs to see the logic.
6. Review the **Investment Memo** and **IC One-Pager**.

### Future Roadmap
- Integration with live market data APIs.
- Full PDF parsing for true zero-shot deck intelligence.
- Multi-user authentication and role-based access control.
