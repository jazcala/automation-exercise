import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';

export class HomePage extends BasePage {

  readonly mainCarouselSlider: Locator;
  readonly recommendedItemCarousel: Locator;
  readonly firstProductAddToCartButton: Locator;

  // --- Added Modal
  readonly addedModal: Locator;
  readonly addedModalTitle: Locator;
  readonly addedModalText: Locator;
  readonly addedModalViewCartLink: Locator;
  readonly addedModalContinueShoppingButton: Locator;
  readonly firstProductCard: Locator;

  constructor(page: Page) {

    super(page);
    this.mainCarouselSlider = page.locator('#slider-carousel');
    this.recommendedItemCarousel = page.locator('#recommended-item-carousel');
    this.firstProductCard = page.locator('.single-products').first();
    this.firstProductAddToCartButton = page.locator('.overlay-content .add-to-cart').first();

    // --- Added Modal
    this.addedModal = page.locator('#cartModal .modal-confirm');
    this.addedModalTitle = this.addedModal.getByText('Added!');
    this.addedModalText = this.addedModal.getByText('Your product has been added to cart.');
    this.addedModalViewCartLink = this.addedModal.getByRole('link', { name: 'View Cart' });
    this.addedModalContinueShoppingButton = this.addedModal.getByRole('button', { name: 'Continue Shopping' });

  }

  async addFirstProductToCart(): Promise<void> {
    await this.firstProductCard.scrollIntoViewIfNeeded();
    await this.firstProductCard.hover();
    await this.firstProductAddToCartButton.click();

  }

  /**
   *  --- Added Modal ---
   *  It's displayed after a product is added to cart.
   */

  async viewCart(): Promise<CartPage> {

    await this.addedModalViewCartLink.click();

    return new CartPage(this.page);
  }

  async continueShopping(): Promise<void> {

    await this.addedModalContinueShoppingButton.click();

  }
}
