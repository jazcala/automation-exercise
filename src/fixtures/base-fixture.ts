import { test as base } from '@playwright/test';
import { UserApi } from '../api/user.api';
import { generateUserData } from '../utils/user-factory';
import { UserPayload } from '../interfaces/user.payload';

type MyObjects = {
  userApi: UserApi;
  preCreatedUser: UserPayload;
}

export const test = base.extend<MyObjects>({

  userApi: async ({ request }, use) => { await use(new UserApi(request)); },
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
  }

});

export { expect } from '@playwright/test';
