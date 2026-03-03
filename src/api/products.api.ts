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

  async invalidMethodPutAllProducts(): Promise<APIResponse> {
    return await this.request.put(this.endpoint('/productsList'));
  }

  async invalidMethodDeleteAllProducts(): Promise<APIResponse> {
    return await this.request.delete(this.endpoint('/productsList'));
  }

  async invalidMethodPatchAllProducts(): Promise<APIResponse> {
    return await this.request.patch(this.endpoint('/productsList'));
  }

  async invalidMethodGetSearchProduct(): Promise<APIResponse> {
    return await this.request.get(this.endpoint('/searchProduct'));
  }
}
