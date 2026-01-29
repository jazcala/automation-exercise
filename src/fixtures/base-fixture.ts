import { test as base } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { LoginApi } from '../api/login.api';
import { generateUserData } from '../utils/user-factory';
import { User } from '../interfaces/interfaces';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';
import { ProductsApi } from '../api/products.api';
import { BrandsApi } from '../api/brands.api';
import { ProductPage } from '../pages/products.page';
import { SignupPage } from '../pages/signup.page';

type MyObjects = {
  userApi: UserApi;
  loginApi: LoginApi;
  productsApi: ProductsApi;
  brandsApi: BrandsApi;
  persistentUser: User;
  preCreatedUser: User;
  preCreatedFullUser: User;
  userData: User;
  userDataFull: User;
  loginReadyPage: LoginPage;
  loginPage: LoginPage;
  homePage: HomePage;
  productPage: ProductPage;
  productPageReady: ProductPage;
  signupReadyPage: {
    signupPage: SignupPage;
    user: User;
  };
}

export const test = base.extend<MyObjects>({

  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },

  loginApi: async ({ request }, use) => {
    await use(new LoginApi(request));
  },

  productsApi: async ({ request }, use) => {
    await use(new ProductsApi(request));
  },

  brandsApi: async ({ request }, use) => {
    await use(new BrandsApi(request));
  },
  persistentUser: async ({ userApi }, use) => {
    const userData: User = generateUserData();
    await userApi.createAccount(userData);
    await use(userData);
  },

  preCreatedUser: async ({ userApi }, use) => {
    const userData: User = generateUserData();
    await userApi.createAccount(userData);
    await use(userData);
    // --- TEARDOWN ---
    await userApi.deleteAccount({
      email: userData.email,
      password: userData.password
    });
  },
  preCreatedFullUser: async ({ userApi }, use) => {
    const userData: User = generateUserData(true);
    await userApi.createAccount(userData);
    await use(userData);
    // --- TEARDOWN ---
    await userApi.deleteAccount({
      email: userData.email,
      password: userData.password
    });
  },

  userData: async ({ }, use) => {
    const userData: User = generateUserData();
    await use(userData);
  },
  userDataFull: async ({ }, use) => {
    const userData: User = generateUserData(true);
    await use(userData);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  loginReadyPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await use(loginPage);
  },

  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  signupReadyPage: async ({ loginReadyPage, userApi, page }, use) => {
    const user = generateUserData(true);
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
