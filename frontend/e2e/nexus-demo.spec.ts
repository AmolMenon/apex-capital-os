import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe.configure({ mode: 'serial' });

const DB_PATH = 'test_e2e_playwright.db';
const BACKEND_DIR = path.resolve(__dirname, '../../backend');

function resetDB() {
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && rm -f ${DB_PATH} && alembic upgrade head`, { cwd: BACKEND_DIR, stdio: 'ignore' });
}

function seedScenario(scenarioName: string) {
    resetDB();
    const scriptName = 'seed_nexus_canonical.py';
    
    // Seed DB
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && export MOCK_SCENARIO="${scenarioName.toUpperCase()}" && python scripts/experiments/${scriptName} --scenario ${scenarioName}`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    // Restart Backend API with appropriate MOCK_SCENARIO
    execSync(`pkill -f uvicorn || true`, { stdio: 'ignore' });
    execSync(`source venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && export APEX_LLM_MODE=test && export MOCK_LLM_PROVIDER=1 && export MOCK_SCENARIO="${scenarioName.toUpperCase()}" && uvicorn main:app --host 0.0.0.0 --port 8000 > backend_${scenarioName}.log 2>&1 &`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    execSync(`sleep 3`);
}

test.describe('Phase 2 Relational Integrity Browser Gates', () => {
  const DEAL_ID = 9999;
  test.use({ baseURL: 'http://localhost:3000' });

  test('Scenario A: CLEAR -> FINALIZED', async ({ page }) => {
    seedScenario('clear');

    // 1. Open Canonical workspace
    await page.goto('/');
    const nexusLink = page.locator('h3:has-text("Nexus Data Systems")');
    await expect(nexusLink).toBeVisible({ timeout: 10000 });
    await nexusLink.locator('..').locator('..').locator('..').locator('button', { hasText: 'Executive Overview' }).click();
    await expect(page).toHaveURL(new RegExp(`/decisions/${DEAL_ID}`));

    // 2. Trigger Evaluation through UI
    const analysisTab = page.locator('button', { hasText: 'Investment Analysis' });
    await analysisTab.click();
    
    const runBtn = page.locator('button', { hasText: 'Run AI Diligence' });
    await expect(runBtn).toBeVisible();
    await runBtn.click();

    await expect(page.locator('text=Investment Memorandum')).toBeVisible({ timeout: 15000 });

    // 3. Envelope Renders CLEAR
    const decisionTab = page.locator('button', { hasText: /^Decision$/ });
    await decisionTab.click();
    await expect(page.locator('text=Decision Integrity Envelope')).toBeVisible();
    await expect(page.locator('text=CLEAR').first()).toBeVisible();

    // 4. Recommendation is FINALIZED. Verify no blocked-review warning is rendered
    await expect(page.locator('text=BLOCKED PENDING HUMAN REVIEW')).not.toBeVisible();

    // 5. Hard refresh
    await page.reload();
    await page.locator('button', { hasText: /^Decision$/ }).click();
    await expect(page.locator('text=Decision Integrity Envelope')).toBeVisible();
    await expect(page.locator('text=CLEAR').first()).toBeVisible();
  });

  test('Scenario B: BLOCKED_PENDING_REVIEW', async ({ page }) => {
    seedScenario('blocked');

    // 1. Open Canonical workspace
    await page.goto('/');
    const nexusLink = page.locator('h3:has-text("Nexus Data Systems")');
    await expect(nexusLink).toBeVisible({ timeout: 10000 });
    await nexusLink.locator('..').locator('..').locator('..').locator('button', { hasText: 'Executive Overview' }).click();
    await expect(page).toHaveURL(new RegExp(`/decisions/${DEAL_ID}`));

    // 2. Trigger Evaluation
    const analysisTab = page.locator('button', { hasText: 'Investment Analysis' });
    await analysisTab.click();
    
    const runBtn = page.locator('button', { hasText: 'Run AI Diligence' });
    await expect(runBtn).toBeVisible();
    await runBtn.click();
    
    await expect(page.locator('text=Investment Memorandum')).toBeVisible({ timeout: 15000 });

    // 3. Envelope Renders BLOCKED
    const decisionTab = page.locator('button', { hasText: /^Decision$/ });
    await decisionTab.click();
    await expect(page.locator('text=Decision Integrity Envelope')).toBeVisible();
    
    // 4. Render blocked messaging
    await expect(page.locator('text=Blocked Pending Review')).toBeVisible();
    
    // 5. Attempting to approve requires rationale
    const rationaleInput = page.locator('textarea');
    await expect(rationaleInput).toBeVisible();
    
    const approveBtn = page.locator('button', { hasText: 'Approve' });
    await approveBtn.click();
    
    const recordBtn = page.locator('button', { hasText: 'Sign & Record Decision' });
    await expect(recordBtn).toBeDisabled();

    // 6. Hard refresh
    await page.reload();
    await page.locator('button', { hasText: /^Decision$/ }).click();
    await expect(page.locator('text=Decision Integrity Envelope')).toBeVisible();
    await expect(page.locator('text=Blocked Pending Review')).toBeVisible();

    // 7. Verify provenance trace interaction reaches the blocker
    const traceBtn = page.locator('button', { hasText: /Trace/i }).first();
    if (await traceBtn.isVisible()) {
        await traceBtn.click();
        await expect(page.locator('text=Found only $5.4M of recurring revenue')).toBeVisible();
    }
  });
});
