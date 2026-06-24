import os

class ExternalIntegrationRouter:
    @staticmethod
    def get_status() -> dict:
        return {
            "email": os.getenv("EMAIL_INTEGRATION_PROVIDER", "mock"),
            "calendar": os.getenv("CALENDAR_INTEGRATION_PROVIDER", "mock"),
            "slack": os.getenv("SLACK_INTEGRATION_PROVIDER", "mock"),
            "crm": os.getenv("CRM_INTEGRATION_PROVIDER", "mock"),
            "notion": os.getenv("NOTION_INTEGRATION_PROVIDER", "mock"),
            "webhook": os.getenv("WEBHOOK_URL", "mock")
        }
