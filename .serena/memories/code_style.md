# Code Style and Conventions

## TypeScript Configuration
- **Strict mode enabled** - All TypeScript strict checks are enforced
- **File naming:** kebab-case for files, PascalCase for components
- **Import organization:** External imports first, then internal imports

## Code Formatting (Prettier)
```json
{
  "arrowParens": "always",
  "bracketSpacing": true,
  "semi": true,
  "useTabs": false,
  "trailingComma": "none",
  "jsxSingleQuote": true,
  "singleQuote": true,
  "tabWidth": 2,
  "endOfLine": "lf",
  "plugins": ["prettier-plugin-tailwindcss"]
}
```

## ESLint Rules
- **Base:** Next.js core web vitals
- **Plugins:** @typescript-eslint
- **Key rules:**
  - `@typescript-eslint/no-unused-vars: "warn"`
  - `no-console: "warn"`
  - `react-hooks/exhaustive-deps: "warn"`

## Component Patterns
- **Function components** with TypeScript interfaces
- **Props interfaces** named `ComponentNameProps`
- **Shadcn-ui patterns** - forwardRef with displayName
- **Feature-based organization** - components grouped by feature

## Naming Conventions
- **Components:** PascalCase (e.g., `ProductTable`, `UserAuthForm`)
- **Hooks:** camelCase starting with `use` (e.g., `useDebounce`, `useIsMobile`)
- **Types:** PascalCase (e.g., `ProductFormValues`, `DataTableConfig`)
- **Constants:** SCREAMING_SNAKE_CASE (e.g., `MOBILE_BREAKPOINT`)
- **Files:** kebab-case (e.g., `user-auth-form.tsx`, `data-table.tsx`)

## Import Patterns
```typescript
// External libraries first
import React from 'react'
import { Button } from '@/components/ui/button'

// Internal imports
import { cn } from '@/lib/utils'
import { UserNav } from './user-nav'
```

## Pre-commit Hooks
- **Husky** runs on commit
- **lint-staged** processes staged files
- **Prettier** formats code automatically
- **ESLint** with auto-fix where possible