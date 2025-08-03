# Suggested Commands

## Development Commands (Frontend)
```bash
# Navigate to frontend directory first
cd frontend/

# Install dependencies
pnpm install

# Development server with Turbopack
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

## Code Quality Commands
```bash
# Linting
pnpm lint                # Run ESLint
pnpm lint:fix           # Run ESLint with auto-fix + format
pnpm lint:strict        # ESLint with max 0 warnings

# Formatting
pnpm format             # Format with Prettier
pnpm format:check       # Check formatting without changes
```

## Git and Pre-commit
```bash
# Prepare Husky hooks
pnpm prepare

# Manual pre-commit check (runs automatically on commit)
# Processes: *.{js,jsx,tsx,ts,css,less,scss,sass}
# With: prettier --write --no-error-on-unmatched-pattern
```

## Project Management
```bash
# From project root - explore structure
ls -la                  # View root directories
cd frontend && ls -la   # View frontend structure
cd docs && ls -la       # View documentation
```

## Task Completion Workflow
After completing any development task:
1. `pnpm lint:fix` - Fix linting issues and format code
2. `pnpm build` - Ensure build succeeds
3. Test the changes manually
4. Commit changes (pre-commit hooks will run automatically)

## Common File Locations
- **Components:** `frontend/src/components/ui/` (Shadcn-ui)
- **Features:** `frontend/src/features/[feature-name]/`
- **Pages:** `frontend/src/app/` (App Router)
- **Utilities:** `frontend/src/lib/`
- **Types:** `frontend/src/types/`
- **Documentation:** `docs/`