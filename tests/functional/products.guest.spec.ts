import { test, expect } from '../../src/fixtures/base-fixture';
import { TestUtils } from '../../src/utils/test-utils';

test.describe('Products page - guest user', () => {

  test.beforeEach(async ({ page }) => {
    await TestUtils.blockAds(page);
  });

  test('verify all products page and product detail', async ({ pom }) => {

    await pom.productPage.navigate();
    await expect(pom.productPage.allProductsHeading).toBeVisible();

    const productCount = await pom.productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);

    await pom.productPage.clickViewProduct(0);
    await expect(pom.productDetailPage.page).toHaveURL(/product_details/);

    await expect.soft(pom.productDetailPage.productName).toBeVisible();
    await expect.soft(pom.productDetailPage.productCategory).toBeVisible();
    await expect.soft(pom.productDetailPage.productPrice).toBeVisible();
    await expect.soft(pom.productDetailPage.productAvailability).toBeVisible();
    await expect.soft(pom.productDetailPage.productCondition).toBeVisible();
    await expect.soft(pom.productDetailPage.productBrand).toBeVisible();
  });

  test('search product and verify results', async ({ pom }) => {
    await pom.productPage.navigate();
    await expect(pom.productPage.page).toHaveURL(/products/);

    await pom.productPage.search('top');
    await expect(pom.productPage.page).toHaveURL(/search_product|products/);

    const productCount = await pom.productPage.getProductCount();
    expect(productCount).toBeGreaterThan(0);
  });

  test('add multiple products to cart via hover', async ({ pom }) => {
    await pom.productPage.navigate();
    await expect(pom.productPage.page).toHaveURL(/products/);

    await pom.productPage.addProductToCartByIndex(0);
    await expect(pom.productPage.addedModal).toBeVisible();
    await pom.productPage.continueShoppingFromAddedModal();

    await pom.productPage.addProductToCartByIndex(1);
    await expect(pom.productPage.addedModal).toBeVisible();
    await pom.productPage.viewCartFromAddedModal();

    await expect(pom.cartPage.page).toHaveURL(/view_cart/);
    const itemCount = await pom.cartPage.getItemCount();
    expect(itemCount).toBeGreaterThanOrEqual(2);
  });

  test('add product with quantity from product detail', async ({ pom }) => {
    await pom.productPage.navigate();
    await expect(pom.productPage.page).toHaveURL(/products/);

    await pom.productPage.clickViewProduct(0);
    await expect(pom.productDetailPage.page).toHaveURL(/product_details/);

    await pom.productDetailPage.addToCartWithQuantity(4);
    try {
      await pom.productDetailPage.addedModal.waitFor({ state: 'visible', timeout: 3000 });
      await pom.productDetailPage.viewCartFromModal();
    } catch {
      await pom.productDetailPage.cartLink.click();
    }

    await expect(pom.cartPage.page).toHaveURL(/view_cart/);
    await expect(pom.cartPage.emptyCartMessage).toBeHidden();
    const firstRow = pom.cartPage.cartItems.first();
    const quantity = await firstRow.locator('.cart_quantity').innerText();
    expect(Number(quantity)).toBe(4);
  });
});
