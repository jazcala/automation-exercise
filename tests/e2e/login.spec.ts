import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('Login', () => {

  test('Validate Login Page Elements', async ({ loginReadyPage, page }) => {
    await expect.soft(page).toHaveURL('/login');
    await expect.soft(page).toHaveTitle('Automation Exercise - Signup / Login');
    await expect.soft(loginReadyPage.loginTitle).toBeVisible();
    await expect.soft(loginReadyPage.loginEmailField).toBeVisible();
    await expect.soft(loginReadyPage.loginEmailField).toHaveAttribute('placeholder', 'Email Address');
    await expect.soft(loginReadyPage.loginPasswordField).toBeVisible();
    await expect.soft(loginReadyPage.signupTitle).toBeVisible();
    await expect.soft(loginReadyPage.signupNameField).toBeVisible();
    await expect.soft(loginReadyPage.signupEmailField).toBeVisible();
    await expect.soft(loginReadyPage.signupEmailField).toHaveAttribute('placeholder', 'Email Address');

  });

  test('Login User with correct email and password', async ({
    loginReadyPage, preCreatedUser }) => {
    const { email, password, name } = preCreatedUser;
    const homePage = await loginReadyPage.login(email, password);
    await expect(homePage.loggedAsLink).toBeVisible();
    await expect(homePage.loggedAsLink).toHaveText(`Logged in as ${name}`);
  });

  test('Login user with incorrect email and password', async ({ loginReadyPage }) => {

    await loginReadyPage.login('some@mail.com', 'sefd');
    await expect(loginReadyPage.loginErrorMessage).toBeVisible();

  });

  test('Logout User', async ({ loginReadyPage, preCreatedUser }) => {

    const { email, password } = preCreatedUser;
    const homePage = await loginReadyPage.login(email, password);
    await expect(homePage.logoutLink).toBeVisible();
    await homePage.logout();
    await expect(homePage.logoutLink).toBeHidden();
    await expect(homePage.singupLoginLink).toBeVisible();

  });

  test.describe('form validation', () => {

    test('verify email empty validation message', async ({ loginReadyPage }) => {
      //Form Empty - ask to fill email
      await loginReadyPage.login();
      expect((await loginReadyPage.getLoginEmailValidationMessage()).toLowerCase()).toContain('fill out this field');

    });

    test('verify password empty', async ({ loginReadyPage }) => {

      //Form Empty - ask to fill email
      await loginReadyPage.login('some@email.com');

      expect((await loginReadyPage.getLoginPasswordValidationMessage()).toLowerCase()).toContain(`fill out this field`);

    });

    test('verify email missing @ validation message', async ({ loginReadyPage, browserName }) => {
      const messages = {
        chromium: `Please include an '@' in the email address. 'some' is missing an '@'.`,
        firefox: 'Please enter an email address',
        webkit: 'Enter an email address'
      };

      // wrong email mising @
      await loginReadyPage.login('some');
      expect((await loginReadyPage.getLoginEmailValidationMessage())).toContain(messages[browserName]);

    });

    test('verify email incomple format validation message', async ({ loginReadyPage, browserName }) => {

      const messages = {
        chromium: `Please enter a part following '@'. 'some@' is incomplete.`,
        firefox: 'Please enter an email address',
        webkit: 'Enter an email address'
      };

      // incomplete email
      await loginReadyPage.login('some@');
      expect((await loginReadyPage.getLoginEmailValidationMessage())).toContain(messages[browserName]);

    });
  });

});
