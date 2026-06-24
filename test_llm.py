import requests
import json

data = {
    "task_type": "investment_memo",
    "context": "Company: Stripe. Sector: Fintech. Desc: Global payments infrastructure for the internet."
}

res = requests.post("http://127.0.0.1:8000/ai/test-provider", json=data)
print(res.status_code)
print(json.dumps(res.json(), indent=2))
