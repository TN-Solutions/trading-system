# 14. Deployment Architecture & CI/CD

This section describes how the application is deployed and the Continuous Integration/Continuous Deployment (CI/CD) pipeline.

## 14.1. Deployment Architecture

*   **Frontend (Next.js):**
    *   **Platform:** Vercel.
    *   **Method:** Direct integration with the GitHub repository. Vercel automatically builds and deploys the application upon changes to specified branches.
*   **Backend (Supabase):**
    *   **Platform:** Supabase Cloud.
    *   **Method:** A CI/CD pipeline using GitHub Actions will apply SQL migrations. This ensures the database schema in Staging and Production environments stays in sync with the source code.

## 14.2. Environments

We will use three primary environments:

| Environment | Frontend URL | Backend (Supabase Project) | Purpose | Trigger Branch |
| :--- | :--- | :--- | :--- | :--- |
| **Development** | `localhost:3000` | Supabase Local (Docker) | Local feature development and testing | - |
| **Staging** | `staging.yourdomain.com` | Supabase Staging Project | Integration testing, QA, UAT | `develop` |
| **Production** | `yourdomain.com` | Supabase Production Project | Live environment for end-users | `main` |

## 14.3. CI/CD Pipeline

The CI/CD process will be automated using **GitHub Actions**.

#### Pipeline 1: On Pull Request (targeting `main` or `develop`)

1.  **Trigger:** A PR is created or updated.
2.  **Jobs:**
    *   `Lint`: Runs `pnpm lint` to check code quality.
    *   `Test`: Runs `pnpm test` to execute unit and integration tests.
    *   `Build`: Runs `pnpm --filter frontend build` to ensure the application builds successfully.
3.  **Outcome:** The PR is blocked from merging if any of the above jobs fail.

#### Pipeline 2: On Merge to `main` (Production Deployment)

1.  **Trigger:** A PR is merged into the `main` branch.
2.  **Jobs:**
    *   **Deploy Frontend:** Vercel automatically receives a webhook from GitHub, builds, and deploys the latest version of the frontend application to the Production environment.
    *   **Deploy Backend:**
        *   A GitHub Actions job is triggered.
        *   It uses the Supabase CLI to connect to the Production Supabase project.
        *   It runs `supabase db push` to apply any new migration files from the `supabase/migrations/` directory.

---
