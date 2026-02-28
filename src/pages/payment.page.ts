import { BasePage } from './base.page';
import { Page, Locator } from '@playwright/test';

export class PaymentPage extends BasePage {

  protected readonly path: string = '/payment';

  readonly nameOnCardInput: Locator;
  readonly cardNumberInput: Locator;
  readonly cvcInput: Locator;
  readonly expiryMonthInput: Locator;
  readonly expiryYearInput: Locator;
  readonly payAndConfirmButton: Locator;
  readonly orderSuccessMessage: Locator;

  constructor(page: Page) {

    super(page);
    this.nameOnCardInput = page.getByTestId('name-on-card');
    this.cardNumberInput = page.getByTestId('card-number');
    this.cvcInput = page.getByTestId('cvc');
    this.expiryMonthInput = page.getByTestId('expiry-month');
    this.expiryYearInput = page.getByTestId('expiry-year');
    this.payAndConfirmButton = page.getByRole('button', { name: /pay and confirm order/i });
    this.orderSuccessMessage = page.getByText(/order has been placed successfully/i);

  }

  async fillCardAndConfirm(
    nameOnCard: string,
    cardNumber: string,
    cvc: string,
    expiryMonth: string,
    expiryYear: string
  ): Promise<void> {

    await this.nameOnCardInput.fill(nameOnCard);
    await this.cardNumberInput.fill(cardNumber);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(expiryMonth);
    await this.expiryYearInput.fill(expiryYear);
    await this.payAndConfirmButton.click();

  }

}
