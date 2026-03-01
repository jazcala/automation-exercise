import { test, expect } from '../../src/fixtures/base-fixture';
import { DataHelper } from '../../src/utils/data-helper';

test.describe('Signup from Login page', () => {

  test.describe('form field validation in', () => {

    test('Validate  Signup form Elements in Login page', async ({ pom }) => {
      await pom.loginPage.navigate();
      await expect.soft(pom.loginPage.page).toHaveURL('/login');
      await expect.soft(pom.loginPage.signupTitle).toBeVisible();
      await expect.soft(pom.loginPage.signupNameField).toBeVisible();
      await expect.soft(pom.loginPage.signupEmailField).toBeVisible();
      await expect.soft(pom.loginPage.signupEmailField).toHaveAttribute('placeholder', 'Email Address');
      await expect.soft(pom.loginPage.signupButton).toBeVisible();

    });

    test('verify name empty validation message', async ({ pom }) => {
      await pom.loginPage.navigate();
      await pom.loginPage.signup();
      expect(await pom.loginPage.getSignupNameValidationMessage()).toBe('Please fill out this field.');
    });

    test('verify email empty validation message', async ({ pom }) => {

      await pom.loginPage.navigate();
      await pom.loginPage.signup('some name');
      expect(await pom.loginPage.getSignupEmailValidationMessage()).toBe('Please fill out this field.');
    });

  });

  test('Signup user with existing email', async ({ pom, preCreatedUser }) => {
    const { name, email } = preCreatedUser;
    await pom.loginPage.navigate();
    await pom.loginPage.signup(name, email);
    await expect(pom.loginPage.page.getByText('Email Address already exist!')).toBeVisible();
  });

  test.describe('Navigate to Signup Page from Login Page', () => {

    test('add signup info in login page - form validation', async ({ userData, page, pom }) => {
      const user = userData;
      await pom.loginPage.navigate();
      await pom.loginPage.signup(user.name, user.email);
      await expect(page).toHaveURL('/signup');
      await expect.soft(pom.signupPage.accountInfoTitle).toBeVisible();
    });

    test.describe('Signup Page form validation', () => {

      test('verify form fields are preloaded from Login page', async ({ signupReadyPage }) => {
        const { signupPage, user } = signupReadyPage;
        await expect.soft(signupPage.titleChoiceMrsRadio).toBeVisible();
        await expect.soft(signupPage.signupNameField).toHaveValue(user.name);
        await expect.soft(signupPage.signupNameField).toBeEditable();
        await expect.soft(signupPage.signupEmailField).toHaveValue(user.email);
        await expect.soft(signupPage.signupEmailField).toBeDisabled();
      });

      test('Signup page form fields validation - default state', async ({ signupReadyPage }) => {

        const { signupPage } = signupReadyPage;
        await expect.soft(signupPage.page).toHaveURL('/signup');
        await expect.soft(signupPage.accountInfoTitle).toBeVisible();
        await expect.soft(signupPage.titleChoiceMrRadio).toBeVisible();
        await expect.soft(signupPage.titleChoiceMrRadio).not.toBeChecked();
        await expect.soft(signupPage.titleChoiceMrsRadio).toBeVisible();
        await expect.soft(signupPage.titleChoiceMrsRadio).not.toBeChecked();
        await expect.soft(signupPage.signupPasswordField).toBeEditable();

        await expect.soft(signupPage.signupDayOfBirthSelect.locator('option:checked')).toHaveText('Day');
        await expect.soft(signupPage.signupMonthOfBirthSelect.locator('option:checked')).toHaveText('Month');
        await expect.soft(signupPage.signupYearOfBirthSelect.locator('option:checked')).toHaveText('Year');

        await expect.soft(signupPage.newsletterCheckbox).toBeVisible();
        await expect.soft(signupPage.newsletterCheckbox).not.toBeChecked();
        await expect.soft(signupPage.offersCheckbox).toBeVisible();
        await expect.soft(signupPage.offersCheckbox).not.toBeChecked();

        await expect.soft(signupPage.addressInfoTitle).toBeVisible();
        await expect.soft(signupPage.firstNameField).toBeEditable();
        await expect.soft(signupPage.lastNameField).toBeEditable();
        await expect.soft(signupPage.companyField).toBeEditable();
        await expect.soft(signupPage.address1Field).toBeEditable();
        await expect.soft(signupPage.address2Field).toBeEditable();
        await expect.soft(signupPage.countrySelect).toBeEditable();
        await expect.soft(signupPage.stateField).toBeEditable();
        await expect.soft(signupPage.cityField).toBeEditable();
        await expect.soft(signupPage.zipcodeField).toBeEditable();
        await expect.soft(signupPage.mobileNumberField).toBeEditable();
        await expect.soft(signupPage.createAccountButton).toBeVisible();
        await expect.soft(signupPage.createAccountButton).toBeEnabled();

      });

      test('signup page form - validate Date of birth dropdown values', async ({ signupReadyPage }) => {

        const { signupPage } = signupReadyPage;

        await expect(signupPage.page).toHaveURL('/signup');
        await expect.soft(signupPage.signupDayOfBirthSelect).toBeVisible();

        const actualDays = await signupPage.getDaysOptions();
        expect.soft(actualDays).toEqual(DataHelper.getExpectedDays());
        await expect.soft(signupPage.signupMonthOfBirthSelect).toBeVisible();
        expect.soft(await signupPage.getMonthsOptions()).toEqual(DataHelper.getExpectedMonths());

        await expect.soft(signupPage.signupYearOfBirthSelect).toBeVisible();
        const actualYears = await signupPage.getYearsOptions();
        expect.soft(actualYears).toEqual(DataHelper.getExpectedYears());

      });

      test('signup page form - validate Country dropdown values', async ({ signupReadyPage }) => {
        const { signupPage } = signupReadyPage;

        await expect(signupPage.page).toHaveURL('/signup');
        await expect.soft(signupPage.countrySelect).toBeVisible();
        const actualCountries = await signupPage.getCountryOptions();
        expect.soft(actualCountries).toEqual(DataHelper.getExpectedCountries());

      });
    });
  });

  test('Signup User with required data', async ({ signupReadyPage, pom }) => {
    const { signupPage, user } = signupReadyPage;
    await expect(signupPage.page).toHaveURL('/signup');
    await signupPage.signup(user);
    await expect(pom.accountCreatedPage.page).toHaveURL('/account_created');
    await expect.soft(pom.accountCreatedPage.accountCreatedTitle).toBeVisible();
  });

  test('Full user lifecycle: Signup -> Account Created -> Home Page', async ({ signupReadyPage, pom }) => {
    const { signupPage, user } = signupReadyPage;
    await expect(signupPage.page).toHaveURL('/signup');
    await signupPage.signup(user, true);
    await expect(pom.accountCreatedPage.page).toHaveURL('/account_created');
    await expect.soft(pom.accountCreatedPage.accountCreatedTitle).toBeVisible();
    await expect.soft(pom.accountCreatedPage.accountCreatedMessage1).toBeVisible();
    await expect.soft(pom.accountCreatedPage.accountCreatedMessage2).toBeVisible();
    await expect.soft(pom.accountCreatedPage.continueButton).toBeVisible();
    await pom.accountCreatedPage.continue();
    await expect(pom.homePage.page).toHaveURL('/');
    await expect.soft(pom.homePage.loggedAsLink).toBeVisible();
    await expect.soft(pom.homePage.loggedAsLink).toHaveText(`Logged in as ${user.name}`);
  });

});
