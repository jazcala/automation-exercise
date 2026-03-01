import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('homepage test - logged in user', () => {

  test('verify logut link is visible @smoke', async ({ pom }) => {

    await pom.homePage.navigate();
    await expect(pom.homePage.logoutLink).toBeVisible();

  });

  test.describe('Added Modal', () => {
    /**
     * This modal is displayed after a product is added to the cart
     */

    test('verify Added modal elements', async ({ pom }) => {

      await pom.homePage.navigate();
      await pom.homePage.addFirstProductToCart();
      await expect(pom.homePage.addedModal).toBeVisible();
      await expect(pom.homePage.addedModalViewCartLink).toBeVisible();
      await expect(pom.homePage.addedModalTitle).toBeVisible();
      await expect(pom.homePage.addedModalText).toBeVisible();
      await expect(pom.homePage.addedModalContinueShoppingButton).toBeVisible();

    });

    test('verify Added modal view cart navigation', async ({ pom }) => {

      await pom.homePage.navigate();
      await pom.homePage.addFirstProductToCart();
      await expect(pom.homePage.addedModal).toBeVisible();
      await expect(pom.homePage.addedModalViewCartLink).toBeVisible();
      await pom.homePage.viewCartFromAddedModal();
      await expect(pom.cartPage.page).toHaveURL('view_cart');
    });

    test('verify Added modal - continue shopping', async ({ pom }) => {

      await pom.homePage.navigate();
      await pom.homePage.addFirstProductToCart();
      await expect(pom.homePage.addedModal).toBeVisible();
      await expect(pom.homePage.addedModalContinueShoppingButton).toBeVisible();
      await pom.homePage.continueShoppingFromAddedModal();
      await expect(pom.homePage.addedModal).toBeHidden();

    });

  });

});
