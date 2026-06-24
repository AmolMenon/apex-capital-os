import re

with open("backend/main.py", "r") as f:
    content = f.read()

helper_fn = """
def normalize_deal_id(deal_id: str) -> int:
    d_id = str(deal_id).replace("deal-", "").replace("src_", "").lower()
    if d_id == "active": return 7
    if d_id == "zepto": return 7
    if d_id == "mistral": return 5
    if d_id == "bharatvector": return 999
    try:
        return int(d_id)
    except ValueError:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Deal not found")
"""

# Insert helper_fn after `app = FastAPI(...)` and before its endpoints.
if "def normalize_deal_id" not in content:
    content = content.replace("app = FastAPI(", helper_fn + "\napp = FastAPI(")

# Now replace the specific code blocks in read_deal
content = re.sub(
    r'if deal_id == "active":\n\s+deal_id = 7.*?\n\s+elif deal_id == "zepto":\n\s+deal_id = 7\n\s+elif deal_id == "mistral":\n\s+deal_id = 5\n\s+try:\n\s+deal_id = int\(str\(deal_id\)\.replace\("deal-", ""\)\)\n\s+except ValueError:\n\s+raise HTTPException\(status_code=404, detail="Deal not found"\)',
    'deal_id = normalize_deal_id(deal_id)',
    content,
    flags=re.DOTALL
)

# And replace all the remaining Try-except ValueError logic:
content = re.sub(
    r'try:\n\s+deal_id = int\(str\(deal_id\)\.replace\("deal-", ""\)\)\n\s+except ValueError:\n\s+raise HTTPException\(status_code=404, detail="Deal not found"\)',
    'deal_id = normalize_deal_id(deal_id)',
    content,
    flags=re.DOTALL
)

# Also there are instances of just:
# deal_id = int(str(deal_id).replace("deal-", ""))
content = re.sub(
    r'deal_id = int\(str\(deal_id\)\.replace\("deal-", ""\)\)',
    'deal_id = normalize_deal_id(deal_id)',
    content
)

with open("backend/main.py", "w") as f:
    f.write(content)
