import requests

try:
    print("Health:")
    print(requests.get("http://localhost:8000/health").json())
    print("\nAI Status:")
    print(requests.get("http://localhost:8000/ai/status").json())
    print("\nTest Provider:")
    res = requests.post("http://localhost:8000/ai/test-provider", json={"task_type": "investment_memo", "context": "{}"})
    print(res.json())
except Exception as e:
    print(f"Error: {e}")
