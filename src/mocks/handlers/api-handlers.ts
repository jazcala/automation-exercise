/**
 * API mock handlers for Playwright page.route().
 * Use with mockApi fixture for test isolation and CI speed.
 */

import { Page, Route } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const MOCKS_DATA = path.join(process.cwd(), 'mocks', 'data');

export type MockScenario = '401' | 'empty' | '500';

export interface MockHandlerOptions {
  /** Delay in ms before responding (e.g. 2000 for slow 3G simulation) */
  delay?: number;
  /** Override status code */
  status?: number;
}

function loadMock(name: string): Record<string, unknown> {
  const file = path.join(MOCKS_DATA, `${name}.json`);
  if (!fs.existsSync(file)) return {};

  return JSON.parse(fs.readFileSync(file, 'utf-8'));
}

/** Payload passed to `route.fulfill()` for mocked JSON/HTML bodies */
type RouteMockFulfill = {
  status: number;
  body: string;
  contentType?: string;
};

async function respondWithDelay(
  route: Route,
  response: RouteMockFulfill,
  delayMs: number
): Promise<void> {
  if (delayMs > 0) {
    await new Promise((r) => setTimeout(r, delayMs));
  }
  await route.fulfill(response);
}

/**
 * Mock POST /api/verifyLogin with 401 Unauthorized
 */
export async function mockLogin401(
  page: Page,
  options: MockHandlerOptions = {}
): Promise<void> {
  const { delay = 0, status = 401 } = options;
  const body = loadMock('login-401');

  await page.route('**/api/verifyLogin', async (route) => {
    if (route.request().method() !== 'POST') {
      return route.continue();
    }
    await respondWithDelay(
      route,
      {
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      },
      delay
    );
  });
}

/**
 * Mock POST /api/searchProduct and /search_product with empty results
 */
export async function mockSearchEmpty(
  page: Page,
  options: MockHandlerOptions = {}
): Promise<void> {
  const { delay = 0, status = 200 } = options;
  const body = loadMock('search-empty');

  const emptySearchHtml = `<!DOCTYPE html><html><head><meta charset="utf-8"></head><body>
    <div class="features_items"></div>
    <h2 class="title text-center">Searched Products</h2>
  </body></html>`;

  await page.route('**/api/searchProduct', async (route) => {
    if (route.request().method() !== 'POST') {

      return route.continue();
    }
    await respondWithDelay(
      route,
      {
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      },
      delay
    );
  });

  await page.route('**/search_product**', async (route) => {
    if (route.request().method() !== 'POST') {
      return route.continue();
    }
    await respondWithDelay(
      route,
      {
        status,
        contentType: 'text/html',
        body: emptySearchHtml,
      },
      delay
    );
  });
}

/**
 * Mock payment submission with 500 Server Error.
 * Only matches POST to `/payment` (card submit). Avoids `*checkout*` / `*order*` globs
 * that match `/checkout` navigation and break the flow before payment.
 */
export async function mockCheckout500(
  page: Page,
  options: MockHandlerOptions = {}
): Promise<void> {
  const { delay = 0, status = 500 } = options;
  const body = loadMock('error-500');

  const handler = async (route: Route): Promise<void> => {
    if (route.request().method() !== 'POST') {
      return route.continue();
    }
    await respondWithDelay(
      route,
      {
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      },
      delay
    );
  };

  await page.route('**/payment*', handler);
}
