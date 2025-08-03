# Codebase Structure

## Root Structure
```
trading-system/
├── frontend/          # Next.js application
├── backend/           # Future Python FastAPI service (empty)
├── docs/             # Project documentation
├── docs-vn/          # Vietnamese documentation  
├── .github/          # GitHub workflows and templates
├── .husky/           # Git hooks
├── .serena/          # Serena configuration
└── .vscode/          # VS Code settings
```

## Frontend Structure (Feature-based)
```
frontend/src/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth route group
│   │   ├── sign-in/       
│   │   └── sign-up/       
│   ├── (dashboard)/       # Dashboard route group
│   │   ├── overview/      # Parallel routes with @slots
│   │   ├── product/       # Product management
│   │   ├── profile/       # User profile (Clerk)
│   │   └── kanban/        # Kanban board demo
│   └── api/              # API routes
│
├── components/            # Shared components
│   ├── ui/               # Shadcn-ui components
│   ├── layout/           # Layout components (header, sidebar)
│   ├── kbar/             # Command palette
│   └── modal/            # Modal components
│
├── features/             # Feature-based modules
│   ├── auth/             # Authentication components
│   ├── products/         # Product management
│   ├── profile/          # Profile forms
│   ├── kanban/           # Kanban board
│   └── overview/         # Dashboard overview
│
├── lib/                  # Core utilities
│   ├── utils.ts          # Common utilities (cn, formatBytes)
│   ├── font.ts           # Font configurations
│   ├── format.ts         # Date formatting
│   ├── parsers.ts        # Data parsers
│   └── data-table.ts     # Table utilities
│
├── hooks/                # Custom React hooks
├── stores/               # Zustand stores  
├── types/                # TypeScript types
└── constants/            # App constants and mock data
```

## Key Configuration Files
- `frontend/package.json` - Dependencies and scripts
- `frontend/next.config.ts` - Next.js configuration
- `frontend/tsconfig.json` - TypeScript configuration
- `frontend/components.json` - Shadcn-ui configuration
- `.eslintrc.json` - ESLint rules
- `.prettierrc` - Prettier configuration