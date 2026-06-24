from backend.ai_providers.router import router
res = router.execute_task("investment_memo", "Company: Stripe. Sector: Fintech.")
import json
print(json.dumps(res, indent=2))
