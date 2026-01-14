import { APIRequestContext } from '@playwright/test';

export abstract class BaseApi {
  protected readonly request: APIRequestContext;
  protected readonly basePath = '/api';

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  protected endpoint(resource: string): string {

    const cleanResource = resource.startsWith('/') ? resource : `/${resource}`;

    return `${this.basePath}${cleanResource}`;
  }

}
