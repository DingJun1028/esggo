import { test, expect } from '@playwright/test';

test.describe('InfoOne System Health Checks', () => {
    test('should load health endpoint successfully', async ({ page }) => {
        await page.goto('/api/health');

        const content = await page.content();
        expect(content).toContain('success');
        expect(content).toContain('Celestial Neural Core');
    });

    test('should access metrics endpoint', async ({ page }) => {
        await page.goto('/metrics');

        const content = await page.content();
        expect(content).toContain('infoone_');
    });
});

test.describe('CSRF Token Flow', () => {
    test('should fetch CSRF token', async ({ page }) => {
        const response = await page.goto('/api/csrf-token');
        expect(response?.status()).toBe(200);

        const json = await response?.json();
        expect(json).toHaveProperty('csrfToken');
        expect(json).toHaveProperty('expiresIn');
    });
});

test.describe('API Integration', () => {
    test('should handle ESG metrics endpoint', async ({ page }) => {
        const response = await page.goto('/api/esg/metrics');
        expect([200, 401, 403]).toContain(response?.status() || 0);
    });

    test('should access market intelligence routes', async ({ page }) => {
        const response = await page.goto('/api/market/news');
        expect([200, 401, 403, 429]).toContain(response?.status() || 0);
    });
});
