import { Page, Locator } from '@playwright/test';
import { getHealedLocatorOrThrow, logHealing } from '../ai-engine/ai-bridge';

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
  readonly contactUsLink: Locator;
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
    this.contactUsLink = this.page.getByRole('link', { name: ' Contact us' });

    // --- Footer ---
    this.footer = page.locator('#footer');
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForURL(`**${this.path}`);
    await this.homeLink.waitFor({ state: 'visible' });

  }

  async clickContactUs(brokenLink?: string): Promise<void> {
    // We use the brokenLink if provided to demonstrate healing
    const selector = brokenLink || this.contactUsLink;
    await this.smartClick(selector, 'The Contact Us link in the top menu');
  }

  async logout(): Promise<void> {
    await this.smartClick(this.logoutLink, 'The Logout link in the top menu');
  }

  /**
    * Smart Click: Tries a normal click. If it fails, uses AI to heal.
    */
  async smartClick(selectorOrLocator: string | Locator, goal: string): Promise<void> {
    // We create a string version for logging purposes
    const originalRef = typeof selectorOrLocator === 'string'
      ? selectorOrLocator
      : selectorOrLocator.toString();

    try {
      // FIX: Check the type and use the correct click implementation
      if (typeof selectorOrLocator === 'string') {
        await this.page.click(selectorOrLocator, { timeout: 3000 });
      } else {
        await selectorOrLocator.click({ timeout: 3000 });
      }
    } catch (err) {
      const error = err as Error;
      console.log(`Locator "${originalRef}" failed with error: ${error.message}`);
      console.warn(`⚠️ SmartClick failed for [${originalRef}]. Engaging AI Healing for: ${goal}`);

      // 1. Get the DOM context
      const domSnippet = await this.page.innerHTML('body');

      // 2. Get the fix from our Bridge
      const healedSelector = await getHealedLocatorOrThrow(domSnippet, goal);

      // 3. Try clicking with the new selector (AI always returns a string)
      console.log(`✨ AI found fix: ${healedSelector}`);
      await this.page.click(healedSelector);

      // 4. Log it for the report
      logHealing(originalRef, healedSelector, goal);
    }
  }
}
