# Next Shadcn Dashboard Starter - Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the **Next Shadcn Dashboard Starter** codebase. It serves as a reference for AI agents and developers working on the project. The project is a feature-rich starter template that will be evolved into a full-fledged product, including a future dedicated `backend` service for complex business logic.

### Document Scope

This is a comprehensive documentation of the entire existing `frontend` system.

### Change Log

| Date       | Version | Description                 | Author    |
| ---------- | ------- | --------------------------- | --------- |
| 2025-07-31 | 1.0     | Initial brownfield analysis | Winston (Architect) |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

- **Main Entry**: `frontend/app/layout.tsx` (Root layout, providers, theme setup)
- **Dashboard Entry**: `frontend/app/dashboard/layout.tsx` (Layout for all authenticated pages)
- **Configuration**: `next.config.ts`, `postcss.config.js`, `tsconfig.json`, `.env.example.txt`
- **Core Business Logic**: Centered in `frontend/features/` (e.g., `products`, `kanban`)
- **API Definitions**: Currently mocked in `frontend/constants/mock-api.ts`. Future API calls will be centralized.
- **Data Structures**: `frontend/types/index.ts` and `frontend/constants/data.ts`
- **Shared Utilities**: `frontend/lib/utils.ts`

## High Level Architecture

### Technical Summary

The project is a modern web application built on **Next.js 15** using the **App Router**. It heavily utilizes **React Server Components (RSCs)** for data fetching and server-side rendering, while interactive parts are built as **Client Components**. The architecture follows a **feature-sliced design**, with UI, logic, and components for each feature co-located within the `frontend/features` directory.

The current application is self-contained, but the long-term plan is to introduce a separate `backend` folder/service, turning this into a full-stack monorepo.

### Actual Tech Stack

| Category          | Technology            | Version (approx.) | Notes                                                              |
| ----------------- | --------------------- | ----------------- | ------------------------------------------------------------------ |
| Runtime           | Node.js               | 22.x              | Specified in `.nvmrc` and `package.json` engines.                  |
| Framework         | Next.js               | 15.3.2            | Using App Router, RSCs, and Server Actions.                        |
| Language          | TypeScript            | 5.7.2             | Strict typing is enforced.                                         |
| Styling           | Tailwind CSS          | 4.0.0             | Utility-first CSS framework.                                       |
| Component Library | Shadcn-ui             | -                 | Used for most UI components (`frontend/components/ui`).            |
| Authentication    | Clerk                 | ^6.12.12          | **PLANNED TO BE REPLACED** with **Supabase Auth**.                 |
| Data Fetching     | `fetch` (implicit)    | -                 | **PLANNED TO BE REPLACED** with **Axios** and an abstraction layer. |
| State Management  | Zustand               | ^5.0.2            | Used for client-side state, e.g., in the Kanban board feature.     |
| Forms             | React Hook Form & Zod | ^7.54.1 & ^3.24.1 | For form handling and validation.                                  |
| Tables            | Tanstack Table        | ^8.21.2           | For creating powerful data tables.                                 |
| Package Manager   | pnpm                  | -                 | Defined by `pnpm-lock.yaml`.                                       |

### Repository Structure Reality Check

- **Type**: Currently a single-package repository, but architected to become a **Monorepo** with the addition of a `backend` service.
- **Package Manager**: `pnpm`
- **Notable**: Strong conventions enforced by ESLint, Prettier, and Husky pre-commit hooks.

## Source Tree and Module Organization

### Project Structure (Actual)

```text
project-root/
├── frontend/
│   ├── app/             # Next.js App Router: Routes, layouts, pages.
│   │   ├── (auth)/      # Route group for authentication pages (Clerk).
│   │   └── (dashboard)/ # Route group for protected dashboard pages.
│   ├── components/      # Shared components (e.g., layout, UI primitives from Shadcn).
│   ├── features/        # **CORE LOGIC**: Feature-sliced modules (e.g., products, kanban).
│   ├── hooks/           # Shared custom React hooks.
│   ├── lib/             # Core utilities (utils, fonts, etc.).
│   ├── types/           # Global TypeScript type definitions.
│   └── middleware.ts    # Handles request middleware, currently for Clerk auth.
├── docs/                # Project documentation.
└── public/              # Static assets.
```
*(A `backend/` folder will be added here in the future.)*

