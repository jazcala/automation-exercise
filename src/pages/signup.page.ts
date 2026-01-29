import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { AccountCreatedPage } from './account-created.page';
import { User } from '../interfaces/interfaces';

export class SignupPage extends BasePage {

  protected readonly path: string = '/signup';
  readonly accountInfoTitle: Locator;
  readonly titleChoiceMrRadio: Locator;
  readonly titleChoiceMrsRadio: Locator;
  readonly signupNameField: Locator;
  readonly signupEmailField: Locator;
  readonly signupPasswordField: Locator;
  readonly signupDayOfBirthSelect: Locator;
  readonly signupMonthOfBirthSelect: Locator;
  readonly signupYearOfBirthSelect: Locator;
  readonly newsletterCheckbox: Locator;
  readonly offersCheckbox: Locator;

  readonly addressInfoTitle: Locator;
  readonly firstNameField: Locator;
  readonly lastNameField: Locator;
  readonly companyField: Locator;
  readonly address1Field: Locator;
  readonly address2Field: Locator;
  readonly countrySelect: Locator;
  readonly stateField: Locator;
  readonly cityField: Locator;
  readonly zipcodeField: Locator;
  readonly mobileNumberField: Locator;
  readonly createAccountButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountInfoTitle = page.getByText('Enter Account Information');
    this.titleChoiceMrRadio = page.getByLabel('Mr.');
    this.titleChoiceMrsRadio = page.getByLabel('Mrs.');
    this.signupNameField = page.getByRole('textbox', { name: /Name/ });
    this.signupEmailField = page.getByRole('textbox', { name: /Email/ });
    this.signupPasswordField = page.getByRole('textbox', { name: /Password/ });

    this.signupDayOfBirthSelect = page.locator('[data-qa="days"]');
    this.signupMonthOfBirthSelect = page.locator('[data-qa="months"]');
    this.signupYearOfBirthSelect = page.locator('[data-qa="years"]');
    this.newsletterCheckbox = page.getByLabel('Sign up for our newsletter!');
    this.offersCheckbox = page.getByLabel('Receive special offers from our partners!');

    this.addressInfoTitle = page.getByText('Address Information');
    this.firstNameField = page.getByRole('textbox', { name: /First name/ });
    this.lastNameField = page.getByRole('textbox', {
      name: /Last name/
    });
    this.companyField = page.locator('#company');
    this.address1Field = page.locator('#address1');
    this.address2Field = page.getByRole('textbox', { name: /Address 2/ });
    this.countrySelect = page.locator('#country');
    this.stateField = page.getByRole('textbox', { name: /State/ });
    this.cityField = page.getByRole('textbox', { name: /City/ });
    this.zipcodeField = page.locator('#zipcode');
    this.mobileNumberField = page.getByRole('textbox', { name: /Mobile Number/ });
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
  }

  async signup(user: User, isFull: boolean = false): Promise<AccountCreatedPage> {

    await this.signupNameField.fill(user.name);
    await this.signupPasswordField.fill(user.password);

    if (isFull) {
      // Fill additional fields for full signup
      if (user.title === 'Mr.') {
        await this.titleChoiceMrRadio.check();
      } else if (user.title === 'Mrs.') {
        await this.titleChoiceMrsRadio.check();
      }
      await this.signupDayOfBirthSelect.selectOption(user.birth_day || '');
      await this.signupMonthOfBirthSelect.selectOption(user.birth_month || '');
      await this.signupYearOfBirthSelect.selectOption(user.birth_year || '');

      if (user.newsletter) await this.newsletterCheckbox.check();
      if (user.offers) await this.offersCheckbox.check();

      await this.companyField.fill(user.company || '');
      await this.address2Field.fill(user.address2 || '');

    }

    await this.firstNameField.fill(user.first_name);
    await this.lastNameField.fill(user.last_name);
    await this.address1Field.fill(user.address1);
    await this.countrySelect.selectOption(user.country);
    await this.stateField.fill(user.state);
    await this.cityField.fill(user.city);
    await this.zipcodeField.fill(user.zipcode);
    await this.mobileNumberField.fill(user.mobile_number);

    await this.createAccountButton.click();

    return new AccountCreatedPage(this.page);
  }

  async getDaysOptions(): Promise<string[]> {

    return await this.signupDayOfBirthSelect.locator('option').evaluateAll(
      options => options.map(option => option.textContent?.trim() || '')
    );
  }

  async getMonthsOptions(): Promise<string[]> {

    return await this.signupMonthOfBirthSelect.locator('option').evaluateAll(
      options => options.map(option => option.textContent?.trim() || '')
    );
  }

  async getYearsOptions(): Promise<string[]> {

    return await this.signupYearOfBirthSelect.locator('option').evaluateAll(
      options => options.map(option => option.textContent?.trim() || '')
    );
  }

  async getCountryOptions(): Promise<string[]> {

    return await this.countrySelect.locator('option').evaluateAll(
      options => options.map(option => (option as HTMLOptionElement).value)
    );

  }

}
