import { userTest } from './user.fixtures';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { ProductPage } from '../pages/products.page';
import { SignupPage } from '../pages/signup.page';
import { CartPage } from '../pages/cart.page';
import { User, Product } from '../interfaces/interfaces';
import { DataHelper } from '../utils/data-helper';

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
  cartPage: CartPage;
  cartPageReadey: {
    cartPage: CartPage,
    productDetails: Product
  };
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
    await productPage.navigate();
    await use(productPage);
  },
  cartPage: async ({ page }, use) => {
    const cartPage = new CartPage(page);
    await cartPage.navigate();
    await use(cartPage);
  },

  cartPageReadey: async ({ page }, use) => {
    const homePage = new HomePage(page);
    await homePage.navigate();
    await page.context().clearCookies();
    const productDetails = DataHelper.getExpectedProduct();
    const cartPage = await homePage.addProductAndViewCart(productDetails);
    await use({ cartPage, productDetails });
  }

});

export { expect } from '@playwright/test';
