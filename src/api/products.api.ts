import { APIResponse } from '@playwright/test';
import { BaseApi } from './base.api';

export class ProductsApi extends BaseApi {

  /**
   * Get products list
   * @returns APIResponse All products list
   */
  async getProductList(): Promise<APIResponse> {
    return await this.request.get(this.endpoint('/productsList'));
  }

  /**
   * Invalid Methods Post
   * @returns APIResponse Method is not support
   */
  async invalidMethodPostAllProducts(): Promise<APIResponse> {
    return await this.request.post(this.endpoint('/productsList'));
  }

  /**
   * Search Products
   * @param search
   * @returns APIResponse Searched product list
   */
  async searchProduct(search?: string): Promise<APIResponse> {
    return await this.request.post(this.endpoint('/searchProduct'), { form: { ...(search !== undefined && { search_product: search }) } });

  }

}
