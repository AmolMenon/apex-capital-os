# Final Route Smoke Test Checklist

Use this checklist to perform a manual smoke test of the application before any public release or live demo.

## Instructions
For each route below, verify the following:
- [ ] Page loads without crashing.
- [ ] Page title and primary layout structure are visible.
- [ ] No `undefined`, `null`, or `NaN` values are rendered in the UI.
- [ ] No raw JSON objects are visible on the screen.
- [ ] All primary buttons and links in the main flow work.
- [ ] Layout is responsive with no horizontal overflow.
- [ ] Clear back/next navigation exists where applicable.

---

## 1. Public Routes
- [ ] `/` (Landing Page)
- [ ] `/presentation` (Presentation Mode)

## 2. Fund & Global Routes
- [ ] `/command-center` (Executive Dashboard)
- [ ] `/compare` (Deal Compare Board)
- [ ] `/settings` (Settings & AI Routing)

*(Note: `/dashboard`, `/methodology`, `/demo`, `/demo-script`, `/fund`, `/getting-started`, `/deals/new`, `/watchlist` and `/pipeline` are either deprecated, merged into the Command Center, or placeholder links depending on the build. Ensure no broken links exist pointing to deprecated routes.)*

## 3. Deals (Flagship: NeuralDesk ID=1)
Navigate to `/deal/1/deal-room` and verify all deal tabs:
- [ ] **Overview** (`/deal/1/deal-room`)
- [ ] **Research** (`/deal/1/research`)
- [ ] **Deck** (`/deal/1/deck`)
- [ ] **Diligence** (`/deal/1/diligence`)
- [ ] **Conversations** (`/deal/1/conversations`)
- [ ] **Partner Review** (`/deal/1/partner-review`)
- [ ] **Decision** (`/deal/1/decision`)
- [ ] **Fund Fit** (`/deal/1/fund-fit`)
- [ ] **Memo** (`/deal/1/memo`)
- [ ] **IC One-Pager** (`/deal/1/ic-one-pager`)

---

## Final Validation
If all routes load successfully in `mock` mode with no console errors or UI breaks, the build is certified for public presentation.

## Agentic Workflow QA
- run agent workflow in mock mode
- run workflow with no keys
- rerun failed agent
- check agent trace
- check decision impact
- check memo output
