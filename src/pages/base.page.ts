import { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  protected readonly path: string = '/';

  readonly page: Page;

  // --- Navbar ---
  readonly header: Locator;
  readonly homeLink: Locator;
  readonly cartLink: Locator;
  readonly singupLoginLink: Locator;
  readonly loggedAsLink: Locator;
  readonly logoutLink: Locator;
  readonly deleteAccountLink: Locator;
  // --- Footer ---
  readonly footer: Locator;

  constructor(page: Page) {
    this.page = page;

    // ---Navbar ---
    this.header = page.locator('#header');
    this.homeLink = this.header.getByRole('link', { name: 'Home' });
    this.cartLink = this.header.getByRole('link', { name: 'Cart' });
    this.singupLoginLink = page.getByRole('link', { name: ' Signup / Login' });
    this.loggedAsLink = page.getByText(/Logged in as .*/);
    this.logoutLink = page.getByRole('link', { name: 'Logout' });
    this.deleteAccountLink = page.getByRole('link', { name: 'Delete Account' });

    // --- Footer ---
    this.footer = page.locator('#footer');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForURL(`**${this.path}`);
    await this.homeLink.waitFor({ state: 'visible' });

  }

  async logout(): Promise<void> {
    this.logoutLink.click();
  }

}
