import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('Place order as guest user @e2e', () => {

  test('Success: register at checkout and complete order', async ({
    cartPageReady,
    userDataFull,
    userApi,
    page,
  }) => {
    const { pom } = cartPageReady;
    const user = userDataFull;

    await pom.cartPage.proceedToCheckoutAsGuest();
    await expect(pom.cartPage.checkoutModal).toBeVisible();
    await pom.cartPage.checkoutModalSignupLoginLink.click();

    await expect(page).toHaveURL(/login/);
    await pom.loginPage.signup(user.name, user.email);

    await expect(pom.signupPage.page).toHaveURL('/signup');
    await pom.signupPage.signup(user, true);

    await expect(pom.accountCreatedPage.page).toHaveURL('/account_created');
    await pom.accountCreatedPage.continue();

    await expect(pom.homePage.loggedAsLink).toBeVisible();
    await expect(pom.homePage.loggedAsLink).toHaveText(`Logged in as ${user.name}`);

    await pom.homePage.cartLink.click();
    await expect(page).toHaveURL(/view_cart/);

    await pom.cartPage.proceedToCheckout();

    await expect(pom.checkoutPage.page).toHaveURL(/checkout/);
    await expect(pom.checkoutPage.checkoutBreadcrum).toBeVisible();

    await pom.checkoutPage.goToPayment();
    await expect(pom.paymentPage.page).toHaveURL(/payment/);
    await pom.paymentPage.fillCardAndConfirm('Test User', '4111111111111111', '123', '12', '2028');

    await pom.paymentPage.orderSuccessMessage.waitFor({ state: 'visible', timeout: 5000 }).catch(() => { });
    await pom.paymentPage.page.waitForURL(/payment_done/);

    await expect(pom.paymentDonePage.orderPlacedHeading).toBeVisible();
    await expect(pom.paymentDonePage.congratulationsMessage).toBeVisible();

    await userApi.deleteAccount({ email: user.email, password: user.password });
  });
});
