import { apiTest } from './api.fixtures';
import { User } from '../interfaces/interfaces';
import { generateUserData } from '../utils/user-factory';

type MyObjects = {
  preCreatedUser: User;
  persistentUser: User;
  preCreatedFullUser: User;
  userData: User;
  userDataFull: User;
}

export const userTest = apiTest.extend<MyObjects>({
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

});
