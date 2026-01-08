import { APIRequestContext } from '@playwright/test';

export abstract class BaseApi {
  protected readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

}
