import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('Login API tests', () => {

  test('verify login with valid credential', async ({ loginApi, preCreatedUser }) => {
    const { email, password } = preCreatedUser;
    const response = await loginApi.verifyLogin({ email, password });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(200);
    expect.soft(body.message).toBe('User exists!');

  });

  test('login without email parameter', async ({ loginApi }) => {
    const response = await loginApi.verifyLogin({ password: 'password' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(400);
    expect.soft(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('login without password parameter', async ({ loginApi }) => {
    const response = await loginApi.verifyLogin({ email: 'some@email.com' });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(400);
    expect.soft(body.message).toBe('Bad request, email or password parameter is missing in POST request.');
  });

  test('verify login with invalid method - delete', async ({ loginApi }) => {
    const response = await loginApi.verifyLoginWithInvalidMethod();
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(405);
    expect.soft(body.message).toBe('This request method is not supported.');
  });

  test('login with invalid credential', async ({ preCreatedUser, loginApi }) => {
    const { email } = preCreatedUser;
    const password = 'password';
    const response = await loginApi.verifyLogin({ email, password });
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect.soft(body.responseCode).toBe(404);
    expect.soft(body.message).toBe('User not found!');
  });

});
