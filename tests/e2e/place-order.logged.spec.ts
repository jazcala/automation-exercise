import { test, expect } from '../../src/fixtures/base-fixture';
import { PaymentDonePage } from '../../src/pages/payment-done.page';

test.describe('Place order flow @e2e', () => {

  test('Success: place order as logged-in user', async ({ homePage }) => {
    await expect(homePage.logoutLink).toBeVisible();

    await homePage.addFirstProductToCart();
    const cartPage = await homePage.viewCartFromAddedModal();
    await expect(cartPage.proceedToCheckoutButton).toBeVisible();

    const checkoutPage = await cartPage.proceedToCheckout();
    await expect(checkoutPage.page).toHaveURL(/checkout/);
    await expect.soft(checkoutPage.checkoutBreadcrum).toBeVisible();

    const paymentPage = await checkoutPage.goToPayment();
    await expect(paymentPage.page).toHaveURL(/payment/);
    await paymentPage.fillCardAndConfirm('Test User', '4111...', '123', '12', '2028');
    await paymentPage.orderSuccessMessage.waitFor({ state: 'visible', timeout: 2000 }).catch(() => { });

    const paymentDonePage = new PaymentDonePage(paymentPage.page);
    await paymentPage.page.waitForURL(/payment_done/);

    await expect(paymentDonePage.orderPlacedHeading).toBeVisible();
    await expect(paymentDonePage.congratulationsMessage).toBeVisible();
  });
});
