import { generateUserData } from '../../src/utils/user-factory';
import { User } from '../../src/interfaces/interfaces';
import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('User Account API Lifecycle @api', () => {

  for (const title of ['Mr.', 'Mrs.'] as const) {
    test(`POST - create user with title "${title}" @smoke`, async ({ userApi }) => {
      const testUser: User = await generateUserData();
      const userWithTitle = { ...testUser, title };
      const response = await userApi.createAccount(userWithTitle);
      expect(response.status()).toBe(200);
      const body = await response.json();
      expect(body.responseCode).toBe(201);
      expect(body.message).toBe('User created!');
      const responseDelete = await userApi.deleteAccount({ email: testUser.email, password: testUser.password });
      const bodyDelete = await responseDelete.json();
      expect(bodyDelete.message).toBe('Account deleted!');
    });
  }

  test('POST - create user with required fields @smoke', async ({ userApi }) => {
    // *  Test 1: Create User (POST) -> Verify success.÷
    const testUser: User = await generateUserData();
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

  test('POST - create user with all fields', async ({ userApi }) => {

    const testUser: User = await generateUserData(true);
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

  test('GET - Get account details by email and validate - full user', async ({ preCreatedFullUser, userApi }) => {
    // *  Test 2: Get User Details(GET) -> Verify data matches Faker info.
    const response = await userApi.getAccountDetailsByEmail(preCreatedFullUser.email);
    const body = await response.json();
    expect(body.responseCode).toBe(200);
    expect(body.user).toMatchObject({
      name: preCreatedFullUser.name,
      email: preCreatedFullUser.email,
      title: preCreatedFullUser.title,
      birth_day: preCreatedFullUser.birth_day,
      birth_month: preCreatedFullUser.birth_month,
      birth_year: preCreatedFullUser.birth_year,
      first_name: preCreatedFullUser.first_name,
      last_name: preCreatedFullUser.last_name,
      company: preCreatedFullUser.company,
      address1: preCreatedFullUser.address1,
      address2: preCreatedFullUser.address2,
      city: preCreatedFullUser.city,
      state: preCreatedFullUser.state,
      zipcode: preCreatedFullUser.zipcode,
      country: preCreatedFullUser.country
    });

  });

  test('BUG-xxx: Verify mobile_number is returned in GET response @bug', async ({ preCreatedFullUser, userApi }) => {
    test.info().annotations.push({
      type: 'issue',
      description: 'https://jira.com/browse/BUG-xxx: API missing mobile_number in GET'
    });

    // This test is EXPECTED to fail until the backend is fixed
    test.fail(true, 'Waiting for backend fix for mobile_number field');

    const response = await userApi.getAccountDetailsByEmail(preCreatedFullUser.email);
    const body = await response.json();

    expect(body.user.mobile_number).toBe(preCreatedFullUser.mobile_number);

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
    const testUser: User = await generateUserData();
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

  test('GET - Get user with non-existent email returns 404', async ({ userApi }) => {
    const response = await userApi.getAccountDetailsByEmail('nonexistent@example.com');
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(404);
    expect(body.message).toBe('Account not found with this email, try another email!');
  });

  test('GET - Get user without email parameter returns 400', async ({ userApi }) => {
    const response = await userApi.getAccountDetailsWithoutEmail();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email parameter is missing in GET request.');
  });

  test('POST - Create account with missing emailrequired fields returns 400', async ({ userApi }) => {
    const partialUser = await generateUserData();
    const formWithoutEmail = {
      name: partialUser.name,
      password: partialUser.password,
      firstname: partialUser.first_name,
      lastname: partialUser.last_name,
      address1: partialUser.address1,
      country: partialUser.country,
      zipcode: partialUser.zipcode,
      state: partialUser.state,
      city: partialUser.city,
      mobile_number: partialUser.mobile_number
    };
    const response = await userApi.createAccountWithFormData(formWithoutEmail);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.responseCode).toBe(400);
    expect(body.message).toBe('Bad request, email parameter is missing in POST request.');
  });

  test('POST - Create account with duplicate email returns 400', async ({ userApi }) => {
    const testUser: User = await generateUserData();
    const create1 = await userApi.createAccount(testUser);
    expect(create1.status()).toBe(200);
    const body1 = await create1.json();
    expect(body1.responseCode).toBe(201);

    const create2 = await userApi.createAccount(testUser);
    expect(create2.status()).toBe(200);
    const body2 = await create2.json();
    expect(body2.responseCode).toBe(400);
    expect(body2.message).toBe('Email already exists!');
    await userApi.deleteAccount({ email: testUser.email, password: testUser.password });
  });

  test('DELETE - Delete account with wrong password returns error', async ({ preCreatedUser, userApi }) => {
    const response = await userApi.deleteAccount({
      email: preCreatedUser.email,
      password: 'wrongpassword123'
    });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(404);
    expect.soft(body.message).toBe('Account not found!');
  });

});
