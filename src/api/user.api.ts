import { APIResponse } from '@playwright/test';
import { UserPayload } from '../interfaces/user.payload';
import { BaseApi } from './base.api';

export class UserApi extends BaseApi {

  /**
   * Creates a new user account on Automation Exercise.
   */
  public async createAccount(userData: UserPayload): Promise<APIResponse> {
    return await this.request.post('/api/createAccount', {
      form: { ...userData }
    });
  }

  /**
   * Deletes an existing user account.
   */
  public async deleteAccount(userCredentials: Pick<UserPayload, 'email' | 'password'>): Promise<APIResponse> {
    return await this.request.delete('/api/deleteAccount', {
      form: userCredentials,
    });
  }
}
