import os
import re

def fix_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    # Pattern for Server Components (async functions with params prop)
    # E.g.: export default async function Page({ params }: { params: { id: string } }) {
    
    if "params = await props.params;" in content:
        return False
        
    pattern = re.compile(r'export default async function (\w+)\(\s*\{\s*params\s*\}?\s*:\s*\{\s*params\s*:\s*\{([^}]+)\}\s*\}\s*\)\s*\{')
    
    match = pattern.search(content)
    if match:
        func_name = match.group(1)
        params_type = match.group(2)
        
        # Replace the function signature
        new_sig = f"export default async function {func_name}(props: {{ params: Promise<{{{params_type}}}> }}) {{\n  const params = await props.params;"
        
        new_content = content[:match.start()] + new_sig + content[match.end():]
        
        # We also need to find cases where `params` is accessed as `params.id` 
        # But wait, in the new code, `params` is redefined as the awaited object.
        # So `params.id` will just work!
        
        with open(filepath, 'w') as f:
            f.write(new_content)
        print(f"Fixed {filepath}")
        return True
    return False

root_dir = "frontend/app"
fixed_count = 0
for subdir, dirs, files in os.walk(root_dir):
    for file in files:
        if file == "page.tsx":
            filepath = os.path.join(subdir, file)
            if fix_file(filepath):
                fixed_count += 1
print(f"Fixed {fixed_count} files.")
