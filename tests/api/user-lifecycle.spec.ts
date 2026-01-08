import { test, expect } from '@playwright/test';
import { UserApi } from '../../src/api/user.api';

test.describe('User Account API Lifecycle', () => {
  let userApi: UserApi;

  test.beforeEach(({ request }) => {
    userApi = new UserApi(request);
  });

  test('should create and delete a user account via API', async () => {
    const timestamp = Date.now();
    const testUser = {
      name: 'Tester',
      email: `testuser_${timestamp}@example.com`,
      password: 'password123',
      firstname: 'Test',
      lastname: 'User',
      address1: '123 Test St',
      country: 'Testland',
      state: 'Test State',
      city: 'Test City',
      mobile_number: '123456789',
      zipcode: '12345'
    };
    // 1. Create Account
    const createResponse = await userApi.createAccount(testUser);
    expect(createResponse.status()).toBe(200);

    const createData = await createResponse.json();
    expect(createData.message).toBe('User created!');

    // 2. Delete Account (Cleanup)
    const deleteResponse = await userApi.deleteAccount({
      email: testUser.email,
      password: testUser.password
    });
    expect(deleteResponse.status()).toBe(200);

    const deleteData = await deleteResponse.json();
    expect(deleteData.message).toBe('Account deleted!');
  });
});
