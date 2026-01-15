import { APIResponse } from '@playwright/test';
import { BaseApi } from './base.api';

export class BrandsApi extends BaseApi {

  /**
   * Get All Brands
   * @returns APIResponse
   */

  async getAllBrands(): Promise<APIResponse> {
    return await this.request.get(this.endpoint('/brandsList'));
  }

  /**
   * Invalid Methods
   * @returns APIResponse - Method is not supported
   */
  async invalidMethodPutAllBrands(): Promise<APIResponse> {
    return await this.request.put(this.endpoint('/brandsList'));
  }

}
