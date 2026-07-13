import sys
import os
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from main import get_system_status

try:
    print(get_system_status())
except Exception as e:
    import traceback
    traceback.print_exc()
