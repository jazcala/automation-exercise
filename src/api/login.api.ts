import { APIResponse } from '@playwright/test';
import { User } from '../interfaces/interfaces';
import { BaseApi } from './base.api';

export type LoginCredentials = Partial<Pick<User, 'email' | 'password'>>;

export class LoginApi extends BaseApi {

  public async login(credentials: LoginCredentials): Promise<APIResponse> {
    return await this.request.post(this.endpoint('verifyLogin'), {
      form: {
        ...credentials
      }
    });
  }

  public async loginWithInvalidMethod(): Promise<APIResponse> {
    return await this.request.delete(this.endpoint('verifyLogin'));
  }

  /**
   * Login with raw form data (for edge case / negative testing)
   */
  public async loginWithFormData(formData: Record<string, string>): Promise<APIResponse> {
    return await this.request.post(this.endpoint('verifyLogin'), { form: formData });
  }
}
