# Apex Capital Roadmap

This roadmap outlines the future vision for Apex Capital as it evolves from a robust single-deal evaluation engine into a full-scale institutional investment operating system.

## Short-Term (Next 1-3 Months)
- **Real LLM Integration Validation**: Extensively test the AI Provider Router against production APIs (Gemini 1.5 Pro, GPT-4o, Claude 3.5 Sonnet) using real pitch decks.
- **Pitch Deck OCR**: Implement robust PDF parsing and OCR extraction to feed raw text into the Deck Intelligence engine.
- **PDF Export**: Allow analysts to export the generated IC One-Pager and Investment Memos as clean, branded PDFs.
- **Authentication**: Integrate secure authentication (e.g., Clerk, NextAuth) for multi-user access.
- **Hosted Database**: Migrate from local SQLite/in-memory data to a managed PostgreSQL database (e.g., Supabase or Vercel Postgres).

## Medium-Term (3-6 Months)
- **Live Web Research**: Connect the Research Intelligence engine to Serper or Tavily to dynamically scrape competitor websites and market data.
- **Market Data Integrations**: Integrate with Crunchbase, PitchBook, or Dealroom APIs to automatically populate deal intake forms.
- **Founder Enrichment**: Connect to LinkedIn or Clearbit to pull in founder backgrounds and previous exit histories automatically.
- **Data Room Upload**: Build a secure document parsing pipeline to ingest cap tables, financial models, and legal docs from founder data rooms.
- **Team Collaboration**: Add commenting, tagging, and multi-player editing capabilities to the Memo and Diligence Command Center.

## Long-Term (6-12 Months)
- **Multi-Fund Workspace**: Support multiple fund entities with different thesis configurations, hurdle rates, and target ownership models.
- **Portfolio Analytics**: Track post-investment performance, follow-on reserves, and graduation rates across the active portfolio.
- **CRM Integrations**: Build two-way syncs with Affinity or Salesforce to keep the firm's central CRM updated automatically.
- **Real Investment Committee Workflow**: Add formal voting mechanisms, signature collection, and audit trails for IC decisions.
- **Fund Performance Analytics**: Compute TVPI, DPI, and IRR at the fund level based on the performance of the underlying deals.
