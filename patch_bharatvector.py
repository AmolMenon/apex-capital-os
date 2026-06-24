import re
with open('backend/main.py', 'r') as f:
    content = f.read()

replacement = """        from datetime import datetime
        return schemas.Deal(
            id=999,
            startup_name="BharatVector AI",
            sector="Enterprise AI",
            stage="Seed",
            business_model="B2B AI",
            geography="India",
            description="Building regional-language enterprise AI infrastructure for Indian businesses.",
            status="triage",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )"""

content = re.sub(r'        return schemas\.Deal\([\s\S]*?status="triage"\n        \)', replacement, content)

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Patched backend/main.py")
