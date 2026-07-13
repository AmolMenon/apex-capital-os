import os
import glob
import re

for root, dirs, files in os.walk('backend'):
    for file in files:
        if file.endswith('.py'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r') as f:
                content = f.read()
            # Replace "from models import" with "from db.models import"
            content = re.sub(r'from models import', r'from db.models import', content)
            # Replace "import models" with "from db import models"
            content = re.sub(r'^import models\b', r'from db import models', content, flags=re.MULTILINE)
            # Replace "from database import" with "from db.database import" (if database.py is moved)
            content = re.sub(r'from database import', r'from db.database import', content)
            # Replace "from database.session" with "from db.session"
            content = re.sub(r'from database.session', r'from db.session', content)
            with open(filepath, 'w') as f:
                f.write(content)
