from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
response = client.post("/war-room/deals/1/run")
print(response.status_code)
print(response.json())
