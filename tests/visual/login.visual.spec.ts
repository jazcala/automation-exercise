import { test, expect } from '../../src/fixtures/base-fixture';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Login Page Visual Validation', () => {

  test('Login form layout snapshot @visual', async ({ loginPage, page }) => {
    await TestUtils.blockAds(page);
    await loginPage.navigate();
    await expect(loginPage.loginEmailField).toBeVisible();
    await TestUtils.prepareForScreenshot(page);
    await expect(page).toHaveScreenshot('login-page-baseline.png', {
      fullPage: true
    });
  });
});
