# 12. Unified Project Structure

This section provides a high-level overview of the entire monorepo's directory structure. This structure is designed for clear separation of concerns and future scalability.

```plaintext
trading-system/
├── .github/                    # CI/CD Workflows (GitHub Actions)
├── docs/                       # Project Documentation
│   └── architecture.md         # This file
├── frontend/                   # Next.js Application
│   └── src/
│       ├── app/                # Routing, Layouts, and Pages
│       │   └── dashboard/
│       │       ├── assets/     # Route for Asset Management
│       │       ├── methodologies/ # Route for Methodology Management
│       │       └── reports/    # Route for Report Management
│       ├── components/         # General, reusable UI components
│       │   ├── ui/             # Primitive components from Shadcn
│       │   ├── layout/         # Layout components (sidebar, header)
│       │   └── charts/         # Wrapper for the charting library
│       ├── features/           # Logic and UI for specific features
│       │   ├── assets/
│       │   ├── methodologies/
│       │   └── reports/
│       ├── lib/                # Utility functions, clients
│       ├── stores/             # Zustand state management stores
│       └── middleware.ts       # Middleware for protecting routes
├── backend/                    # FastAPI Market Data Service
├── packages/                   # Shared packages within the monorepo
│   └── shared-types/           # Common TypeScript definitions
│       └── src/
├── supabase/                   # Supabase configuration and migrations
│   ├── migrations/             # SQL migration files for the DB schema
│   └── seed.sql                # (Optional) Seeding data
├── package.json                # Root project configuration and workspaces
├── pnpm-lock.yaml              # pnpm lock file
└── tsconfig.json               # Base TypeScript configuration
```

---
