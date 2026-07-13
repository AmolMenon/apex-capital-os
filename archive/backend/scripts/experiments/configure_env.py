import getpass
import sys

try:
    key = getpass.getpass("Enter replacement GEMINI_API_KEY: ")
    if not key:
        print("Error: Empty key provided.")
        sys.exit(1)
        
    env_path = ".env"
    with open(env_path, "r") as f:
        lines = f.readlines()
        
    with open(env_path, "w") as f:
        for line in lines:
            if line.startswith("GEMINI_API_KEY="):
                f.write(f"GEMINI_API_KEY={key}\n")
            elif line.startswith("APEX_LLM_MODE="):
                f.write("APEX_LLM_MODE=live\n")
            else:
                f.write(line)
                
    print("\nSuccessfully updated .env with secure credential and set APEX_LLM_MODE=live.")
except Exception as e:
    print(f"\nError: {e}")
    sys.exit(1)
