import re
with open('frontend/app/deals/[id]/diligence/page.tsx', 'r') as f:
    content = f.read()

content = content.replace('parseInt(params.id as string)', 'deal?.id || parseInt(params.id as string)')

with open('frontend/app/deals/[id]/diligence/page.tsx', 'w') as f:
    f.write(content)

print("Patched diligence/page.tsx")
