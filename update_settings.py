with open("frontend/app/settings/page.tsx", "r") as f:
    content = f.read()

injection = """
import { getWebResearchStatus } from "@/lib/api"
// ... we will fetch status on load
"""

# Actually, I should just modify the frontend page directly, but let's see how it looks.
