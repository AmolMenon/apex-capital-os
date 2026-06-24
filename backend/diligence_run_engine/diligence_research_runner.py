class DiligenceResearchRunner:
    @staticmethod
    def run_research(context: dict) -> dict:
        has_research = len(context.get("public_research", {})) > 0
        return {
            "status": "Found Existing" if has_research else "Skipped",
            "message": "Used existing public research." if has_research else "No public research found. Skipping."
        }
