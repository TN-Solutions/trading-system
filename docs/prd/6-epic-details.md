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

## Epic 2.5: Build Custom Market Data System via MT5
*   **Goal:** Build, test, and deploy an internal FastAPI service to provide and ingest candlestick data from a custom MetaTrader 5 (MT5) Expert Advisor (EA).
*   **Story 2.5.1: Initialize FastAPI Service from Template**
    *   **As a** developer, **I want** to set up a new FastAPI application using the existing template in the `backend/` directory, **so that** a foundation for the market data service is quickly created.
    *   **Acceptance Criteria:** The template is used, `backend/` directory is configured, FastAPI is running, has a working `/health` endpoint, Docker configuration is functional for local development.
*   **Story 2.5.2: Build Candlestick Data Ingestion Endpoint**
    *   **As a** developer, **I want** to build a secure `POST /api/v1/candles` endpoint to receive and store OHLC data from an external MT5 EA, **so that** the system can be populated with custom market data.
    *   **Acceptance Criteria:** The endpoint is created and secured. It correctly validates and parses incoming data. Data is successfully stored in the `market_data` table.
*   **Story 2.5.3: Build Candlestick Data Query Endpoint**
    *   **As a** developer, **I want** to create a `GET /api/v1/candles` endpoint that accepts `symbol`, `resolution`, `from`, `to` parameters, **so that** it can query and return candlestick data from the `market_data` table.
    *   **Acceptance Criteria:** The endpoint works, returns data in the format required by the charting library, has error handling for when data is not found.
*   **Story 2.5.4: Develop MT5 Expert Advisor for Data Export**
    *   **As a** developer, **I want** to create an Expert Advisor for MT5 that reads chart data (OHLC) and sends it to the FastAPI ingestion endpoint, **so that** real-time and historical data can be fed into the system.
    *   **Acceptance Criteria:** The EA is written in MQL5. It can be attached to a chart in MT5. It successfully sends data to the `POST /api/v1/candles` endpoint. API credentials are managed securely.
*   **Story 2.5.5: Deploy and Secure API Service**
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
