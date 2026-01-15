import { APIResponse } from '@playwright/test';
import { User } from '../interfaces/interfaces';
import { BaseApi } from './base.api';

export class UserApi extends BaseApi {

  /**
   * post: Creates a new user account on Automation Exercise.
   */
  public async createAccount(userData: User): Promise<APIResponse> {
    return await this.request.post(this.endpoint('/createAccount'), {
      form: { ...userData }
    });
  }

  /**
   * delete: Deletes an existing user account.
   */
  public async deleteAccount(userCredentials: Pick<User, 'email' | 'password'>): Promise<APIResponse> {
    return await this.request.delete(this.endpoint('/deleteAccount'), {
      form: userCredentials,
    });
  }

  /**
    * Put: update user account
  */
  public async updateAccount(userData: User): Promise<APIResponse> {
    return await this.request.put(this.endpoint('/updateAccount'), { form: { ...userData } });
  }

  /**
    * get: Get user account details by email
  */
  public async getAccountDetailsByEmail(email: User['email']): Promise<APIResponse> {
    return await this.request.get(this.endpoint('/getUserDetailByEmail'), { params: { email } });
  };

}
