import { test as base } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { LoginApi } from '../api/login.api';
import { generateUserData } from '../utils/user-factory';
import { UserPayload } from '../interfaces/user.payload';
import { LoginPage } from '../pages/login.page';
import { HomePage } from '../pages/home.page';

type MyObjects = {
  userApi: UserApi;
  loginApi: LoginApi;
  preCreatedUser: UserPayload;
  loginReadyPage: LoginPage;
  loginPage: LoginPage;
  homePage: HomePage;
}

export const test = base.extend<MyObjects>({

  userApi: async ({ request }, use) => {
    await use(new UserApi(request));
  },

  loginApi: async ({ request }, use) => {
    await use(new LoginApi(request));
  },

  preCreatedUser: async ({ userApi }, use) => {
    const userData = generateUserData();
    await userApi.createAccount(userData);
    // provide the user data to the test
    await use(userData);
    // --- TEARDOWN ---
    await userApi.deleteAccount({
      email: userData.email,
      password: userData.password
    });
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
  }

});

export { expect } from '@playwright/test';
