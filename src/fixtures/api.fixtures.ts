import { test as base } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { LoginApi } from '../api/login.api';
import { ProductsApi } from '../api/products.api';
import { BrandsApi } from '../api/brands.api';

type MyObjects = {
  userApi: UserApi;
  loginApi: LoginApi;
  productsApi: ProductsApi;
  brandsApi: BrandsApi;
}

export const apiTest = base.extend<MyObjects>({

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
});
