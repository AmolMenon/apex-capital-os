import os
import getpass
import sys

def main():
    print("\n" + "="*50)
    print("Apex Capital - Secure Credential Configuration")
    print("="*50 + "\n")
    try:
        key = getpass.getpass("Enter replacement GEMINI_API_KEY: ").strip()
        if not key:
            print("\nError: Empty key provided. Configuration aborted.")
            input("Press Enter to close...")
            sys.exit(1)
            
        env_path = "/Users/AmolMenon/.gemini/antigravity/scratch/apex-capital/backend/.env"
        with open(env_path, "r") as f:
            lines = f.readlines()
            
        # Make sure APEX_LLM_MODE is in the file if it wasn't
        has_mode = False
        with open(env_path, "w") as f:
            for line in lines:
                if line.startswith("GEMINI_API_KEY="):
                    f.write(f"GEMINI_API_KEY={key}\n")
                elif line.startswith("APEX_LLM_MODE="):
                    f.write("APEX_LLM_MODE=live\n")
                    has_mode = True
                else:
                    f.write(line)
            if not has_mode:
                f.write("APEX_LLM_MODE=live\n")
                    
        print("\nSUCCESS: Successfully updated .env with secure credential and set APEX_LLM_MODE=live.")
        input("Press Enter to close this window...")
    except Exception as e:
        print(f"\nError: {e}")
        input("Press Enter to close...")
        sys.exit(1)

if __name__ == "__main__":
    main()
