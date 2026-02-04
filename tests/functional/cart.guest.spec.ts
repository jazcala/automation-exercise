import { test, expect } from '../../src/fixtures/base-fixture';
import { DataHelper } from '../../src/utils/data-helper';

test.describe('cart page tests - guest user', () => {

  test.describe('validate page elements', () => {

    test('verify emplty list state', async ({ cartPage }) => {

      await expect(cartPage.page).toHaveURL(/view_cart/);
      await expect.soft(cartPage.emptyCartMessage).toBeVisible();
      await expect.soft(cartPage.emptyCartMessage).toHaveText('Cart is empty! Click here to buy products.');
      await expect.soft(cartPage.emptyCartLink).toBeVisible();
      await expect.soft(cartPage.emptyCartLink).toHaveText('here');

    });

    test('verify table headers', async ({ cartPageReadey }) => {

      const { cartPage } = cartPageReadey;
      const expectedHeaders = DataHelper.getExpectedCartTableHeaders();

      expect(await cartPage.getTableHeaders()).toEqual(expectedHeaders);
    });

  });

  test('verify product details in cart table', async ({ cartPageReadey }) => {

    const { cartPage, productDetails } = cartPageReadey;
    const actualData = await cartPage.getProductDataFromRow(productDetails.name);

    expect.soft(actualData.description).toContain(productDetails.name);
    expect.soft(actualData.price).toContain(productDetails.price);
    expect.soft(actualData.quantity).toContain('1');
    expect.soft(actualData.total).toContain('Rs. 1500');
  });

  test('remove product from cart', async ({ cartPageReadey }) => {

    const { cartPage, productDetails } = cartPageReadey;

    await cartPage.removeItemFromCart(productDetails.name);
    await expect(cartPage.emptyCartMessage).toBeVisible();
    const productsPage = await cartPage.goToHomePageViaEmptyCartLink();

    await expect(productsPage.page).toHaveURL('/products');
  });

  test.describe('proceed to checkout modal - guest user', () => {

    test('verify modal elements', async ({ cartPageReadey }) => {

      const { cartPage } = cartPageReadey;
      await cartPage.proceedToCheckoutAsGuest();

      await expect(cartPage.checkoutModal).toBeVisible();
      await expect.soft(cartPage.checkoutModalTitle).toBeVisible();
      await expect.soft(cartPage.checkoutModalTitle).toHaveText('Checkout');
      await expect.soft(cartPage.checkoutModalText).toBeVisible();
      await expect.soft(cartPage.checkoutModalSignupLoginLink).toBeVisible();
      await expect.soft(cartPage.checkoutModalContinueOnCartButton).toBeVisible();

    });

    test('continue on cart from modal', async ({ cartPageReadey }) => {

      const { cartPage } = cartPageReadey;
      await cartPage.proceedToCheckoutAsGuest();
      await cartPage.checkoutModalContinueOnCartButton.click();
      await expect(cartPage.page).toHaveURL(/view_cart/);
      await expect(cartPage.checkoutModal).toBeHidden();

    });

    test('go to signup/login from modal', async ({ cartPageReadey }) => {

      const { cartPage } = cartPageReadey;
      await cartPage.proceedToCheckoutAsGuest();
      await cartPage.checkoutModalSignupLoginLink.click();
      await expect(cartPage.page).toHaveURL(/login/);

    });

  });

  test('go to home page and add another product - verify product list in cart - and total calculation', async ({ cartPageReadey

  }) => {
    const { cartPage, productDetails } = cartPageReadey;
    const homePage = await cartPage.navigaToHomeViaBreadcrum();

    await expect(homePage.page).toHaveURL('/');

    const newCartPage = await homePage.addProductAndViewCart(productDetails);
    const { quantity, total } = await newCartPage.getProductDataFromRow('Stylish Dress');

    expect.soft(Number(quantity)).toBe(2);
    const unitPrice = Number(productDetails.price.replace('Rs. ', ''));
    const expectedTotal = unitPrice * 2;
    expect.soft(Number(total.replace('Rs. ', ''))).toBe(expectedTotal);

  });

});
