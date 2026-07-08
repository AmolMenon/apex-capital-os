import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe.configure({ mode: 'serial' });

const DB_PATH = 'test_e2e_playwright.db';
const BACKEND_DIR = path.resolve(__dirname, '../../backend');

function resetDB() {
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && rm -f ${DB_PATH} && alembic upgrade head`, { cwd: BACKEND_DIR, stdio: 'ignore' });
}

function seedScenario() {
    resetDB();
    const scriptName = 'seed_nexus_canonical.py';
    
    // Seed DB
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && python scripts/experiments/${scriptName}`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    // Restart Backend API
    execSync(`pkill -f uvicorn || true`, { stdio: 'ignore' });
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && export APEX_LLM_MODE=test && export MOCK_LLM_PROVIDER=1 && uvicorn main:app --host 0.0.0.0 --port 8000 > backend_canonical.log 2>&1 &`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    // Wait 3 seconds for boot
    execSync(`sleep 3`);
}

test.describe('Phase 4 Nexus Demo Repeatability', () => {
  const DEAL_ID = 9999;
  test.use({ baseURL: 'http://localhost:3000' });

  test('Canonical Workflow: BLOCKED_PENDING_REVIEW -> OVERRIDE -> FINALIZED', async ({ page, request }) => {
    test.setTimeout(60000);
    seedScenario();

    // 1. Open Canonical workspace
    await page.goto(`/decisions/${DEAL_ID}`);
    await expect(page.locator('h1', { hasText: 'Nexus Data Systems' })).toBeVisible();

    // 2. Trigger Evaluation
    const analysisTab = page.locator('button', { hasText: 'Investment Analysis' }).first();
    await analysisTab.click();
    
    const runBtn = page.locator('button', { hasText: 'Synthesize Investment Case' }).first();
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    
    await expect(page.locator('text=Investment Memorandum')).toBeVisible({ timeout: 15000 });

    // 3. Envelope Renders BLOCKED
    const decisionTab = page.locator('button', { hasText: /^Decision$/ }).first();
    await decisionTab.click();
    await expect(page.locator('text=Decision Blocker Status')).toBeVisible();
    
    // 4. Render blocked messaging
    await expect(page.locator('text=Blocked Pending Review')).toBeVisible();
    
    const rationaleInput = page.locator('textarea');
    await expect(rationaleInput).toBeVisible();
    
    const approveBtn = page.locator('button', { hasText: 'Approve' });
    await approveBtn.click();
    
    // The Sign button is disabled when rationale is empty and it's an override
    const recordBtn = page.locator('button', { hasText: 'Sign & Record Decision' });
    await expect(recordBtn).toBeDisabled();

    // Fill in rationale
    await rationaleInput.fill("This is a sufficiently long rationale text exceeding twenty characters.");
    
    // Still disabled because checkbox is not checked
    await expect(recordBtn).toBeDisabled();

    // Check the acknowledgment
    await page.locator('#override-ack').check();

    // Now it should be enabled
    await expect(recordBtn).toBeEnabled();

    // Sign and Record
    await recordBtn.click();
    await expect(page.locator('text=Decision Recorded')).toBeVisible({ timeout: 10000 });

    // 6. Hard refresh on decision workspace
    await page.reload();
    // Wait for data load
    await expect(page.locator('h1', { hasText: 'Nexus Data Systems' })).toBeVisible();
    await decisionTab.click();
    await expect(page.locator('text=Blocked Pending Review').first()).toBeVisible();

    // 7. Verify provenance trace interaction reaches the blocker (Targeted Reviews component)
    // We updated the UI terminology to finding "Targeted Reviews"
    const traceBtn = page.locator('button', { hasText: /Trace Finding/i }).first();
    if (await traceBtn.isVisible()) {
        await traceBtn.click();
        // Just verify the dialog opens
        await expect(page.locator('text=Source Trace')).toBeVisible();
    }

    // 8. Navigate to Institutional Memory and verify persistence
    await page.goto('/memory');
    await expect(page.locator('text=Institutional Memory')).toBeVisible();
    await expect(page.locator('text=Nexus Data Systems').first()).toBeVisible();
    await expect(page.locator('text=This is a sufficiently long rationale text exceeding twenty characters.').first()).toBeVisible();
    await expect(page.locator('text=Persisted synthesis securely archived')).toBeVisible();

    // 9. Query backend state
    const res = await request.get(`http://localhost:8000/api/v1/decisions/${DEAL_ID}/human_decision`);
    const decision = await res.json();
    
    expect(decision.human_final_decision).toBe('Approve');
  });
});
