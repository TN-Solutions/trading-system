# 3. Tech Stack

The table below is the single source of truth for the technologies selected for this project. All development must adhere to these exact technologies and versions.

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Frontend Language** | TypeScript | ~5.x | Primary language for the Next.js app | Established in the project, provides type safety. |
| **Frontend Framework** | Next.js | 14.x | React framework for the web application | Core requirement from PRD, provides SSR, SSG, and high performance. |
| **UI Library** | Shadcn-ui | Latest | Building UI components | Established, provides beautiful, accessible, and customizable components. |
| **State Management** | Zustand | Latest | Global application state management | Lightweight, simple, and scalable. Suitable for more complex state than React Context. |
| **Backend Language** | SQL, Python | 15, 3.11+ | Language for DB (Supabase) and custom services | SQL is standard for PostgreSQL. Python/FastAPI chosen for custom market data service. |
| **Backend Framework** | Supabase (BaaS), FastAPI | Latest | Provides DB/Auth/Storage (Supabase) and custom API (FastAPI) | Supabase accelerates MVP. FastAPI provides a focused service for market data. |
| **Data Ingestion** | MQL5 | 5.0 | Pushing market data from MT5 terminal | Required for building the custom Expert Advisor to capture and send OHLC data. |
| **API Style** | REST & Realtime | v1 | Communication between services | Supabase provides both. FastAPI uses REST. |
| **Database** | PostgreSQL | 15.x | Primary data storage for the application | Robust, reliable database provided by Supabase. |
| **Cache** | N/A for MVP | - | Speeding up data queries | Not required for MVP. Can integrate Redis in the future. |
| **File Storage** | Supabase Storage | Latest | Storing chart drawings, images | Natively integrated with Supabase, easy to use and manage permissions. |
| **Authentication** | Supabase Auth | Latest | User and session management | Core requirement from PRD, deeply integrated with PostgreSQL RLS. |
| **Frontend Testing** | Jest, RTL | Latest | Unit and integration testing for React components | Industry standard for React/Next.js applications. |
| **Backend Testing** | pgTAP, Pytest | Latest | Testing DB logic and API services | pgTAP for testing functions in Postgres. Pytest for FastAPI services. |
| **E2E Testing** | Playwright | Latest | End-to-end user flow testing | Provides a modern, robust solution for automating real user scenarios. |
| **Build Tool** | Vercel CLI / Next.js CLI | 14.x | Building and deploying the application | Default and optimized tools for the Next.js/Vercel ecosystem. |
| **Bundler** | Webpack | 5.x | Bundling assets for the frontend | Integrated and managed by Next.js. |
| **IaC Tool** | N/A for MVP | - | Managing infrastructure as code | Not necessary when using managed services like Vercel/Supabase. |
| **CI/CD** | GitHub Actions | - | Automating build, test, deploy pipeline | `.github` directory already exists, making it a natural choice. |
| **Monitoring** | Vercel Analytics & Sentry | Latest | Tracking application performance and errors | Vercel Analytics for Core Web Vitals. Sentry for proactive error tracking. |
| **Logging** | Vercel Logs | - | Capturing application and function logs | Natively integrated with the Vercel platform. |
| **CSS Framework** | Tailwind CSS | 3.x | Styling UI components | Established in the project, allows for rapid and consistent styling. |

---
