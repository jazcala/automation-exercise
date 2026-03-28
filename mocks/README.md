# API Mocking

Mock data and handlers for Playwright UI tests. Use for **test isolation** and **CI speed**.

Handlers live in `src/mocks/handlers/api-handlers.ts`. Each handler reads `MockHandlerOptions.delay` and passes it to `respondWithDelay` so simulated latency is consistent.

## Quick Start

```bash
npm run test:mocked
```

## Mock Scenarios

| Scenario | Endpoint | Mock File | Use Case |
| ---------- | ---------- | ----------- | ---------- |
| 401 Login | `POST /api/verifyLogin` | `login-401.json` | Test error UI without real invalid credentials |
| Empty Search | `POST /api/searchProduct`, `/search_product` | `search-empty.json` | Test empty-state UI (some flows skip: site may use server-side search) |
| 500 Checkout | `POST` URLs matching `**/payment*` (card submit; avoids blocking `/checkout` navigation) | `error-500.json` | Test payment failure handling |

Non-matching requests use `return route.continue()` early so traffic is not left hanging.

## Delay (`delay` / `globalDelay`)

Default latency for all **installed** mocks is:

`mockApi.delay ?? mockApi.globalDelay ?? 0` (ms)

Per-handler overrides: `mockApi.options.login.delay`, `.search.delay`, `.checkout.delay` (highest precedence).

```typescript
import { test, expect } from '../../src/fixtures/mock.fixtures';

test.use({
  mockApi: {
    login: '401',
    delay: 2000,
  },
});
```

**Typical values:**

- `200` – Light delay
- `500` – Slow 3G (RTT ~600ms)
- `1500` – Very slow
- `2000` – Slow 3G simulation

**Note:** Some tests (e.g. login with delay) may be skipped if the site calls mocked APIs on page load, causing navigation timeouts.

## Usage in Tests

```typescript
import { test, expect } from '../../src/fixtures/mock.fixtures';

test.describe('My mocked test', () => {
  test.use({ mockApi: { login: '401' } });

  test('Shows error on 401', async ({ pom }) => {
    await pom.loginPage.navigate();
    await pom.loginPage.login('any@email.com', 'wrong');
    await expect(pom.loginPage.loginErrorMessage).toBeVisible();
  });
});
```

## Adding New Mocks

1. Add JSON to `mocks/data/{endpoint}-{scenario}.json`
2. Add handler in `src/mocks/handlers/api-handlers.ts` (use `MockHandlerOptions.delay` → `respondWithDelay`)
3. Extend `MockConfig` and the `handlers` / `shouldInstallMock` maps in `src/fixtures/mock.fixtures.ts`

## Ad blocking vs mocks

UI tests that call `TestUtils.blockAds(page)` only **abort** ad/analytics URLs at the network layer (no injected CSS). That keeps layout stable while still cutting third-party noise.

## CI

The `chromium-mocked` project runs in CI as a separate job. Use workflow_dispatch with `project: chromium-mocked` to run only mocked tests.
