import { test, expect } from '@playwright/test';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Homepage Visuals', () => {

  test.beforeEach(async ({ page }) => {

    await TestUtils.blockAds(page);

  });

  test('should match the baseline snapshot', async ({ page }) => {

    await page.goto('/');
    await expect(page.locator('footer')).toBeVisible();
    await TestUtils.prepareForScreenshot(page);
    await expect(page).toHaveScreenshot('homepage.png', {
      mask: [
        page.locator('#slider-carousel'),
        page.locator('#recommended-item-carousel')
      ], fullPage: true
    });

  });

});
