import { test, expect } from '../../src/fixtures/base-fixture';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Homepage Visuals @visual', () => {

  test('should match the baseline snapshot', async ({ pom, page }) => {
    await TestUtils.blockAds(page);
    await pom.homePage.navigate();
    await expect(pom.homePage.footer).toBeVisible();
    await TestUtils.prepareForScreenshot(page);
    await expect(page).toHaveScreenshot('homepage.png', {
      mask: [
        pom.homePage.mainCarouselSlider,
        pom.homePage.recommendedItemCarousel
      ], fullPage: true
    });

  });

});
