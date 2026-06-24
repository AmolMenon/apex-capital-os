import re
with open('backend/main.py', 'r') as f:
    content = f.read()

replacement = """    if str(deal_id) == "zepto":
        deal_id = 7
    try:
        deal_id = int(str(deal_id).replace("deal-", ""))"""

content = re.sub(r'    try:\n        deal_id = int\(str\(deal_id\)\.replace\("deal-", ""\)\)', replacement, content)

with open('backend/main.py', 'w') as f:
    f.write(content)

print("Patched backend/main.py for zepto")
