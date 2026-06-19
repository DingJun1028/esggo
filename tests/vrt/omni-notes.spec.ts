import { test, expect } from '@playwright/test';

test.describe('OmniNotes Workspace (5T Protocol)', () => {
  test('should render OmniNotes workspace and verify basic visual layout', async ({ page }) => {
    // Navigate to OmniNotes test route
    // Note: the middleware bypasses auth for /test-* routes. We can use /test-omni-notes if needed, 
    // but the normal page is /omni-notes
    await page.goto('/omni-notes', { waitUntil: 'networkidle' });
    
    // Expect the page to have the Editor and Task Board
    await expect(page.locator('text=萬能筆記')).toBeVisible();
    await expect(page.locator('text=任務看板')).toBeVisible();

    // Verify visual snapshot
    await expect(page).toHaveScreenshot('omni-notes-workspace-initial.png', {
      fullPage: true,
      maxDiffPixelRatio: 0.1,
    });
  });

  test('should extract tasks from markdown and sync to OmniTable', async ({ page }) => {
    await page.goto('/omni-notes');
    
    // Fill the markdown editor with a checklist
    const textarea = page.locator('textarea[placeholder*="Markdown"]');
    await textarea.fill('# E2E Test Note\n\n- [ ] E2E Trackable Task 1\n- [x] E2E Done Task 2\n');
    
    // Click Extract Tasks
    const extractBtn = page.locator('button:has-text("提取任務")');
    await extractBtn.click();
    
    // Verify tasks appear in the task board
    await expect(page.locator('text=E2E Trackable Task 1')).toBeVisible();
    await expect(page.locator('text=E2E Done Task 2')).toBeVisible();
    
    // Verify sync terminal logs extraction
    await expect(page.locator('text=EXTRACTED 2 TASKS FROM MARKDOWN')).toBeVisible();

    // Click Sync
    const syncBtn = page.locator('button:has-text("SYNC")');
    await syncBtn.click();
    
    // Verify sync terminal logs success and 5T Hash Lock
    await expect(page.locator('text=SYNC COMPLETED')).toBeVisible();
    await expect(page.locator('text=HASH LOCK VERIFIED (5T PROTOCOL)')).toBeVisible();
  });
});
