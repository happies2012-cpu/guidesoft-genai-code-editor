import { test, expect } from '@playwright/test';

test.describe('GuideSoft AI Editor E2E Tests', () => {

    test('should load marketing page and navigate to login', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Check hero section loads
        await expect(page.locator('text=Code at the Speed of Thought')).toBeVisible();

        // Click "Start Coding Free" button
        await page.click('text=Start Coding Free');

        // Should redirect to login
        await expect(page.locator('text=Welcome Back')).toBeVisible();
    });

    test('should complete login flow and reach dashboard', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Navigate to login
        await page.click('text=Start Coding Free');

        // Fill login form
        await page.fill('input[type="email"]', 'pranu21m@gmail.com');
        await page.fill('input[type="password"]', 'testpassword123');

        // Submit
        await page.click('button[type="submit"]');

        // Should reach dashboard
        await page.waitForTimeout(2000);
        await expect(page.locator('text=Welcome back, Developer')).toBeVisible();
    });

    test('should navigate from dashboard to editor', async ({ page }) => {
        // Login first
        await page.goto('http://localhost:3000');
        await page.click('text=Start Coding Free');
        await page.fill('input[type="email"]', 'test@example.com');
        await page.fill('input[type="password"]', 'password');
        await page.click('button[type="submit"]');

        await page.waitForTimeout(2000);

        // Click "Open Editor" on a project
        await page.click('text=Open Editor');

        // Should see editor
        await expect(page.locator('text=GUIDESOFT GENAI')).toBeVisible();
    });

    test('should display pricing page correctly', async ({ page }) => {
        await page.goto('http://localhost:3000');

        // Navigate to pricing
        await page.click('text=Pricing');

        // Check pricing tiers are visible
        await expect(page.locator('text=Pay with UPI / GPay')).toBeVisible();
    });

    test('should open AI chat and send message', async ({ page }) => {
        // This test assumes we're in the editor view
        await page.goto('http://localhost:3000');

        // Skip to editor (you may need to adjust based on your routing)
        await page.evaluate(() => {
            localStorage.setItem('skipLogin', 'true');
        });

        await page.reload();

        // Toggle AI chat with keyboard shortcut
        await page.keyboard.press('Meta+Shift+A');

        await page.waitForTimeout(500);

        // Type a message
        const chatInput = page.locator('textarea').first();
        await chatInput.fill('Generate a React component');
        await chatInput.press('Enter');

        // Should see AI response loading
        await expect(page.locator('text=Generating')).toBeVisible({ timeout: 5000 });
    });
});
