import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('AI Smart Click Demo @ai-healing', () => {

  test('should heal using Fixture and HomePage', async ({ homePage, page }) => {

    await expect(homePage.singupLoginLink).toBeVisible();

    await homePage.clickContactUs('a[href="/broken-and-wrong"]');

    await expect(page).toHaveURL(/contact_us/);

  });
});
