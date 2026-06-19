# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: omni-notes.spec.ts >> OmniNotes Workspace (5T Protocol) >> should extract tasks from markdown and sync to OmniTable
- Location: tests\vrt\omni-notes.spec.ts:21:3

# Error details

```
Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
Call log:
  - navigating to "/omni-notes", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('OmniNotes Workspace (5T Protocol)', () => {
  4  |   test('should render OmniNotes workspace and verify basic visual layout', async ({ page }) => {
  5  |     // Navigate to OmniNotes test route
  6  |     // Note: the middleware bypasses auth for /test-* routes. We can use /test-omni-notes if needed, 
  7  |     // but the normal page is /omni-notes
  8  |     await page.goto('/omni-notes', { waitUntil: 'networkidle' });
  9  |     
  10 |     // Expect the page to have the Editor and Task Board
  11 |     await expect(page.locator('text=萬能筆記')).toBeVisible();
  12 |     await expect(page.locator('text=任務看板')).toBeVisible();
  13 | 
  14 |     // Verify visual snapshot
  15 |     await expect(page).toHaveScreenshot('omni-notes-workspace-initial.png', {
  16 |       fullPage: true,
  17 |       maxDiffPixelRatio: 0.1,
  18 |     });
  19 |   });
  20 | 
  21 |   test('should extract tasks from markdown and sync to OmniTable', async ({ page }) => {
> 22 |     await page.goto('/omni-notes');
     |                ^ Error: page.goto: Protocol error (Page.navigate): Cannot navigate to invalid URL
  23 |     
  24 |     // Fill the markdown editor with a checklist
  25 |     const textarea = page.locator('textarea[placeholder*="Markdown"], textarea[placeholder*="Markdown"]');
  26 |     await textarea.fill('# E2E Test Note\n\n- [ ] E2E Trackable Task 1\n- [x] E2E Done Task 2\n');
  27 |     
  28 |     // Click Extract Tasks
  29 |     const extractBtn = page.locator('button:has-text("提取任務")');
  30 |     await extractBtn.click();
  31 |     
  32 |     // Verify tasks appear in the task board
  33 |     await expect(page.locator('text=E2E Trackable Task 1')).toBeVisible();
  34 |     await expect(page.locator('text=E2E Done Task 2')).toBeVisible();
  35 |     
  36 |     // Verify sync terminal logs extraction
  37 |     await expect(page.locator('text=EXTRACTED 2 TASKS FROM MARKDOWN')).toBeVisible();
  38 | 
  39 |     // Click Sync
  40 |     const syncBtn = page.locator('button:has-text("SYNC")');
  41 |     await syncBtn.click();
  42 |     
  43 |     // Verify sync terminal logs success and 5T Hash Lock
  44 |     await expect(page.locator('text=SYNC COMPLETED')).toBeVisible();
  45 |     await expect(page.locator('text=HASH LOCK VERIFIED (5T PROTOCOL)')).toBeVisible();
  46 |   });
  47 | });
  48 | 
```