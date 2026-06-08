import { test, expect } from '@playwright/test';

test.describe('Tokenizer App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Tokenizer/);
    await expect(page.locator('h1')).toContainText('GPT-Style Tokenizer');
  });

  test('should navigate to tokenize page', async ({ page }) => {
    await page.click('a:has-text("Tokenize")');
    await expect(page).toHaveURL('/tokenize');
    await expect(page.locator('h1')).toContainText('Tokenizer');
  });

  test('should tokenize text', async ({ page }) => {
    await page.goto('/tokenize');
    
    // Input text
    const textarea = page.locator('textarea').first();
    await textarea.fill('Hello world');
    
    // Click tokenize button
    const button = page.locator('button:has-text("Tokenize")');
    await button.click();
    
    // Wait for results
    await page.waitForTimeout(2000);
    
    // Check if results are displayed
    const results = page.locator('text=Tokens');
    await expect(results).toBeVisible();
  });

  test('should navigate to compare page', async ({ page }) => {
    await page.click('a:has-text("Compare")');
    await expect(page).toHaveURL('/compare');
  });

  test('should navigate to train page', async ({ page }) => {
    await page.click('a:has-text("Train")');
    await expect(page).toHaveURL('/train');
  });

  test('should navigate to chat page', async ({ page }) => {
    await page.click('a:has-text("Chat")');
    await expect(page).toHaveURL('/chat');
  });
});
