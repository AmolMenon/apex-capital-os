import { test, expect } from '@playwright/test';

test.describe('Nexus Data Systems - End-to-End Investor Journey', () => {
  const DEAL_ID = 1000;
  
  test('Canonical flow persists real backend state without mocks', async ({ page }) => {
    // 1. Pipeline Overview
    await page.goto('/');
    
    // Select Nexus Data Systems
    const nexusRow = page.locator(`tr:has-text("Nexus Data Systems")`);
    await expect(nexusRow).toBeVisible();
    await nexusRow.click();
    
    // Verify routing to canonical decision workspace
    await expect(page).toHaveURL(`/decisions/${DEAL_ID}`);
    
    // 2. Deal Overview
    const overviewTab = page.locator('button', { hasText: 'Overview' });
    await expect(overviewTab).toBeVisible();
    
    // 3. Evidence Room
    const evidenceTab = page.locator('button', { hasText: 'Evidence Room' });
    await evidenceTab.click();
    
    // Verify evidence is loaded from backend
    await expect(page.locator('text=Nexus Series A Pitch Deck.pdf')).toBeVisible();
    await expect(page.locator('text=Nexus Financials YTD.csv')).toBeVisible();
    
    // 4. Evidence Conflict & Targeted Review
    const conflictsTab = page.locator('button', { hasText: /Conflicts \(\d+\)/ });
    await conflictsTab.click();
    await expect(page.locator('text=Material Inconsistency Detected')).toBeVisible();
    
    // 5. Investment Analysis
    const analysisTab = page.locator('button', { hasText: 'Investment Analysis' });
    await analysisTab.click();
    
    // Run AI Diligence (fetches persisted/fresh evaluation)
    const runDiligenceBtn = page.locator('button', { hasText: 'Run AI Diligence' });
    await runDiligenceBtn.click();
    
    // Verify Recommendation and Confidence
    await expect(page.locator('text=Investment Thesis & Recommendation')).toBeVisible({ timeout: 15000 });
    
    // Verify Challenge Finding rendering from backend
    await expect(page.locator('text=Targeted Deep Dives')).toBeVisible();
    
    // 6. Decision Integration Envelope & Human IC Decision
    const decisionTab = page.locator('button', { hasText: 'IC Decision' });
    await decisionTab.click();
    
    // Verify Apex Recommendation block
    await expect(page.locator('text=Apex Recommendation')).toBeVisible();
    
    // Verify Integrity Envelope status is rendered
    await expect(page.locator('text=Decision Integrity Envelope')).toBeVisible();
    
    // 7. Human IC Decision Persistence
    const rationaleInput = page.locator('textarea[placeholder="Explain the reasoning behind this decision..."]');
    await rationaleInput.fill('The material inconsistency in deferred professional services has been clarified during founder calls. Proceeding with caution.');
    
    // Select Approve (forces override justification check if blocked)
    const approveBtn = page.locator('button', { hasText: 'Approve' });
    await approveBtn.click();
    
    // Sign & Record Decision
    const recordBtn = page.locator('button', { hasText: 'Sign & Record Decision' });
    await recordBtn.click();
    
    // 8. Institutional Memory
    await expect(page.locator('text=Decision Recorded')).toBeVisible({ timeout: 5000 });
    const memoryLink = page.locator('a', { hasText: 'View Memory Dashboard' });
    await memoryLink.click();
    
    // Verify routing and rendering of the newly persisted HumanDecisionRecord
    await expect(page).toHaveURL('/memory');
    await expect(page.locator('text=Recorded IC Decisions')).toBeVisible();
    await expect(page.locator('text=Nexus Data Systems').first()).toBeVisible();
  });
});
