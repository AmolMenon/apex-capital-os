import subprocess
import os

def test_quota_missing():
    # Calling the pilot runner without setting AVAILABLE_QUOTA
    env = os.environ.copy()
    if "AVAILABLE_QUOTA" in env: del env["AVAILABLE_QUOTA"]
    result = subprocess.run(["venv/bin/python", "evaluation/run_frozen_pilot.py", "--case", "VC_01", "--experiment-batch", "test"], env=env, capture_output=True, text=True)
    assert "QUOTA_STATUS_UNKNOWN" in result.stdout
    assert "PILOT_EXECUTION_BLOCKED_INSUFFICIENT_QUOTA" in result.stdout

def test_quota_insufficient():
    env = os.environ.copy()
    env["AVAILABLE_QUOTA"] = "5" # Need 19
    result = subprocess.run(["venv/bin/python", "evaluation/run_frozen_pilot.py", "--case", "VC_01", "--experiment-batch", "test"], env=env, capture_output=True, text=True)
    assert "PILOT_EXECUTION_BLOCKED_INSUFFICIENT_QUOTA" in result.stdout

def test_quota_sufficient():
    env = os.environ.copy()
    env["AVAILABLE_QUOTA"] = "20" # Need 19
    result = subprocess.run(["venv/bin/python", "evaluation/run_frozen_pilot.py", "--case", "VC_01", "--experiment-batch", "test", "--preflight-only"], env=env, capture_output=True, text=True)
    assert "QUOTA_PREFLIGHT_PASS" in result.stdout
