import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - logged in user', () => {

  test('verify logut link is visible', async ({ homePage }) => {

    await homePage.navigate();
    await expect(homePage.logoutLink).toBeVisible();

  });

});
