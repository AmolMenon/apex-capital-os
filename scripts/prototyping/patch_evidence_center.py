import re

with open("frontend/app/deals/[id]/evidence-center/page.tsx", "r") as f:
    content = f.read()

if "getDataRoomReport" not in content:
    # We need to fetch the data room report and merge it into the evidence
    # It's a complex file. Let's just do a simpler string replace.
    pass
