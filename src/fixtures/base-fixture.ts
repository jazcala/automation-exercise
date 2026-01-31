import { userTest } from './user.fixtures';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/products.page';
import { SignupPage } from '../pages/signup.page';
import { CartPage } from '../pages/cart.page';
import { User } from '../interfaces/interfaces';

type MyObjects = {
  loginReadyPage: LoginPage;
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  signupReadyPage: {
    signupPage: SignupPage;
    user: User;
  };
  productPageReady: ProductPage;
  cartPageReadey: CartPage;
}

export const test = userTest.extend<MyObjects>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  loginReadyPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await use(homePage);
  },

  signupReadyPage: async ({ loginReadyPage, userApi, page, userDataFull }, use) => {
    const user = userDataFull;
    await loginReadyPage.signup(user.name, user.email);
    const signupPage = new SignupPage(page);

    await use({ signupPage, user });

    // --- TEARDOWN ---
    await userApi.deleteAccount({
      email: user.email,
      password: user.password
    });
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  productPageReady: async ({ page }, use) => {
    const productPage = new ProductPage(page);
    productPage.navigate();
    await use(productPage);
  },

});

export { expect } from '@playwright/test';
