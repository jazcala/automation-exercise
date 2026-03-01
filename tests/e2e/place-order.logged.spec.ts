import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('Place order flow @e2e', () => {

  test('Success: place order as logged-in user', async ({ pom }) => {
    await pom.homePage.navigate();
    await expect(pom.homePage.logoutLink).toBeVisible();

    await pom.homePage.addFirstProductToCart();
    await pom.homePage.viewCartFromAddedModal();
    await expect(pom.cartPage.proceedToCheckoutButton).toBeVisible();

    await pom.cartPage.proceedToCheckout();
    await expect(pom.checkoutPage.page).toHaveURL(/checkout/);
    await expect.soft(pom.checkoutPage.checkoutBreadcrum).toBeVisible();

    await pom.checkoutPage.goToPayment();
    await expect(pom.paymentPage.page).toHaveURL(/payment/);
    await pom.paymentPage.fillCardAndConfirm('Test User', '4111...', '123', '12', '2028');
    await pom.paymentPage.orderSuccessMessage.waitFor({ state: 'visible', timeout: 2000 }).catch(() => { });

    await pom.paymentPage.page.waitForURL(/payment_done/);

    await expect(pom.paymentDonePage.orderPlacedHeading).toBeVisible();
    await expect(pom.paymentDonePage.congratulationsMessage).toBeVisible();
  });
});
