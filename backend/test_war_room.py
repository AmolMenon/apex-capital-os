from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
response = client.get("/war-room/deals/1")
print(response.status_code)
print(response.json())
