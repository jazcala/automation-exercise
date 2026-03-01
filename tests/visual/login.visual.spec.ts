import { test, expect } from '../../src/fixtures/base-fixture';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Login Page Visual Validation @visual', () => {

  test('Login form layout snapshot', async ({ pom, page }) => {
    await TestUtils.blockAds(page);
    await pom.loginPage.navigate();
    await expect(pom.loginPage.loginEmailField).toBeVisible();
    await TestUtils.prepareForScreenshot(page);
    await expect(page).toHaveScreenshot('login-page-baseline.png', {
      fullPage: true
    });
  });
});
