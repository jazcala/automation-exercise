# 🛒 Automation Exercise: Full-Stack QA Framework

A Playwright-driven suite featuring **AI-Powered Self-Healing*** **API Orchestration**, **UI Automation**, and **CI/CD integration**.

---

## 🏛️ Project Overview

This framework is designed to provide a robust, scalable, and maintainable automation solution for the [Automation Exercise](https://automationexercise.com/) platform. It demonstrates a professional approach to Quality Engineering by balancing speed, reliability, and clear reporting.

### 🏗️ Architecture Highlights

* **🤖 AI-Powered Self-Healing:** Integrated an **AI Bridge** that uses a local **Ollama** instance (Llama 3.2) to dynamically suggest and "heal" broken locators at runtime based on the DOM context.
* **Parallelization & Sharding:** UI tests are sharded across multiple GitHub Action runners to minimize execution time.
* **Page Object Model (POM):** Applied to both UI components and API endpoints to centralize logic and reduce maintenance.
* **Unified Reporting:** Custom GitHub Actions workflow that merges API and UI results into a single, comprehensive HTML dashboard hosted on **GitHub Pages**.

---

## 🧪 Testing Strategy

### 🤖 AI Self-Healing Engine (Local-Development)

This framework includes a "Pro" feature for local development: an experimental **AI-driven self-healing mechanism**. Using **Ollama** (Llama 3.2), the framework can:

* **Dynamic Recovery:** Detect broken CSS selectors during execution.
* **LLM Inference:** Send HTML snippets to the local AI to suggest a "healed" selector based on original intent.
* **Developer Workflow:** These tests are tagged with `@ai-healing`. They are designed to be run locally by developers to identify and fix brittle locators before committing code.

> **Note:** These tests are excluded from CI and the standard Docker build to maintain fast execution speeds and avoid infrastructure bottlenecks.

### 📡 API Layer

* **Schema Validation:** Uses TypeScript interfaces and `expect.any()` to verify response structures dynamically, preventing brittle tests.
* **Negative Testing:** Validates edge cases and error handling (e.g., verifying `405 Method Not Allowed` for invalid operations).
* **Soft Assertions:** Employed for bulk data validation (like Brands and Products lists) to ensure comprehensive error logging without stopping the suite prematurely.

### 💻 UI Layer

* **State Management:** (In Progress) Implementing `storageState` to share authentication across test shards, bypassing redundant login steps.
* **Cross-Browser Testing:** Configured to run across Chromium, Firefox, and Webkit via Playwright’s engine.

### 🏷️ Test Suites & Tags

This repo uses Playwright title tags (e.g., `@smoke`) so you can select suites via `--grep`:

* **`@smoke`**: Small critical-path checks for fast feedback (used by `npm run test:smoke`).
* **`@api`**: API-focused specs (also selectable via `--project=api-tests`).
* **`@visual`**: Visual regression specs (used by `--project=visual-regression` and `--grep @visual`).
* **`@ai-healing`**: Local-only AI self-healing demos (excluded from CI by default).
* **`@e2e`**: End-to-end flows (e.g. full place-order journey).

### Representative E2E Scenario

The **place-order (logged-in)** flow demonstrates a full checkout journey:

* **Spec:** `tests/e2e/place-order.logged.spec.ts`
* **Flow:** Logged-in user adds a product to cart, reviews cart, proceeds to checkout, completes payment with test card data, and asserts on the order success message.
* **Fixtures:** Uses `homePage`, cart from “View Cart” modal, `CheckoutPage`, and `PaymentPage` (see `src/pages/checkout.page.ts`, `src/pages/payment.page.ts`).
* **Run:** Included in the logged-in projects (e.g. `npx playwright test tests/e2e/place-order.logged.spec.ts` or `npm run test:logged` with the e2e file matching the project).

---

## 🚀 How to Run

1. **Install Dependencies**

   ```bash
   npm install
   ```

1. **Run All Tests**

   ```bash
   npx playwright test
   ```

1. **Run Specific Suite**

   ```bash
   npx playwright test --project=api-tests  # API Only
   npx playwright test --project=chromium # UI Only
   npx playwright test --grep @ai-healing # AI-healing
   ```

> Note: For ai-healing  **Start Ollama** (Ensure you have Ollama installed and `llama3.2` pulled).

### ⚙️ Configuration & Environment Variables

The framework can be configured via environment variables to better model real-world environments:

* **`PLAYWRIGHT_BASE_URL`**: Base URL for all UI and API tests.
  * Default: `https://automationexercise.com`
  * Used in `playwright.config.ts` via `appConfig.baseUrl`.

* **`AI_ENABLED`**: Gate for AI self-healing behaviour.
  * Default: `true` (set to `'false'` to consider AI disabled in your own code paths).

* **`AI_BASE_URL`**: Base URL for the AI / LLM endpoint.
  * Default: `http://localhost:11434/v1` (local Ollama).

* **`AI_API_KEY`**: API key used by the AI client.
  * Default: `ollama` (placeholder used for local Ollama setups that do not enforce authentication).

* **`AI_MODEL`**: Model name used when calling the AI engine.
  * Default: `llama3.2:3b`.

* **`TEST_DATA_SEED`**: Optional. When set (e.g. to an integer), Faker is seeded so user data (names, emails, etc.) is reproducible across runs. See [Test Data Strategy](#-test-data-strategy) below.

All of these variables are wired through `src/config.ts` and consumed by both `playwright.config.ts` and `src/ai-engine/ai-bridge.ts`, so you can easily point the same test suite at different environments without changing code.

### 📋 Test Data Strategy

* **User data generation:** [src/utils/user-factory.ts](src/utils/user-factory.ts) uses `@faker-js/faker` to generate user payloads (name, email, password, address, etc.). `generateUserData(false)` returns minimal required fields; `generateUserData(true)` adds title, birth date, company, address2, newsletter, and offers so signup/API tests have full profiles.
* **Lifecycle and cleanup:** [src/fixtures/user.fixtures.ts](src/fixtures/user.fixtures.ts) defines fixtures that create and (where needed) delete users via the API: `preCreatedUser` / `preCreatedFullUser` create a user, yield it to the test, then delete the account in teardown; `persistentUser` is created once and not deleted by the fixture. [tests/global.teardown.ts](tests/global.teardown.ts) runs after the suite and deletes the persistent user used by auth setup, then removes `playwright/.auth` session and user files so the environment is clean for the next run.
* **Static expectations:** [src/utils/data-helper.ts](src/utils/data-helper.ts) centralizes fixed test data: dropdown options (months, days, years, countries), cart table headers, and the single expected product used for cart flows (e.g. “Stylish Dress”). Use it wherever tests need to assert on known values instead of Faker output.
* **Determinism (optional):** Set the `TEST_DATA_SEED` environment variable to a number (e.g. `42`) so Faker is seeded at load time. Every run with the same seed will then produce the same sequence of names, emails, and other generated fields. Use this when you need reproducible data (e.g. debugging, CI snapshots, or reducing variance). Leave it unset for realistic, varied data across runs.
* **Trade-offs:** Random data (no seed) exercises more combinations and avoids coupling tests to a single dataset. Seeded data makes failures reproducible and logs/snapshots stable. Prefer random data by default; switch to a seed when debugging flakiness or when you need a fixed dataset.

#### Local environment

* Copy the sample file: `cp .env.sample .env`
* (Optional) Adjust the values if you want to point at a different base URL or AI endpoint.
* Load the variables before running tests, for example:
  * Export via your shell: `export $(grep -v '^#' .env | xargs) && npx playwright test`
  * Or use a helper like `dotenv-cli` / `env-cmd` if you prefer.

#### CI environment (e.g., GitHub Actions)

In CI, set the same variables as environment variables or secrets:

* `PLAYWRIGHT_BASE_URL`
* `AI_ENABLED`
* `AI_BASE_URL`
* `AI_API_KEY`
* `AI_MODEL`

For GitHub Actions, a common pattern is:

1. Define repository or environment secrets:
   * `PLAYWRIGHT_BASE_URL`
   * `AI_ENABLED`
   * `AI_BASE_URL`
   * `AI_API_KEY`
   * `AI_MODEL`
2. Map them into your workflow jobs using `env:`. For example:

```yaml
env:
  PLAYWRIGHT_BASE_URL: ${{ secrets.PLAYWRIGHT_BASE_URL }}
  AI_ENABLED: ${{ secrets.AI_ENABLED }}
  AI_BASE_URL: ${{ secrets.AI_BASE_URL }}
  AI_API_KEY: ${{ secrets.AI_API_KEY }}
  AI_MODEL: ${{ secrets.AI_MODEL }}
```

You can place this `env` block at the `jobs.api-tests`, `jobs.ui-tests`, and/or `jobs.merge-reports` levels in `.github/workflows/playwright.yml` depending on which suites you want to configure.

### **🐳 Running with Docker**

To ensure a consistent environment and avoid "it works on my machine" issues, you can run the suite using the official Playwright Docker image:

1. Build the Image

   ```bash
   docker build -t playwright-automation .
   ```

1. Run Tests in Container

   ```bash
   docker run --rm -v $(pwd):/work/ playwright-automation npx playwright test --grep-invert @ai-healing
   ```

## **📊 Reports**

After execution, the report is automatically generated. To view the latest results locally:

  ```bash
  npx playwright show-report
  ```

---

### 🏛️ Pro-Tip: The `Dockerfile`

To make those Docker commands work, make sure you have a simple `Dockerfile` in your root folder. If you don't have one yet, here is a standard one that works perfectly with Playwright:

  ```dockerfile
  # Use the official Playwright image with all browsers pre-installed
  FROM mcr.microsoft.com/playwright:v1.57.0-noble

  # Set the working directory
  WORKDIR /app

  # Copy package files and install dependencies
  COPY package*.json ./
  RUN npm install

  # Copy the rest of the project
  COPY . .

  # Default command
  CMD ["npx", "playwright", "test"]
  ```

---
