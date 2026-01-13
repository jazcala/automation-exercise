import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {

  readonly singupLoginLink: Locator;
  readonly loggedAsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;

  constructor(page: Page) {

    super(page);
    this.singupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
    this.loggedAsLink = page.getByText(/Logged in as .*/);
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });

  }

  async logout(): Promise<void> {
    this.logoutLink.click();
  }

}
