import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { UserPayload } from '../interfaces/user.payload';
import { HomePage } from './home.page';

export class LoginPage extends BasePage {

  protected readonly path: string = '/login';
  // login elements
  readonly loginTitle: Locator;
  readonly loginEmailField: Locator;
  readonly loginPasswordField: Locator;
  readonly loginButton: Locator;
  readonly loginErrorMessage: Locator;
  // signup elements
  readonly signupTitle: Locator;
  readonly signupNameField: Locator;
  readonly signupEmailField: Locator;
  readonly signupButton: Locator;

  constructor(page: Page) {
    super(page);
    // login
    this.loginTitle = page.getByText('Login to your Account');
    this.loginEmailField = page.getByTestId('login-email');
    this.loginPasswordField = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
    this.loginErrorMessage = page.locator('form[action="/login"]').getByText('Your email or password is incorrect');
    // signup
    this.signupTitle = page.getByText('New User Signup!');
    this.signupNameField = page.getByPlaceholder('Name');
    this.signupEmailField = page.getByTestId('signup-email');
    this.signupButton = page.getByRole('button', { name: 'Signup' });

  }

  async login(email: UserPayload['email'] = '', password: UserPayload['password'] = ''): Promise<HomePage> {

    await this.loginEmailField.fill(email);
    await this.loginPasswordField.fill(password);
    await this.loginButton.click();

    return new HomePage(this.page);

  }

  async getLoginEmailValidationMessage(): Promise<string> {
    return await this.loginEmailField.evaluate((element: HTMLInputElement) => element.validationMessage);
  }

  async getLoginPasswordValidationMessage(): Promise<string> {
    return await this.loginPasswordField.evaluate((element: HTMLInputElement) => element.validationMessage);
  }

  async getSignupEmailValidationMessage(): Promise<string> {
    return await this.signupEmailField.evaluate((element: HTMLInputElement) => element.validationMessage);
  }
}
