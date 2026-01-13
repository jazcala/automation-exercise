import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test', () => {

  test('should match the baseline snapshot', async ({ homePage }) => {

    await homePage.navigate();
    await expect(homePage.singupLoginLink).toBeVisible();

  });

});
