# QA Automation Framework – Plan & Roadmap

Design and evolution notes for the Automation Exercise QA portfolio project.

---

## Vision

A Playwright-driven framework that demonstrates professional Quality Engineering: layered test strategy, AI-assisted self-healing, clear configuration, and CI/CD integration.

---

## Architecture Decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Test framework** | Playwright Test | Cross-browser, API + UI, strong tooling |
| **Structure** | POM for pages and API | Centralized logic, easier maintenance |
| **Fixtures** | User lifecycle (preCreated, persistent) | Ephemeral data, cleanup via API |
| **Config** | `src/config.ts` + env vars | Multi-environment, no hard-coded secrets |
| **AI healing** | Local Ollama, `@ai-healing` only | Demo capability without CI dependency |
| **Tags** | `@smoke`, `@api`, `@visual`, `@e2e`, `@flaky` | Layered suites, fast feedback |

---

## Implementation Status

### Done

- Environment & config: `src/config.ts`, `.env.sample`, README docs
- Smoke suite: `@smoke` on login, home, API create-user
- E2E place-order: `tests/e2e/place-order.logged.spec.ts`, `PaymentPage`, `PaymentDonePage`
- Test data strategy: `user-factory.ts`, `TEST_DATA_SEED`, README section
- Flakiness: `TestUtils.blockAds` / `prepareForScreenshot`, `@flaky` convention
- AI observability: `logHealing` with test name, decision, model; `healing-report.log`
- Documentation: Folder map, Representative Scenarios, README polish

---

## Page & Flow Design

### Account flows

```mermaid
graph LR
  A[Account] --> B(Guest User)
  A --> C(Registered User)
  A --> D(Delete Account)
```

### Product flows

```mermaid
graph LR
  A[Products] --> B(Guest User)
  A --> C(Registered User)
  A --> D(Delete Account)
```

### Page hierarchy

```mermaid
flowchart TD
  Home[Home Page] --> PLP[Product Listing Page]
  Home --> Auth[Login / Register]
  PLP --> PDP[Product Details]
  PDP --> Cart[Shopping Cart]
  Cart --> Checkout[Checkout Page]
  Checkout --> Success[Order Confirmation]
```

---

## Suggested Test Cases (UI)

```mermaid
flowchart LR
  classDef complete fill:#d4edda,stroke:#28a745
  classDef pending fill:#fff3cd,stroke:#ffc107

  Start((E2E Tests)) --> Users
  Start --> Prod[Products]
  Start --> Orders
  Start --> Misc[Utility/UI]

  subgraph Users
    TC1(TC1: Register):::complete
    TC2(TC2: Login - Valid):::complete
    TC3(TC3: Login - Invalid):::complete
    TC4(TC4: Logout):::complete
    TC5(TC5: Register - Duplicate):::complete
  end

  subgraph Prod[Products]
    TC8(TC8: Product Detail):::pending
    TC9(TC9: Search):::pending
    TC18(TC18: Categories):::pending
    TC19(TC19: Brands):::pending
    TC21(TC21: Reviews):::pending
  end

  subgraph Orders
    TC14(TC14: Register at Checkout):::pending
    TC15(TC15: Register before Checkout):::pending
    TC23(TC23: Verify Address):::pending
    TC24(TC24: Download Invoice):::pending
  end

  subgraph Misc[Utility/UI]
    TC25(TC25: Scroll with Arrow):::pending
    TC26(TC26: Scroll without Arrow):::pending
  end
```

---

## Suggested Test Cases (API)

```mermaid
flowchart LR
  classDef done fill:#e1f5fe,stroke:#01579b

  API((API Suite)) --> GET
  API --> POST
  API --> UPD[PUT/DELETE]

  subgraph GET
    A1(API 1: All Products):::done
    A3(API 3: All Brands):::done
    A14(API 14: Get by Email):::done
  end

  subgraph POST
    A2(API 2: Create Product):::done
    A5(API 5: Search):::done
    A7(API 7: Login Valid):::done
    A11(API 11: Register):::done
  end

  subgraph UPD[PUT & DELETE]
    A4(API 4: Update Brand):::done
    A13(API 13: Update User):::done
    A12(API 12: Delete User):::done
  end
```

---
