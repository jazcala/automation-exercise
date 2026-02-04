import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartItem } from '../interfaces/interfaces';
import { ProductPage } from './products.page';
import { CheckoutPage } from './checkout.page';
import { HomePage } from './home.page';

export class CartPage extends BasePage {

  protected readonly path: string = '/view_cart';

  readonly tableHeaders: Locator;
  readonly cartItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly emptyCartLink: Locator;
  readonly checkoutBreadcrum: Locator;
  readonly homeBreadcrum: Locator;

  readonly proceedToCheckoutButton: Locator;

  // --- Guest user checkout Modal---
  readonly checkoutModal: Locator;
  readonly checkoutModalTitle: Locator;
  readonly checkoutModalText: Locator;
  readonly checkoutModalSignupLoginLink: Locator;
  readonly checkoutModalContinueOnCartButton: Locator;

  constructor(page: Page) {
    super(page);
    this.tableHeaders = page.locator('thead tr td');
    this.cartItems = page.locator('#cart_info tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart').getByText('Cart is empty! Click here to buy products.');
    this.emptyCartLink = this.emptyCartMessage.getByRole('link', {
      name:
        'here'
    });
    this.proceedToCheckoutButton = page.locator('.check_out').getByText('Proceed To Checkout');
    this.homeBreadcrum = page.locator('.breadcrumb').getByRole('link', { name: 'Home' });
    this.checkoutBreadcrum = page.locator('.breadcrumb .active').filter({ hasText: 'Checkout' });

    // --- Guest user checkout  Modal ---
    this.checkoutModal = page.locator('#checkoutModal .modal-confirm');
    this.checkoutModalTitle = this.checkoutModal.getByRole('heading', { name: 'Checkout' });
    this.checkoutModalText = this.checkoutModal.getByText('Register / Login account to proceed on checkout.');
    this.checkoutModalSignupLoginLink = this.checkoutModal.getByRole('link', { name: 'Register / Login' });
    this.checkoutModalContinueOnCartButton = this.checkoutModal.getByRole('button', { name: 'Continue on Cart' });
  }

  async proceedToCheckout(): Promise<CheckoutPage> {

    await this.proceedToCheckoutButton.click();

    return new CheckoutPage(this.page);
  }

  async proceedToCheckoutAsGuest(): Promise<void> {

    await this.proceedToCheckoutButton.click();

  }

  async getTableHeaders(): Promise<String[]> {

    return await this.tableHeaders.allTextContents();
  }

  async getRowByProductName(name: string): Promise<Locator> {
    return this.cartItems.filter({ hasText: name });
  }

  async removeItemFromCart(itemName: string): Promise<void> {

    const itemRow = await this.getRowByProductName(itemName);
    const deleteButton = itemRow.locator('.cart_delete .cart_quantity_delete');
    await deleteButton.click();

  }

  async getProductDataFromRow(name: string): Promise<CartItem> {
    const row = await this.getRowByProductName(name);

    return {
      description: await row.locator('.cart_description').innerText(),
      price: await row.locator('.cart_price').innerText(),
      quantity: await row.locator('.cart_quantity').innerText(),
      total: await row.locator('.cart_total').innerText(),
    };
  }

  async goToHomePageViaEmptyCartLink(): Promise<ProductPage> {
    await this.emptyCartLink.click();

    return new ProductPage(this.page);
  }

  async navigaToHomeViaBreadcrum(): Promise<HomePage> {
    await this.homeBreadcrum.click();

    return new HomePage(this.page);
  }

  async getItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async clearEntireCart(): Promise<void> {
    const itemCount = await this.getItemCount();
    for (let i = 0; i < itemCount; i++) {
      const firstItemRow = this.cartItems.first();
      const deleteButton = firstItemRow.locator('.cart_delete .cart_quantity_delete');
      await deleteButton.click();
    }
  }
}
