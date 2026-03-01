import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - guest user', () => {

  test('should have signup/login option to start the authentication flow', async ({ pom }) => {

    await pom.homePage.navigate();
    await expect.soft(pom.homePage.signupLoginLink).toBeVisible();
    await expect.soft(pom.homePage.signupLoginLink).toBeEnabled();
    await expect.soft(pom.homePage.signupLoginLink).toHaveAttribute('href', '/login');

  });

  test('example: temporarily flaky test - run with npm run test:flaky @flaky', async ({ pom }) => {
    test.skip(true, 'Example: tag with @flaky and run test:flaky to isolate');
    await pom.homePage.navigate();
    await expect(pom.homePage.signupLoginLink).toBeVisible();
  });

});
