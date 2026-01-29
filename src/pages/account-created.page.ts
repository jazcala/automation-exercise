import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { HomePage } from './home.page';

export class AccountCreatedPage extends BasePage {

  protected readonly path: string = '/account_created';

  readonly accountCreatedTitle: Locator;
  readonly accountCreatedMessage1: Locator;
  readonly accountCreatedMessage2: Locator;
  readonly continueButton: Locator;

  constructor(page: Page) {
    super(page);
    this.accountCreatedTitle = page.getByText('Account Created!');
    this.accountCreatedMessage1 = page.getByText('Congratulations! Your new account has been successfully created!');
    this.accountCreatedMessage2 = page.getByText('You can now take advantage of member privileges to enhance your online shopping experience with us.');
    this.continueButton = page.getByRole('link', { name: /Continue/ });
  }

  async continue(): Promise<HomePage> {
    await this.continueButton.click();

    return new HomePage(this.page);
  }
}
