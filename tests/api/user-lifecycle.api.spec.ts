import { generateUserData } from '../../src/utils/user-factory';
import { UserPayload } from '../../src/interfaces/user.payload';
import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('User Account API Lifecycle', () => {

  test('POST - create user', async ({ userApi }) => {
    // *  Test 1: Create User (POST) -> Verify success.÷
    const testUser: UserPayload = generateUserData();
    const response = await userApi.createAccount(testUser);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(201);
    expect(body.message).toBe('User created!');
    // Cleanup
    const responseDelete = await userApi.deleteAccount({ email: testUser.email, password: testUser.password });
    const bodyDelete = await responseDelete.json();
    expect(bodyDelete.message).toBe('Account deleted!');

  });

  test('GET - Get account details by email and validate', async ({ preCreatedUser, userApi }) => {
    // *  Test 2: Get User Details(GET) -> Verify data matches Faker info.
    const response = await userApi.getAccountDetailsByEmail(preCreatedUser.email);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.user).toMatchObject({
      name: preCreatedUser.name,
      email: preCreatedUser.email,
      first_name: preCreatedUser.firstname,
      last_name: preCreatedUser.lastname,
      address1: preCreatedUser.address1,
      city: preCreatedUser.city,
      state: preCreatedUser.state,
      zipcode: preCreatedUser.zipcode,
      country: preCreatedUser.country
    });

  });

  test('PUT  Update User', async ({ preCreatedUser, userApi }) => {
    // *  Test 3: Update User(PUT) -> Change address and verify.
    //need to modyfy something onthe account
    const updatedData = { ...preCreatedUser, firstname: 'new Name' };
    const response = await userApi.updateAccount(updatedData);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.message).toBe('User updated!');

    // verify new name
    const responseGet = await userApi.getAccountDetailsByEmail(preCreatedUser.email);
    const bodyGet = await responseGet.json();

    expect(bodyGet.user).toMatchObject({
      email: preCreatedUser.email,
      first_name: updatedData.firstname
    });
  });

  test('DELETE - Delete user', async ({ userApi }) => {
    // *  Test 4: Delete User(DELETE) -> Verify account is gone.
    //1. Create Account
    const testUser: UserPayload = generateUserData();
    const responseCreate = await userApi.createAccount(testUser);
    expect(responseCreate.status()).toBe(200);

    // 2. Delete
    const deleteResponse = await userApi.deleteAccount({
      email: testUser.email,
      password: testUser.password
    });
    expect(deleteResponse.status()).toBe(200);

    const deleteDataBody = await deleteResponse.json();
    expect(deleteDataBody.responseCode).toBe(200);
    expect(deleteDataBody.message).toBe('Account deleted!');

    // 3. Get - validation
    const responseGet = await userApi.getAccountDetailsByEmail(testUser.email);
    const bodyGet = await responseGet.json();
    expect(bodyGet.responseCode).toBe(404);
    expect(bodyGet.message).toBe('Account not found with this email, try another email!');

  });

});
