# 4. Technical Assumptions

## Repository Structure: Monorepo
The project will be structured as a monorepo.

## Service Architecture: BaaS-first, evolving to Hybrid
*   **MVP:** The initial architecture will be **Backend-as-a-Service (BaaS)**, heavily relying on **Supabase**.
*   **Future:** The architecture will evolve into a hybrid model with a **Python (FastAPI)** service.

## Testing Requirements: Unit + Integration
The project will implement Unit Testing and Integration Testing.

## Additional Technical Assumptions and Requirements
*   **Framework:** Next.js 15 App Router.
*   **Language:** TypeScript (strict mode).
*   **Component Library:** Shadcn-ui.
*   **Authentication Replacement:** Clerk will be replaced with Supabase Auth.
*   **API Layer:** a separate API abstraction layer will be created.

---
