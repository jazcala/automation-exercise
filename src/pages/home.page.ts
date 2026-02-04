import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';
import { CartPage } from './cart.page';
import { Product } from '../interfaces/interfaces';

export class HomePage extends BasePage {

  readonly mainCarouselSlider: Locator;
  readonly recommendedItemCarousel: Locator;
  readonly firstProductAddToCartButton: Locator;

  readonly firstProductCard: Locator;
  readonly productCardList: Locator;
  // --- Added Modal
  readonly addedModal: Locator;
  readonly addedModalTitle: Locator;
  readonly addedModalText: Locator;
  readonly addedModalViewCartLink: Locator;
  readonly addedModalContinueShoppingButton: Locator;

  constructor(page: Page) {

    super(page);
    this.mainCarouselSlider = page.locator('#slider-carousel');
    this.recommendedItemCarousel = page.locator('#recommended-item-carousel');
    this.productCardList = page.locator('.features_items .single-products');
    this.firstProductCard = this.productCardList.first();
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

  private getProductContainer(name: string): Locator {
    return this.productCardList.filter({
      has: this.page.locator('.productinfo p').filter({ hasText: name })
    });
  }

  async addProductAndViewCart(productInfo: Product): Promise<CartPage> {
    const container = this.getProductContainer(productInfo.name);
    await container.scrollIntoViewIfNeeded();
    await container.hover();

    await container.scrollIntoViewIfNeeded();
    await container.hover();

    await container.locator('.overlay-content .add-to-cart').click();
    await this.addedModal.waitFor({ state: 'visible' });

    return await this.viewCartFromAddedModal();

  }

  /**
   *  --- Added Modal ---
   *  It's displayed after a product is added to cart.
   */

  async viewCartFromAddedModal(): Promise<CartPage> {

    await this.addedModalViewCartLink.click();

    return new CartPage(this.page);
  }

  async continueShoppingFromAddedModal(): Promise<void> {

    await this.addedModalContinueShoppingButton.click();

  }
}
