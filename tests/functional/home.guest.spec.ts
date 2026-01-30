import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - guest user', () => {

  test('verify sigup up / login link is visible', async ({ homePage }) => {

    await expect(homePage.singupLoginLink).toBeVisible();

  });

});
