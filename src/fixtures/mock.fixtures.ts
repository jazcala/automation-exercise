import type { Page } from '@playwright/test';
import { test as baseTest } from './base-fixture';
import {
  mockLogin401,
  mockSearchEmpty,
  mockCheckout500,
  MockHandlerOptions,
} from '../mocks/handlers/api-handlers';

export type MockConfig = {
  login?: '401' | 'success';
  search?: 'empty' | 'success';
  checkout?: '500' | 'success';
  /** Default delay (ms) for all enabled mocks */
  delay?: number;
  globalDelay?: number;
  options?: Partial<Record<'login' | 'search' | 'checkout', MockHandlerOptions>>;
};

type MockHandlerKey = 'login' | 'search' | 'checkout';

type MyObjects = {
  mockApi: MockConfig;
};

const handlers: Record<
  MockHandlerKey,
  (page: Page, options?: MockHandlerOptions) => Promise<void>
> = {
  login: mockLogin401,
  search: mockSearchEmpty,
  checkout: mockCheckout500,
};

const shouldInstallMock: Record<MockHandlerKey, (cfg: MockConfig) => boolean> = {
  login: (c) => c.login === '401',
  search: (c) => c.search === 'empty',
  checkout: (c) => c.checkout === '500',
};

const mockHandlerKeys: readonly MockHandlerKey[] = ['login', 'search', 'checkout'];

export const test = baseTest.extend<MyObjects>({
  mockApi: [{}, { option: true }],

  page: async ({ page, mockApi }, use) => {
    const defaultDelay = mockApi.delay ?? mockApi.globalDelay ?? 0;

    for (const key of mockHandlerKeys) {
      if (!shouldInstallMock[key](mockApi)) continue;

      const specificOpts = mockApi.options?.[key] ?? {};
      await handlers[key](page, {
        ...specificOpts,
        delay: specificOpts.delay ?? defaultDelay,
      });
    }

    await use(page);
  },
});

export { expect } from './base-fixture';
