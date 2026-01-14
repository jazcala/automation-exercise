import { Page, Locator } from '@playwright/test';
import { BasePage } from './base.page';

export class HomePage extends BasePage {

  readonly mainCarouselSlider: Locator;
  readonly recommendedItemCarousel: Locator;

  constructor(page: Page) {

    super(page);
    this.mainCarouselSlider = page.locator('#slider-carousel');
    this.recommendedItemCarousel = page.locator('#recommended-item-carousel');

  }

}
