import re
with open('frontend/app/deals/[id]/deal-room/page.tsx', 'r') as f:
    content = f.read()

content = content.replace(
    'webResearch = await api.getWebResearch(parseInt(params.id.replace("deal-", ""))).catch(() => null)',
    'if (deal) { webResearch = await api.getWebResearch(deal.id).catch(() => null) }'
)

with open('frontend/app/deals/[id]/deal-room/page.tsx', 'w') as f:
    f.write(content)

print("Patched deal-room/page.tsx")
