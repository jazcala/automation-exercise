import { test, expect } from '../../src/fixtures/base-fixture';

test.describe('Login', () => {

  test('Validate Login Page Elements', async ({ pom, page }) => {
    await pom.loginPage.navigate();
    await expect.soft(page).toHaveURL('/login');
    await expect.soft(page).toHaveTitle('Automation Exercise - Signup / Login');
    await expect.soft(pom.loginPage.loginTitle).toBeVisible();
    await expect.soft(pom.loginPage.loginEmailField).toBeVisible();
    await expect.soft(pom.loginPage.loginEmailField).toHaveAttribute('placeholder', 'Email Address');
    await expect.soft(pom.loginPage.loginPasswordField).toBeVisible();
    await expect.soft(pom.loginPage.signupTitle).toBeVisible();
    await expect.soft(pom.loginPage.signupNameField).toBeVisible();
    await expect.soft(pom.loginPage.signupEmailField).toBeVisible();
    await expect.soft(pom.loginPage.signupEmailField).toHaveAttribute('placeholder', 'Email Address');

  });

  test('Login user with correct email and password @smoke', async ({
    preCreatedUser, pom }) => {
    await pom.loginPage.navigate();
    const { email, password, name } = preCreatedUser;
    await pom.loginPage.login(email, password);
    await expect(pom.homePage.loggedAsLink).toBeVisible();
    await expect(pom.homePage.loggedAsLink).toHaveText(`Logged in as ${name}`);
  });

  test('Login user with incorrect email and password', async ({ pom }) => {
    await pom.loginPage.navigate();
    await pom.loginPage.login('some@mail.com', 'sefd');
    await expect(pom.loginPage.loginErrorMessage).toBeVisible();

  });

  test('Logout User', async ({ preCreatedUser, pom }) => {
    const { email, password } = preCreatedUser;
    await pom.loginPage.navigate();
    await pom.loginPage.login(email, password);
    await expect(pom.homePage.logoutLink).toBeVisible();
    await pom.homePage.logout();
    await expect(pom.homePage.logoutLink).toBeHidden();
    await expect(pom.homePage.signupLoginLink).toBeVisible();
  });

  test.describe('form validation', () => {

    test('verify email empty validation message', async ({ pom }) => {
      //Form Empty - ask to fill email
      await pom.loginPage.navigate();
      await pom.loginPage.login();
      expect((await pom.loginPage.getLoginEmailValidationMessage()).toLowerCase()).toContain('fill out this field');

    });

    test('verify password empty', async ({ pom }) => {
      await pom.loginPage.navigate();
      //Form Empty - ask to fill email
      await pom.loginPage.login('some@email.com');

      expect((await pom.loginPage.getLoginPasswordValidationMessage()).toLowerCase()).toContain(`fill out this field`);

    });

    test('verify email missing @ validation message', async ({ pom, browserName }) => {
      const messages = {
        chromium: `Please include an '@' in the email address. 'some' is missing an '@'.`,
        firefox: 'Please enter an email address',
        webkit: 'Enter an email address'
      };

      await pom.loginPage.navigate();
      // wrong email mising @
      await pom.loginPage.login('some');
      expect((await pom.loginPage.getLoginEmailValidationMessage())).toContain(messages[browserName]);

    });

    test('verify email incomple format validation message', async ({ pom, browserName }) => {

      const messages = {
        chromium: `Please enter a part following '@'. 'some@' is incomplete.`,
        firefox: 'Please enter an email address',
        webkit: 'Enter an email address'
      };

      // incomplete email
      await pom.loginPage.navigate();
      await pom.loginPage.login('some@');
      expect((await pom.loginPage.getLoginEmailValidationMessage())).toContain(messages[browserName]);

    });
  });

});
