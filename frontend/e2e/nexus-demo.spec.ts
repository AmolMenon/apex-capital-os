import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import path from 'path';

test.describe.configure({ mode: 'serial' });

const DB_PATH = 'test_e2e_playwright.db';
const BACKEND_DIR = path.resolve(__dirname, '../../backend');

function resetDB() {
    execSync(`source .venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && rm -f ${DB_PATH} && alembic upgrade head`, { cwd: BACKEND_DIR, stdio: 'ignore' });
}

function seedScenario(scenarioName: string) {
    resetDB();
    const scriptName = 'seed_nexus_canonical.py';
    
    execSync(`source .venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && export MOCK_SCENARIO="${scenarioName.toUpperCase()}" && python scripts/experiments/${scriptName} --scenario ${scenarioName}`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    execSync(`pkill -f uvicorn || true`, { stdio: 'ignore' });
    execSync(`source .venv/bin/activate && export DATABASE_URL="sqlite:///${DB_PATH}" && export APEX_LLM_MODE=test && export MOCK_LLM_PROVIDER=1 && export MOCK_SCENARIO="${scenarioName.toUpperCase()}" && uvicorn main:app --host 0.0.0.0 --port 8000 > backend_${scenarioName}.log 2>&1 &`, { cwd: BACKEND_DIR, stdio: 'ignore' });
    
    execSync(`sleep 3`);
}

test.describe('Phase 1C-C Canonical Journey', () => {
  const DEAL_ID = 9999;
  test.use({ baseURL: 'http://localhost:3000' });

  test('Scenario B: Blocked Pending Review Canonical Journey', async ({ page }) => {
    test.setTimeout(120000);
    seedScenario('blocked');
    await page.setViewportSize({ width: 1440, height: 900 });

    const screenshotsDir = '/Users/AmolMenon/.gemini/antigravity/brain/3ba9b9a1-79b1-4bfc-a515-272ee57ab145/screenshots';

    // 1. Open Canonical workspace Overview
    await page.goto(`/deals/${DEAL_ID}`);
    await expect(page.locator('h1', { hasText: 'Nexus Data Systems' })).toBeVisible({ timeout: 10000 });
    
    // Overview should show BLOCKED_PENDING_REVIEW integrity
    await page.waitForTimeout(2000); // Wait for data to load
    await page.screenshot({ path: `${screenshotsDir}/1-deal-overview.png`, fullPage: true });

    // 2. Navigate to Thesis
    await page.locator('a', { hasText: 'Thesis' }).click();
    await expect(page).toHaveURL(new RegExp(`/deals/${DEAL_ID}/thesis`));
    await page.waitForTimeout(1000); // wait for fade in
    await page.screenshot({ path: `${screenshotsDir}/2-thesis-page.png`, fullPage: true });
    
    // 3. Open Assumption Drawer
    await page.waitForTimeout(2000);
    // Click the first assumption row
    const firstRow = page.locator('.divide-y > div').first();
    await firstRow.waitFor({ state: 'visible', timeout: 5000 });
    await firstRow.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotsDir}/3-assumption-drawer.png`, fullPage: true });
    await page.keyboard.press('Escape');

    // 4. Navigate to Evidence Registry
    await page.locator('a', { hasText: 'Evidence' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${screenshotsDir}/4-evidence-registry.png`, fullPage: true });

    // 5. Navigate to Diligence
    await page.locator('a', { hasText: 'Diligence' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${screenshotsDir}/5-diligence-workspace.png`, fullPage: true });
    
    // Trigger Evaluation
    const runBtn = page.locator('button', { hasText: 'Run Diligence Analysis' });
    await runBtn.waitFor({ state: 'visible', timeout: 5000 });
    await runBtn.click();
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `${screenshotsDir}/6-diligence-evaluating.png`, fullPage: true });
    
    // Wait for it to finish (approx 5-10s, wait 15s to be safe)
    await page.waitForTimeout(15000);
    await page.screenshot({ path: `${screenshotsDir}/7-diligence-completed.png`, fullPage: true });

    // 6. Navigate to IC Workspace
    await page.locator('a', { hasText: 'IC Workspace' }).click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${screenshotsDir}/8-ic-workspace.png`, fullPage: true });
    
    // Attempting to approve requires rationale and checkbox
    const approveBtn = page.locator('button', { hasText: 'Approve' }).first();
    await approveBtn.waitFor({ state: 'visible', timeout: 5000 });
    await approveBtn.click();
    await page.waitForTimeout(500);
    
    await page.fill('textarea', 'Detailed justification over 20 chars goes here for override.');
    await page.check('#override-ack');
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${screenshotsDir}/9-ic-decision-form.png`, fullPage: true });
    
    const recordBtn = page.locator('button', { hasText: 'Record Decision' });
    await recordBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: `${screenshotsDir}/10-ic-decision-persisted.png`, fullPage: true });
    
    // Refresh the browser
    await page.reload();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: `${screenshotsDir}/11-ic-decision-refreshed.png`, fullPage: true });
  });
});
