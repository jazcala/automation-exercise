import { APIResponse } from '@playwright/test';
import { UserPayload } from '../interfaces/user.payload';
import { BaseApi } from './base.api';

export class UserApi extends BaseApi {

  /**
   * post: Creates a new user account on Automation Exercise.
   */
  public async createAccount(userData: UserPayload): Promise<APIResponse> {
    return await this.request.post('/api/createAccount', {
      form: { ...userData }
    });
  }

  /**
   * delete: Deletes an existing user account.
   */
  public async deleteAccount(userCredentials: Pick<UserPayload, 'email' | 'password'>): Promise<APIResponse> {
    return await this.request.delete('/api/deleteAccount', {
      form: userCredentials,
    });
  }

  /**
    * Put: update user account
  */
  public async updateAccount(userData: UserPayload): Promise<APIResponse> {
    return await this.request.put('/api/updateAccount', { form: { ...userData } });
  }

  /**
    * get: Get user account details by email
  */
  public async getAccountDetailsByEmail(email: UserPayload['email']): Promise<APIResponse> {
    return await this.request.get('/api/getUserDetailByEmail', { params: { email } });
  };

}
