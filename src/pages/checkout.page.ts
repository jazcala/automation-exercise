import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class CheckoutPage extends BasePage {

  protected readonly path: string = '/checkout';

  readonly checkoutBreadcrum: Locator;
  readonly placeOrderLink: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutBreadcrum = this.page.locator('.breadcrumb .active');
    this.placeOrderLink = this.page.getByRole('link', { name: 'Place Order' });
  }

  async goToPayment(): Promise<void> {
    await this.placeOrderLink.click();
  }

}
