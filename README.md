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
