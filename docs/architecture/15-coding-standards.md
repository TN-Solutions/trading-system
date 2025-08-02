# 15. Security, Performance, and Standards

This section consolidates important considerations regarding non-functional requirements.

## 15.1. Security Requirements

*   **Authorization:** Supabase's **Row Level Security (RLS)** is the cornerstone of security, ensuring users cannot access each other's data. All tables with user data must have RLS enabled.
*   **API Key Protection:** All third-party API keys (Market Data API, Sentry) must be stored securely as environment variables on Vercel and never exposed on the client-side.
*   **Input Validation:** User input must be validated on both the client-side (using Zod and React Hook Form) and server-side (in Server Actions) to prevent attacks like XSS.
*   **Dependencies:** Project dependencies should be regularly scanned with tools like `pnpm audit` to identify known vulnerabilities.

## 15.2. Performance Optimization

*   **Frontend:**
    *   **Core Web Vitals:** The goal is to achieve "Good" scores for all Core Web Vitals (LCP, INP, CLS), monitored by Vercel Analytics.
    *   **Data Loading:** Leverage React Server Components (RSC) to fetch data on the server, minimizing client-side requests.
    *   **Bundle Optimization:** Use dynamic imports (`next/dynamic`) for heavy components (like the charting library) so they are only loaded when needed.
*   **Backend:**
    *   **Query Optimization:** Ensure all frequent queries to PostgreSQL are supported by appropriate indexes on foreign keys and frequently filtered columns.
    *   **Pagination:** All lists of data (reports, assets) must be paginated on the backend to avoid loading large, unnecessary datasets.

## 15.3. Testing Strategy

We will adopt the testing pyramid model:

*   **Unit Tests:**
    *   **Scope:** Utility functions, complex hooks, individual UI components.
    *   **Tools:** Jest, React Testing Library.
    *   **Requirement:** High code coverage for critical business logic.
*   **Integration Tests:**
    *   **Scope:** Test interactions between multiple components, e.g., a complete form and its API call.
    *   **Tools:** React Testing Library (with MSW for API mocking).
*   **End-to-End (E2E) Tests:**
    *   **Scope:** Critical user flows such as logging in, creating a full report, deleting an asset.
    *   **Tool:** Playwright.
    *   **Requirement:** Mandatory for the application's core workflows.

## 15.4. Coding Standards

*   **Linting & Formatting:**
    *   **ESLint:** Used to enforce code quality rules.
    *   **Prettier:** Used for automatic code formatting to ensure consistency.
    *   **Husky & lint-staged:** Will be configured to automatically run the linter and formatter on changed files before each commit.
*   **Naming Conventions:**
    *   **React Components:** `PascalCase` (e.g., `ReportEditor`).
    *   **Variables & Functions:** `camelCase` (e.g., `saveReport`).
    *   **DB Tables & Columns:** `snake_case` (e.g., `analysis_blocks`, `user_id`).
*   **Key Rules:**
    *   **No Business Logic in Components:** Components should only be responsible for displaying UI and calling functions from the service/action layer.
    *   **Type Safety:** Leverage TypeScript to its fullest. Avoid using `any` unless absolutely necessary.
