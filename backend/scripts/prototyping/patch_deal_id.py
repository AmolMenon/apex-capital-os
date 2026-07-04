import glob

def patch_file(filepath):
    with open(filepath, 'r') as f:
        lines = f.readlines()
        
    for i in range(len(lines)):
        if "deal_id: int" in lines[i] and "Depends(get_db)" in lines[i]:
            lines[i] = lines[i].replace("deal_id: int", "deal_id: str")
            # insert standard deal_id extraction on the next line
            indent = lines[i][:len(lines[i]) - len(lines[i].lstrip())]
            lines.insert(i+1, indent + "    deal_id = int(str(deal_id).replace(\"deal-\", \"\"))\n")
            
    with open(filepath, 'w') as f:
        f.writelines(lines)

for f in glob.glob("backend/routes/*.py"):
    patch_file(f)

print("Patched all routes!")
