import os
import glob

files = glob.glob("backend/**/*.py", recursive=True)
for file in files:
    with open(file, "r") as f:
        content = f.read()
    
    if "from backend." in content:
        content = content.replace("from backend.", "from ")
        with open(file, "w") as f:
            f.write(content)
