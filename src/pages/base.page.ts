import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly path: string = '/';

  readonly page: Page;
  readonly singupLoginLink: Locator;
  readonly loggedAsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;
    this.singupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
    this.loggedAsLink = page.getByText(/Logged in as .*/);
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });
    this.footer = page.locator('#footer');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForURL(`**${this.path}`);
  }

  async logout(): Promise<void> {
    this.logoutLink.click();
  }

}
