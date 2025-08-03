# Onboarding Summary

## Project Overview
The trading-system project is an **AI-Powered Trading Support System** built as a Next.js application with plans to evolve into a hybrid architecture with Python FastAPI backend services.

## Current State (August 2025)
- **Status:** MVP Development Phase
- **Architecture:** Frontend-only (Next.js 15 + Shadcn-ui dashboard template)
- **Authentication:** Currently uses Clerk (needs migration to Supabase Auth)
- **Database:** Not yet connected (will use Supabase PostgreSQL)
- **Backend:** Empty directory (future Python FastAPI services)

## Key Development Focus
The project is transitioning from a generic dashboard template to a specialized trading analysis platform with these core features:
1. **Interactive Analysis Reports** - Block-based visual journaling
2. **Asset & Methodology Management** - CRUD for trading instruments and strategies  
3. **Chart Integration** - Technical analysis with drawing tools
4. **Template System** - Reusable report structures

## Next Development Steps
Based on the PRD, the immediate priorities are:
1. **Epic 1:** Replace Clerk with Supabase Auth, build Asset/Methodology management
2. **Epic 2:** Build Report Management and Interactive Report Editor
3. **Epic 2.5:** Create FastAPI service for market data
4. **Epic 3:** Add Analysis Templates and Dashboard

## Development Environment
- **Primary:** `frontend/` directory with pnpm package manager
- **Scripts:** Use `pnpm dev`, `pnpm lint:fix`, `pnpm build`
- **Code Quality:** Automated via Husky + lint-staged
- **Documentation:** Comprehensive PRD and technical specs in `docs/`

## Important Notes
- Project uses feature-based organization under `frontend/src/features/`
- Follows Shadcn-ui patterns and Tailwind CSS
- TypeScript strict mode enabled
- Desktop-first responsive design approach