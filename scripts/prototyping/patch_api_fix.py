with open("frontend/lib/api.ts", "r") as f:
    content = f.read()

# Fix the infinite loop
content = content.replace("const strId = resolveId(id);", 'const strId = id.toString().replace("deal-", "");')

with open("frontend/lib/api.ts", "w") as f:
    f.write(content)
