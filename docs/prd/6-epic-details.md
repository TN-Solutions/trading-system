# 6. Epic Details

## Epic 1: Platform, Authentication & Basic Data Management
*   **Story 1.1: Migrate Authentication from Clerk to Supabase Auth**
    *   **As a** new user, **I want** to be able to register and log in securely using Supabase, **so that** my account and data are protected.
    *   **Acceptance Criteria:** Clerk is removed, Supabase Auth is integrated, middleware is updated, users can register/login/logout.
*   **Story 1.2: Build Asset Management Page**
    *   **As a** trader, **I want** to be able to CRUD trading assets, **so that** I can easily select them when creating reports.
    *   **Acceptance Criteria:** Has a `/assets` page, displays a data table, has an add/edit/delete form, connects to Supabase DB, has RLS.
*   **Story 1.3: Build Methodology Management Page**
    *   **As a** trader, **I want** to be able to CRUD trading methodologies, **so that** I can tag my analyses.
    *   **Acceptance Criteria:** Has a `/methodologies` page, displays a data table, has an add/edit/delete form, connects to Supabase DB, has RLS.

## Epic 2: Core Journaling Functionality & Report Management
*   **Story 2.1: Build Report Management Page**
    *   **As a** trader, **I want** a page to see all my reports, **so that** I can track my work.
    *   **Acceptance Criteria:** Has a `/reports` page, displays a list of reports, has a create new button, has edit/delete options.
*   **Story 2.2: Set up Interactive Report Editor**
    *   **As a** trader, **I want** a block-based editor, **so that** I can structure my analysis.
    *   **Acceptance Criteria:** Has an edit page `/reports/[reportId]`, allows adding/deleting blocks, entering a title, selecting asset/methodology, has a save button.
*   **Story 2.3: Integrate Chart and Drawing Tools**
    *   **As a** trader, **I want** an interactive chart with drawing tools, **so that** I can perform technical analysis.
    *   **Acceptance Criteria:** Chart library is integrated, displays candle data, has Trendline/Rectangle drawing tools, drawn objects are saved.

## Epic 2.5: Build and Integrate Market Data API
*   **Goal:** Build, test, and deploy an internal FastAPI service to provide candlestick data for the chart components, including the data ingestion process.
*   **Story 2.5.1: Create Market Data Ingestion Script**
    *   **As a** developer, **I want** a script that can fetch historical candlestick data from a public API (e.g., Finnhub.io) and save it to a `market_data` table in the PostgreSQL database, **so that** the system has a data source for analysis.
    *   **Acceptance Criteria:** A new `market_data` table is created in the DB. The script can be run manually, taking a symbol and time range as parameters. Data is stored successfully. API key is managed securely via environment variables.
*   **Story 2.5.2: Design and Initialize FastAPI Service**
    *   **As a** developer, **I want** to set up a new FastAPI application in the `backend/` directory with basic endpoints, **so that** a foundation for the market data service is created.
    *   **Acceptance Criteria:** `backend/` directory is created, FastAPI is installed, has a working `/health` endpoint, Docker configuration for local running.
*   **Story 2.5.3: Build Candlestick Data Endpoint**
    *   **As a** developer, **I want** to create a `GET /api/v1/candles` endpoint that accepts `symbol`, `resolution`, `from`, `to` parameters, **so that** it can query and return candlestick data from the `market_data` table.
    *   **Acceptance Criteria:** The endpoint works, returns data in the format required by the charting library, has error handling for when data is not found.
*   **Story 2.5.4: Deploy and Secure API Service**
    *   **As a** developer, **I want** to deploy the FastAPI service to a serverless environment (e.g., Vercel Functions) and secure it, **so that** the frontend can call it safely.
    *   **Acceptance Criteria:** The service is deployed, has a public URL, is only accessible from the frontend application's domain, has a CI/CD pipeline for automatic deployment on changes.

## Epic 3: Workflow Optimization & UI Finalization
*   **Story 3.1: Build Analysis Template Functionality**
    *   **As a** trader, **I want** to save a report structure as a template, **so that** I can quickly start a new analysis.
    *   **Acceptance Criteria:** Has a "Save as Template" button, saves the structure to the DB, allows creating a new report from a template.
*   **Story 3.2: Set up Initial Dashboard**
    *   **As a** user, **I want** a welcome dashboard, **so that** I have a focused starting point.
    *   **Acceptance Criteria:** Has a `/dashboard` page, displays a welcome message, has navigation shortcuts, simple interface.

---
