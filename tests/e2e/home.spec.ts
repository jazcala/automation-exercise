import { test, expect } from '@playwright/test';

test.describe('Homepage Visuals', () => {

  test('should match the baseline snapshot', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveScreenshot('homepage.png', {
      mask: [page.locator('#slider-carousel')],
      fullPage: true,
      maxDiffPixels: 100,      // allow up to 100 pixels to be different
      maxDiffPixelRatio: 0.1,  // allow 10% difference
    });
  });

});
