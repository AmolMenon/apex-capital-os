import time
import subprocess
import os
import signal
from playwright.sync_api import sync_playwright

def seed_db():
    print("Seeding DB...")
    import db.models as models
    from db.database import engine, Base, SessionLocal
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    from test_deterministic_e2e import seed_test_data
    seed_test_data(SessionLocal())

def run_tests():
    os.environ["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
    
    # Start Frontend
    print("Starting frontend...")
    frontend_dir = os.path.join(os.path.dirname(os.getcwd()), "frontend")
    npm_path = "/Users/AmolMenon/.nvm/versions/node/v22.22.3/bin/npm"
    frontend_env = os.environ.copy()
    frontend_env["PATH"] = "/Users/AmolMenon/.nvm/versions/node/v22.22.3/bin:" + frontend_env.get("PATH", "")
    frontend_proc = subprocess.Popen(
        [npm_path, "run", "dev"],
        cwd=frontend_dir,
        env=frontend_env
    )
    
    time.sleep(5)
    
    try:
        with sync_playwright() as p:
            browser = p.chromium.launch(headless=True)
            
            # SCENARIO A: CLEAR
            print("\\n=== SCENARIO A: CLEAR ===")
            seed_db()
            env_clear = os.environ.copy()
            env_clear["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
            env_clear["MOCK_LLM_PROVIDER"] = "1"
            env_clear["MOCK_SCENARIO"] = "CLEAR"
            backend_clear = subprocess.Popen(["venv/bin/uvicorn", "main:app", "--port", "8000"], env=env_clear)
            time.sleep(3)
            
            try:
                page = browser.new_page()
                from auth.jwt_handler import create_access_token
                token = create_access_token({"sub": "1", "role": "admin"})
                
                page.goto("http://localhost:3000/decisions/9999")
                time.sleep(2)
                page.evaluate(f"""() => {{
                    localStorage.setItem("apex_access_token", "{token}");
                    localStorage.setItem("apex_user_role", "admin");
                }}""")
                page.reload()
                time.sleep(2)
                
                page.locator("button", has_text="Reasoning").click()
                time.sleep(1)
                page.locator("button", has_text="Adaptive Escalation").click()
                print("Waiting for evaluation to complete (CLEAR)...")
                
                page.wait_for_selector("text=CLEAR", timeout=30000)
                assert page.locator("text=CLEAR").is_visible()
                assert not page.locator("text=BLOCKED PENDING REVIEW").is_visible()
                print("Scenario A: CLEAR Evaluation Successful.")
                
                page.reload()
                time.sleep(3)
                page.locator("button", has_text="Reasoning").click()
                time.sleep(2)
                assert page.locator("text=CLEAR").is_visible()
                print("Scenario A: Persistence Successful.")
            except Exception as e:
                page.screenshot(path="playwright-error-clear.png", full_page=True)
                raise e
            finally:
                page.close()
                backend_clear.terminate()
                backend_clear.wait(timeout=5)
            
            # SCENARIO B: BLOCKED
            print("\\n=== SCENARIO B: BLOCKED PENDING REVIEW ===")
            seed_db()
            env_blocked = os.environ.copy()
            env_blocked["DATABASE_URL"] = "sqlite:///./test_apex_capital.db"
            env_blocked["MOCK_LLM_PROVIDER"] = "1"
            env_blocked["MOCK_SCENARIO"] = "BLOCKED"
            backend_blocked = subprocess.Popen(["venv/bin/uvicorn", "main:app", "--port", "8000"], env=env_blocked)
            time.sleep(3)
            
            try:
                page = browser.new_page()
                page.goto("http://localhost:3000/decisions/9999")
                time.sleep(2)
                page.evaluate(f"""() => {{
                    localStorage.setItem("apex_access_token", "{token}");
                    localStorage.setItem("apex_user_role", "admin");
                }}""")
                page.reload()
                time.sleep(2)
                
                page.locator("button", has_text="Reasoning").click()
                time.sleep(1)
                page.locator("button", has_text="Adaptive Escalation").click()
                print("Waiting for evaluation to complete (BLOCKED)...")
                
                page.wait_for_selector("text=BLOCKED PENDING REVIEW", timeout=30000)
                assert page.locator("text=BLOCKED PENDING REVIEW").is_visible()
                print("Scenario B: BLOCKED Evaluation Successful.")
                
                page.reload()
                time.sleep(3)
                page.locator("button", has_text="Reasoning").click()
                time.sleep(2)
                assert page.locator("text=BLOCKED PENDING REVIEW").is_visible()
                print("Scenario B: Persistence Successful.")
            except Exception as e:
                page.screenshot(path="playwright-error-blocked.png", full_page=True)
                raise e
            finally:
                page.close()
                backend_blocked.terminate()
                backend_blocked.wait(timeout=5)
                
            browser.close()
            print("\\nBrowser Product Validation Successful for ALL Scenarios!")
            
    finally:
        print("Cleaning up frontend process...")
        frontend_proc.terminate()
        try:
            frontend_proc.wait(timeout=5)
        except subprocess.TimeoutExpired:
            frontend_proc.kill()

if __name__ == "__main__":
    run_tests()