### Key Modules and Their Purpose

- **Authentication**: `frontend/app/(auth)/`, `middleware.ts`. Currently handled by **Clerk**. The middleware protects dashboard routes. This will be refactored to use **Supabase**.
- **Dashboard & Layout**: `frontend/app/dashboard/layout.tsx` provides the main structure with a sidebar and header for the authenticated part of the app. `frontend/components/layout/` contains the reusable layout components.
- **Feature Modules (`/features`)**: This is the heart of the application. Each sub-directory (e.g., `products`, `kanban`, `profile`) is a self-contained feature with its own components, logic, and types. This is the primary pattern for adding new functionality.
- **UI Components (`/components/ui`)**: These are the base building blocks from **Shadcn-ui**, such as `Button`, `Card`, `Input`, etc. They should be used for all new UI development to maintain consistency.
- **State Management (Zustand)**: Used for complex client-side state that is difficult to manage with props alone. Its primary use case is in the **Kanban** feature (`frontend/features/kanban/utils/store.ts`) to manage the state of columns and tasks during drag-and-drop operations. Its broader role in the application is yet to be defined.

## Data Models and APIs

### Data Models

There is currently **no database connected**. Data structures are defined as TypeScript types and interfaces.
- **Primary Types**: See `frontend/types/index.ts`.
- **Example Data Structures**: See `frontend/constants/data.ts` for the shape of data like `Product`.

### API Specifications

- **Current State**: The application uses a **mock API** located in `frontend/src/constants/mock-api.ts`. This simulates fetching data for features like the product list.
- **Future Architecture**: A dedicated **API abstraction layer** will be created. This layer will use **Axios** to communicate with the future `backend` service. All data fetching logic within components will call this abstraction layer instead of the mock API.

## Technical Debt and Known Issues

### Critical Technical Debt

1.  **Mock Data Layer**: The entire data persistence and fetching mechanism is mocked. This is the highest priority item to be replaced with real API calls to a backend.
2.  **Auth Implementation**: The current **Clerk** implementation is functional but will be entirely replaced by **Supabase Auth**. This will require significant refactoring in the middleware, auth pages, and components that use user data.

### Workarounds and Gotchas

- **State Management**: The role of Zustand is not fully defined across the application. Developers should be cautious about introducing new global stores without a clear architectural decision. For now, its use is localized to the Kanban feature.

## Integration Points and External Dependencies

### External Services

| Service | Purpose        | Integration Type | Key Files                               | Notes                               |
| ------- | -------------- | ---------------- | --------------------------------------- | ----------------------------------- |
| Clerk   | Authentication | SDK / Components | `middleware.ts`, `app/(auth)/**`        | **To be replaced by Supabase.**     |
| Sentry  | Error Tracking | SDK              | `instrumentation.ts`, `next.config.ts`  | Captures and reports errors.        |

## Development and Deployment

### Local Development Setup

1.  Clone the repository.
2.  Run `pnpm install`.
3.  Copy `env.example.txt` to `.env.local` and fill in the required environment variables (currently for Clerk).
4.  Run `pnpm run dev` to start the development server at `http://localhost:3000`.

### Build and Deployment Process

- **Build Command**: `pnpm run build`
- **Deployment**: The project is configured for Vercel/Netlify style deployments, but specific deployment scripts are not yet defined.

## Testing Reality

### Current Test Coverage

Currently, the project **does not contain any automated tests** (unit, integration, or E2E).

### Quality Assurance

Code quality is maintained through:
- **Linting**: `pnpm run lint` (ESLint)
- **Formatting**: `pnpm run format` (Prettier)
- **Pre-commit Hooks**: Husky runs lint-staged to format code before committing.

## Appendix - Useful Commands and Scripts

### Frequently Used Commands

```bash
# Start development server with Turbopack
pnpm run dev

# Create a production build
pnpm run build

# Start the production server
pnpm run start

# Run linter
pnpm run lint

# Fix linting and formatting issues
pnpm run lint:fix

# Format all files with Prettier
pnpm run format
```
