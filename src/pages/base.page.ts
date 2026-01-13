import { Page } from '@playwright/test';

export abstract class BasePage {
  protected readonly path: string = '/';

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async navigate(): Promise<void> {
    await this.page.goto(this.path);
    await this.page.waitForURL(`**${this.path}`);
  }

}
