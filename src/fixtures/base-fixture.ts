import { userTest } from './user.fixtures';
import { PomManager } from '../pages/pom-manager';
import { SignupPage } from '../pages/signup.page';
import { User, Product } from '../interfaces/interfaces';
import { DataHelper } from '../utils/data-helper';

type MyObjects = {
  pom: PomManager;
  signupReadyPage: {
    signupPage: SignupPage;
    user: User;
  };
  cartPageReady: {
    pom: PomManager;
    productDetails: Product;
  };
}

export const test = userTest.extend<MyObjects>({
  pom: async ({ page }, use) => {
    await use(new PomManager(page));
  },

  signupReadyPage: async ({ userApi, pom, userDataFull }, use) => {
    const user = userDataFull;
    await pom.loginPage.navigate();
    await pom.loginPage.signup(user.name, user.email);

    await use({ signupPage: pom.signupPage, user });

    // --- TEARDOWN ---
    await userApi.deleteAccount({
      email: user.email,
      password: user.password
    });
  },

  cartPageReady: async ({ page, pom }, use) => {
    await pom.homePage.navigate();
    await page.context().clearCookies();
    const productDetails = DataHelper.getExpectedProduct();
    await pom.homePage.addProductAndViewCart(productDetails);
    await use({ productDetails, pom });
  }
});

export { expect } from '@playwright/test';
