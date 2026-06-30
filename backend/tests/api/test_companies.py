def test_create_company(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.post(
        "/api/v1/companies/",
        json={"name": "Test Company", "industry": "AI", "stage": "Seed", "description": "Test description"},
        headers=headers
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Test Company"
    assert "id" in data

def test_get_companies(client, admin_token):
    headers = {"Authorization": f"Bearer {admin_token}"}
    response = client.get("/api/v1/companies/", headers=headers)
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["name"] == "Test Company"
