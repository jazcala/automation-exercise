import { BasePage } from './base.page';
import { Page } from '@playwright/test';

export class CheckoutPage extends BasePage {
  protected readonly path: string = '/checkout';

  readonly checkoutBreadcrum = this.page.locator('.breadcrumb .active');

  constructor(page: Page) {
    super(page);
  }
}
