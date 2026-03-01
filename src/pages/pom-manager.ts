import { Page } from '@playwright/test';
import { HomePage } from './home.page';
import { ProductPage } from './products.page';
import { CartPage } from './cart.page';
import { ContactPage } from './contact-us.page';
import { CheckoutPage } from './checkout.page';
import { LoginPage } from './login.page';
import { SignupPage } from './signup.page';
import { AccountCreatedPage } from './account-created.page';
import { ProductDetailPage } from './product-detail.page';
import { PaymentPage } from './payment.page';
import { PaymentDonePage } from './payment-done.page';

/**
 * Central manager for all Page Objects. Eliminates circular dependencies
 * by being the single place that imports and instantiates pages.
 */
export class PomManager {
  readonly homePage: HomePage;
  readonly productPage: ProductPage;
  readonly cartPage: CartPage;
  readonly contactPage: ContactPage;
  readonly checkoutPage: CheckoutPage;
  readonly loginPage: LoginPage;
  readonly signupPage: SignupPage;
  readonly accountCreatedPage: AccountCreatedPage;
  readonly productDetailPage: ProductDetailPage;
  readonly paymentPage: PaymentPage;
  readonly paymentDonePage: PaymentDonePage;

  constructor(page: Page) {
    this.homePage = new HomePage(page);
    this.productPage = new ProductPage(page);
    this.cartPage = new CartPage(page);
    this.contactPage = new ContactPage(page);
    this.checkoutPage = new CheckoutPage(page);
    this.loginPage = new LoginPage(page);
    this.signupPage = new SignupPage(page);
    this.accountCreatedPage = new AccountCreatedPage(page);
    this.productDetailPage = new ProductDetailPage(page);
    this.paymentPage = new PaymentPage(page);
    this.paymentDonePage = new PaymentDonePage(page);
  }
}
