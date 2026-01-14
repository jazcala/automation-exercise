import { test, expect } from '../../src/fixtures/base-fixture';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Homepage Visuals', () => {

  test('should match the baseline snapshot @visual', async ({ homePage, page }) => {
    await TestUtils.blockAds(page);
    await homePage.navigate();
    await expect(homePage.footer).toBeVisible();
    await TestUtils.prepareForScreenshot(page);
    await expect(page).toHaveScreenshot('homepage.png', {
      mask: [
        homePage.mainCarouselSlider,
        homePage.recommendedItemCarousel
      ], fullPage: true
    });

  });

});
