import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('AI Smart Click Demo @ai-healing', () => {

  test('should heal using Fixture and HomePage', async ({ pom, page }, testInfo) => {
    await pom.homePage.navigate();
    await expect(pom.homePage.signupLoginLink).toBeVisible();

    await pom.homePage.clickContactUs('a[href="/broken-and-wrong"]', { testName: testInfo.title });

    await expect(page).toHaveURL(/contact_us/);

  });
});
