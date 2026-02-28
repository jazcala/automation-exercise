import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class PaymentDonePage extends BasePage {

  protected readonly path: string = '/payment_done/500';

  readonly orderPlacedHeading: Locator;
  readonly congratulationsMessage: Locator;
  readonly downloadInvoiceLink: Locator;
  readonly continueLink: Locator;

  constructor(page: Page) {
    super(page);
    this.orderPlacedHeading = this.page.getByRole('heading', { name: /order placed/i });
    this.congratulationsMessage = this.page.getByText(/congratulations! your order has been confirmed/i);
    this.downloadInvoiceLink = this.page.getByRole('link', { name: /download invoice/i });
    this.continueLink = this.page.getByRole('link', { name: /continue/i });
  }

}
