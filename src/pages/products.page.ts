
import { Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ProductPage extends BasePage {

  protected readonly path: string = '/products';

  constructor(page: Page) {
    super(page);
  }

}
