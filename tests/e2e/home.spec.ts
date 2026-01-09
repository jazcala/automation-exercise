import { test, expect } from '@playwright/test';

test.describe('Homepage Visuals', () => {

  test('should match the baseline snapshot', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('homepage.png', {
      mask: [page.locator('#slider-carousel')],
      fullPage: true,
      maxDiffPixels: 100,
      maxDiffPixelRatio: 0.1,
    });
  });

});
