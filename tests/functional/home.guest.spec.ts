import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - guest user', () => {

  test('should have signup/login option to start the authentication flow', async ({ homePage }) => {

    await expect.soft(homePage.signupLoginLink).toBeVisible();
    await expect.soft(homePage.signupLoginLink).toBeEnabled();
    await expect.soft(homePage.signupLoginLink).toHaveAttribute('href', '/login');

  });

});
