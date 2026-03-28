import { test, expect } from '../../src/fixtures/mock.fixtures';

test.describe('Checkout with mocked API (500 error)', () => {
  test.use({ mockApi: { checkout: '500' } });

  test('Handles server error when payment submission fails', async ({ pom }) => {
    await pom.homePage.navigate();
    await expect(pom.homePage.logoutLink).toBeVisible();

    await pom.homePage.addFirstProductToCart();
    await pom.homePage.viewCartFromAddedModal();
    await expect(pom.cartPage.proceedToCheckoutButton).toBeVisible();
    await pom.cartPage.proceedToCheckout();
    await expect(pom.checkoutPage.page).toHaveURL(/checkout/, { timeout: 15000 });
    await pom.checkoutPage.goToPayment();
    await expect(pom.paymentPage.page).toHaveURL(/payment/);

    await pom.paymentPage.fillCardAndConfirm('Test User', '4111111111111111', '123', '12', '2028');

    // With 500 mock, order should not succeed - success message must not appear
    await expect(pom.paymentDonePage.orderPlacedHeading).toBeHidden({ timeout: 5000 });
  });
});

test.describe('Checkout with mocked API + slow 3G', () => {
  test.use({ mockApi: { checkout: '500', delay: 2000 } });

  test('Handles 500 with delay (simulates slow 3G)', async ({ pom }) => {
    await pom.homePage.navigate();

    await pom.homePage.addFirstProductToCart();
    await pom.homePage.viewCartFromAddedModal();
    await pom.cartPage.proceedToCheckout();
    await expect(pom.checkoutPage.page).toHaveURL(/checkout/, { timeout: 15000 });
    await pom.checkoutPage.goToPayment();

    await pom.paymentPage.fillCardAndConfirm('Test User', '4111111111111111', '123', '12', '2028');

    await expect(pom.paymentDonePage.orderPlacedHeading).toBeHidden({ timeout: 5000 });
  });
});
