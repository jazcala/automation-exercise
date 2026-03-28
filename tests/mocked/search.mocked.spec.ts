import { test, expect } from '../../src/fixtures/mock.fixtures';

test.describe('Search with mocked API', () => {
  test.use({ mockApi: { search: 'empty' } });

  test.skip('Shows empty state when search returns no results', async ({ pom }) => {
    // automationexercise.com uses server-side search; browser never calls /api/searchProduct
    await pom.productPage.navigate();
    await expect(pom.productPage.allProductsHeading).toBeVisible();
    await pom.productPage.search('nonexistentproductxyz');
    const productCount = await pom.productPage.getProductCount();
    expect(productCount).toBe(0);
  });
});

test.describe('Search with mocked API + slow 3G', () => {

  test.use({ mockApi: { search: 'empty', delay: 1500 } });

  test.skip('Shows empty state with delay (simulates slow network)', async ({ pom }) => {
    await pom.productPage.navigate();
    await pom.productPage.search('nonexistentproductxyz');
    const productCount = await pom.productPage.getProductCount();
    expect(productCount).toBe(0);
  });
});
