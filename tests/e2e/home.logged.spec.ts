import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - logged in user', () => {

  test('verify logut link is visible', async ({ homePage }) => {

    await expect(homePage.logoutLink).toBeVisible();

  });

  test.describe('Added Modal', () => {
    /**
     * This modal is displayed after a product is added to the cart
     */

    test('verify Added modal elements', async ({ homePage }) => {

      await homePage.addFirstProductToCart();
      await expect(homePage.addedModal).toBeVisible();
      await expect(homePage.addedModalViewCartLink).toBeVisible();
      await expect(homePage.addedModalTitle).toBeVisible();
      await expect(homePage.addedModalText).toBeVisible();
      await expect(homePage.addedModalContinueShoppingButton).toBeVisible();

    });

    test('verify Added modal view cart navigation', async ({ homePage }) => {

      await homePage.addFirstProductToCart();
      await expect(homePage.addedModal).toBeVisible();
      await expect(homePage.addedModalViewCartLink).toBeVisible();
      const cartPage = await homePage.viewCart();
      await expect(cartPage.page).toHaveURL('view_cart');
    });

    test('verify Added modal - continue shopping', async ({ homePage }) => {

      await homePage.addFirstProductToCart();
      await expect(homePage.addedModal).toBeVisible();
      await expect(homePage.addedModalContinueShoppingButton).toBeVisible();
      await homePage.continueShopping();
      await expect(homePage.addedModal).toBeHidden();

    });

  });

});
