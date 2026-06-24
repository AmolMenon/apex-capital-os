# ACCESSIBILITY AND DISCOVERABILITY AUDIT

## Methodology
Every route, feature, and interaction flow within Apex Capital was manually audited against the standard VC Analyst user journey. The audit specifically evaluated whether features were reachable, logically grouped, and fail-safe when API keys were missing.

## Global Route Audit

| Route | Purpose | Sidebar | Deal Room | Command Center | Issues Found | Fix Applied |
|-------|---------|---------|-----------|----------------|--------------|-------------|
| `/command-center` | VC Analyst Desk | Yes | Yes | N/A | Lacked priority queues. | Rebuilt as VC Analyst Home. |
| `/demo-control-center` | Guided demo launcher | Yes | N/A | N/A | Missing entirely. | Created. |
| `/feature-map` | Full OS directory | Yes | N/A | N/A | Missing entirely. | Created. |
| `/system-status` | Backend / LLM diagnostics | Yes | N/A | Yes | Missing entirely. | Created. |
| `/real-benchmarks` | Showcase of public startups | Yes | N/A | Yes | Missing entirely. | Created. |
| `/deal/[id]/evidence-center` | Source-backed diligence graph | Yes | Yes | N/A | Missing entirely. | Created. |
| `/deal/[id]/red-team` | Skeptical partner critique | Yes | Yes | N/A | Missing entirely. | Created. |
| `/deal/[id]/ic-packet` | Compiled document builder | Yes | Yes | N/A | Missing entirely. | Created. |

## Navigation Fixes
- **Old Sidebar**: Cluttered, illogical grouping, broken selected deal logic resulting in 404s when navigating across Intelligence and Diligence tabs.
- **New Sidebar**: Logically segmented into: Overview, Deal Flow, Intelligence, Diligence, Investment Outputs, System. Enforces a default `deal-1` (Sarvam AI) if a specific deal is not selected, preventing empty state crashes.

## API & State Normalization
- Centralized all `fetch()` calls into `frontend/lib/api.ts`.
- Typed all outputs using `frontend/types/index.ts`.
- Introduced `<ErrorBoundary />` across the application to elegantly catch any backend disconnection errors.
