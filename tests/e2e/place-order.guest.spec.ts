import { test, expect } from '../../src/fixtures/base-fixture';
import { LoginPage } from '../../src/pages/login.page';
import { CartPage } from '../../src/pages/cart.page';
import { PaymentDonePage } from '../../src/pages/payment-done.page';

test.describe('Place order as guest user @e2e', () => {

  test('Success: register at checkout and complete order', async ({
    cartPageReady,
    userDataFull,
    userApi,
    page,
  }) => {
    const { cartPage } = cartPageReady;
    const user = userDataFull;

    await cartPage.proceedToCheckoutAsGuest();
    await expect(cartPage.checkoutModal).toBeVisible();
    await cartPage.checkoutModalSignupLoginLink.click();

    await expect(page).toHaveURL(/login/);
    const loginPage = new LoginPage(page);
    const signupPage = await loginPage.signup(user.name, user.email);

    await expect(signupPage.page).toHaveURL(/signup/);
    const accountCreatedPage = await signupPage.signup(user, true);

    await expect(accountCreatedPage.page).toHaveURL(/account_created/);
    const homePage = await accountCreatedPage.continue();

    await expect(homePage.loggedAsLink).toBeVisible();
    await expect(homePage.loggedAsLink).toHaveText(`Logged in as ${user.name}`);

    await homePage.cartLink.click();
    await expect(page).toHaveURL(/view_cart/);

    const cartPageLogged = new CartPage(page);
    const checkoutPage = await cartPageLogged.proceedToCheckout();

    await expect(checkoutPage.page).toHaveURL(/checkout/);
    await expect(checkoutPage.checkoutBreadcrum).toBeVisible();

    const paymentPage = await checkoutPage.goToPayment();
    await expect(paymentPage.page).toHaveURL(/payment/);
    await paymentPage.fillCardAndConfirm('Test User', '4111111111111111', '123', '12', '2028');

    await paymentPage.orderSuccessMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
    const paymentDonePage = new PaymentDonePage(paymentPage.page);
    await paymentPage.page.waitForURL(/payment_done/);

    await expect(paymentDonePage.orderPlacedHeading).toBeVisible();
    await expect(paymentDonePage.congratulationsMessage).toBeVisible();

    await userApi.deleteAccount({ email: user.email, password: user.password });
  });
});
