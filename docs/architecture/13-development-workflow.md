# 13. Development Workflow

This section defines the setup and daily workflow for developers on this monorepo project.

## 13.1. Local Environment Setup

#### Prerequisites

A developer needs the following tools installed on their machine:
*   Node.js (LTS version recommended, e.g., 20.x)
*   pnpm (the project's primary package manager)
*   Git
*   Supabase CLI (for local database management)

#### Initial Setup

1.  **Clone Repository:**
    ```bash
    git clone <repository_url>
    cd trading-system
    ```
2.  **Install Dependencies:**
    ```bash
    pnpm install
    ```
3.  **Setup Supabase Local:**
    *   Start the Supabase Docker containers:
        ```bash
        supabase start
        ```
    *   Apply the latest migrations to create the database schema:
        ```bash
        supabase db reset
        ```
4.  **Configure Environment Variables:**
    *   Copy the `env.example.txt` file in `frontend/` to `.env.local`.
    *   Fill in the necessary values in `.env.local`, especially the `SUPABASE_URL` and `SUPABASE_ANON_KEY` provided by the `supabase start` command.

#### Development Commands

*   **Run the entire application (Frontend):**
    ```bash
    pnpm --filter frontend dev
    ```
*   **Run Linting to check code quality:**
    ```bash
    pnpm lint
    ```
*   **Run Tests:**
    ```bash
    pnpm test
    ```

## 13.2. Git Workflow

The project will follow a simple Git Flow process:

1.  **Create a New Branch:** All work must be done on a new feature branch created from the `main` branch.
    *   **Branch Naming Convention:** `feature/<ticket_id>-short-description` (e.g., `feature/PROJ-123-create-report-editor`)
2.  **Commit Frequently:** Make small, purposeful commits.
    *   **Commit Message Convention:** Follow [Conventional Commits](https://www.conventionalcommits.org/). (e.g., `feat(reports): add save button to editor`)
3.  **Create a Pull Request (PR):** When the feature is complete, create a Pull Request targeting the `main` branch.
4.  **Code Review:** At least one other team member must review and approve the PR.
5.  **Merge:** Once approved and all CI/CD checks have passed, the PR will be merged into `main`.

---

## 13.3. AI Agent Tooling (MCPs)

To enhance development with AI agents, the following Model Control Programs (MCPs) can be used. These provide agents with tools to interact with the development environment and external services. Run these commands in separate terminals to activate the tools for the agent.

| Tool | Description | Command | Status |
| :--- | :--- | :--- | :--- |
| **Context7** | Provides the agent with up-to-date documentation and context about code libraries. | `npx -y @upstash/context7-mcp`
| **Playwright** | Enables the agent to run End-to-End (E2E) tests to simulate and verify user workflows. | `npx @playwright/mcp@latest`
| **Serena** | The core MCP for IDE-level code manipulation and project interaction. | `uvx --from git+https://github.com/oraios/serena serena-mcp-server --context ide-assistant`
| **Supabase** | Allows the agent to interact with and manage the Supabase backend (database, auth, etc.). | `npx -y @supabase/mcp-server-supabase@latest`
| **Browser Tools**| Gives the agent general capabilities to control and interact with a web browser. | `npx @agentdeskai/browser-tools-mcp@latest`
