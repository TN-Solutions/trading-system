# Product Requirements Document (PRD) for AI-Powered Trading Support System

## 1. Objectives and Context

### Objectives

*   Attract 500 weekly active users within 3 months of MVP launch.
*   Achieve a 5% conversion rate from free to paid users within 6 months.
*   Collect over 2,000 high-quality Analysis Reports within 6 months for AI training.
*   Build user habits, with the top 25% of users creating over 3 reports per week.
*   Achieve a 20% Week 4 user retention rate.

### Context

Retail traders currently face a major challenge: they have access to a vast amount of data but lack an effective process to consistently translate that information into performance improvement. Current journaling methods are often manual, cumbersome, and disconnected from trading outcomes, making it difficult to learn from mistakes or identify successful patterns.

This product addresses this problem by providing an AI-Personalized Trading Assistant. The core of the solution is a smart, visual-first journaling platform that allows traders to easily and systematically log their analyses and trading decisions. In the long term, this data will be used to train AI models to provide deeply personalized feedback and insights tailored to each user's unique trading style and psychology.

### Change Log

| Date       | Version | Description                       | Author    |
| :--------- | :------ | :-------------------------------- | :-------- |
| 2025-08-01 | 1.0     | First draft from Project Brief | John (PM) |

---

## 2. Requirements

### Functional Requirements

**Group 1: Platform & Initial Setup**
*   **FR1:** The system must provide user authentication functionality (registration, login, logout).
*   **FR2:** Users must be able to manage (CRUD) a list of **trading assets** (e.g., EUR/USD, BTC/USD) for use in analysis reports.
*   **FR3:** Users must be able to manage (CRUD) a list of their own **trading methodologies** (e.g., 'Supply and Demand', 'ICT') to tag and categorize analyses.

**Group 2: Core Workflow - Analysis Report**
*   **FR4:** Users must have a **report management page** to view, create, edit, and delete (CRUD) their "Analysis Reports."
*   **FR5:** There must be an "Interactive Analysis Report" feature as the centerpiece of the MVP.
*   **FR6:** The report must support a dynamic "block" system, allowing users to add multiple blocks for analysis across different timeframes within the same report.
*   **FR7:** Each analysis block must integrate a charting library to allow for visual technical analysis.
*   **FR8:** The chart must provide basic drawing tools, including **Trendline** and **Rectangle (support/resistance zone)**.
*   **FR9:** Each analysis block must have a dedicated area for users to enter text notes.

**Group 3: Supporting Features & Storage**
*   **FR10:** Users must be able to create and reuse "Analysis Templates" to speed up the journaling process.
*   **FR11:** The system must reliably store all user-generated content (structured data, chart drawing objects, notes).

### Non-Functional Requirements

*   **NFR1:** The application must be built as a web application on the existing Next.js platform.
*   **NFR2:** The MVP will use **Supabase** for core CRUD operations and user authentication to accelerate development.
*   **NFR3:** User data must be stored in Supabase's PostgreSQL database.
*   **NFR4:** The system must leverage Supabase's built-in security features, including Row Level Security, to ensure user data is completely isolated and private.
*   **NFR5:** The user interface must be designed with a desktop-first approach.
*   **NFR6:** The MVP must be completed within a 3-4 month timeframe.

---

## 3. User Interface Design Goals

### Overall UX Vision
The user experience must be clean, professional, and efficient. The interface should prioritize clarity and speed, allowing traders to log their analysis with minimal friction. The focus is on a powerful tool, not an entertainment application. The interface must feel trustworthy and precise.

### Key Interaction Models
*   **Block-based Interactive Report:** Users will build their reports by adding, deleting, and arranging analysis "blocks." This is the core interaction model.
*   **Direct Chart Manipulation:** Users will interact directly with the chart to draw trendlines and zones, making the analysis process intuitive.
*   **Contextual Input:** Input fields for notes and structured data will be placed right next to the corresponding chart, maintaining context.
*   **Use of Modals:** CRUD actions for secondary items (like Assets, Methodologies) will use modals so users do not have to leave their main workspace.

### Core Screens and Views
*   **Login / Registration Page:** A simple interface for user authentication.
*   **Dashboard:** The main screen after login. It will display summary statistics and data visualizations. (The initial version can be simple).
*   **Analysis Report Management Page:** A dedicated page for managing (CRUD) analysis reports. This will be a main menu item.
*   **Asset Management Page:** A separate page allowing users to perform CRUD operations on their list of trading assets. This page will be a main menu item in the navigation.
*   **Methodology Management Page:** A separate page allowing users to perform CRUD operations on their list of trading methodologies. This will also be a main menu item.
*   **Analysis Report Editor:** The screen where users build and edit detailed reports.

### Accessibility: WCAG AA
We will aim to comply with the Web Content Accessibility Guidelines (WCAG) Level AA.

### Branding
The interface will adhere to the modern, minimalist aesthetic established by **Shadcn-ui** and Tailwind CSS.

### Target Devices and Platforms: Responsive Web (Desktop First)
The application will be built as a responsive web app, but the desktop experience will be prioritized and optimized.

---

## 4. Technical Assumptions

### Repository Structure: Monorepo
The project will be structured as a monorepo.

### Service Architecture: BaaS-first, evolving to Hybrid
*   **MVP:** The initial architecture will be **Backend-as-a-Service (BaaS)**, heavily relying on **Supabase**.
*   **Future:** The architecture will evolve into a hybrid model with a **Python (FastAPI)** service.

### Testing Requirements: Unit + Integration
The project will implement Unit Testing and Integration Testing.

### Additional Technical Assumptions and Requirements
*   **Framework:** Next.js 15 App Router.
*   **Language:** TypeScript (strict mode).
*   **Component Library:** Shadcn-ui.
*   **Authentication Replacement:** Clerk will be replaced with Supabase Auth.
*   **API Layer:** a separate API abstraction layer will be created.

---

## 5. Epic List

*   **Epic 1: Platform, Authentication & Basic Data Management**
    *   **Goal:** Establish the technical foundation, replace Clerk with Supabase Auth, and build the management (CRUD) pages for **Assets** and **Methodologies**.
*   **Epic 2: Core Journaling Functionality & Report Management**
    *   **Goal:** Build the central feature of the product: the **Report Management Page** and the **Interactive Report Editor**.
*   **Epic 3: Workflow Optimization & UI Finalization**
    *   **Goal:** Introduce the **Analysis Template** feature and build the initial interface for the **Dashboard**.

---

## 6. Epic Details

### Epic 1: Platform, Authentication & Basic Data Management
*   **Story 1.1: Migrate Authentication from Clerk to Supabase Auth**
    *   **As a** new user, **I want** to be able to register and log in securely using Supabase, **so that** my account and data are protected.
    *   **Acceptance Criteria:** Clerk is removed, Supabase Auth is integrated, middleware is updated, users can register/login/logout.
*   **Story 1.2: Build Asset Management Page**
    *   **As a** trader, **I want** to be able to CRUD trading assets, **so that** I can easily select them when creating reports.
    *   **Acceptance Criteria:** Has a `/assets` page, displays a data table, has an add/edit/delete form, connects to Supabase DB, has RLS.
*   **Story 1.3: Build Methodology Management Page**
    *   **As a** trader, **I want** to be able to CRUD trading methodologies, **so that** I can tag my analyses.
    *   **Acceptance Criteria:** Has a `/methodologies` page, displays a data table, has an add/edit/delete form, connects to Supabase DB, has RLS.

### Epic 2: Core Journaling Functionality & Report Management
*   **Story 2.1: Build Report Management Page**
    *   **As a** trader, **I want** a page to see all my reports, **so that** I can track my work.
    *   **Acceptance Criteria:** Has a `/reports` page, displays a list of reports, has a create new button, has edit/delete options.
*   **Story 2.2: Set up Interactive Report Editor**
    *   **As a** trader, **I want** a block-based editor, **so that** I can structure my analysis.
    *   **Acceptance Criteria:** Has an edit page `/reports/[reportId]`, allows adding/deleting blocks, entering a title, selecting asset/methodology, has a save button.
*   **Story 2.3: Integrate Chart and Drawing Tools**
    *   **As a** trader, **I want** an interactive chart with drawing tools, **so that** I can perform technical analysis.
    *   **Acceptance Criteria:** Chart library is integrated, displays candle data, has Trendline/Rectangle drawing tools, drawn objects are saved.

### Epic 2.5: Build and Integrate Market Data API
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

### Epic 3: Workflow Optimization & UI Finalization
*   **Story 3.1: Build Analysis Template Functionality**
    *   **As a** trader, **I want** to save a report structure as a template, **so that** I can quickly start a new analysis.
    *   **Acceptance Criteria:** Has a "Save as Template" button, saves the structure to the DB, allows creating a new report from a template.
*   **Story 3.2: Set up Initial Dashboard**
    *   **As a** user, **I want** a welcome dashboard, **so that** I have a focused starting point.
    *   **Acceptance Criteria:** Has a `/dashboard` page, displays a welcome message, has navigation shortcuts, simple interface.

---

## 7. Checklist Result Report

| Item | Status | Notes |
| :--- | :--- | :--- |
| **1. Overview & Objectives** | | |
| 1.1. Is the problem clearly defined? | ✅ Pass | The problem of lacking effective journaling tools is clearly stated in the Context section. |
| 1.2. Are the objectives specific, measurable (SMART)? | ✅ Pass | Both business and user objectives have specific metrics. |
| 1.3. Is the target user identified? | ✅ Pass | The PRD references "Serious Learners" and "Part-time Pros". |
| **2. Requirements & Scope** | | |
| 2.1. Are the functional requirements clear? | ✅ Pass | Functional requirements are divided into logical groups. |
| 2.2. Are non-functional requirements stated? | ✅ Pass | Technical, security, and performance requirements have been identified. |
| 2.3. Is the MVP scope clearly defined? | ✅ Pass | The PRD focuses entirely on Phase 1, with AI out of scope. |
| **3. Detail & Clarity** | | |
| 3.1. Are the Epics logical and sequential? | ✅ Pass | The 3 Epics are structured in a logical development flow. |
| 3.2. Are the user stories clear? | ✅ Pass | Each story follows the "As a..., I want..., so that..." format. |
| 3.3. Are the acceptance criteria verifiable? | ✅ Pass | The acceptance criteria are specific and verifiable. |
| **4. Alignment** | | |
| 4.1. Is the PRD consistent with source documents? | ✅ Pass | The PRD is closely aligned with the source documents. |
| 4.2. Are technical assumptions documented? | ✅ Pass | The "Technical Assumptions" section documents key decisions. |

---

## 8. Next Steps

*   **For the Architect:** Begin the "Create Architecture" process, using this PRD to design the detailed technical architecture.
*   **For the UX Expert:** Begin the process of designing detailed wireframes/mockups for the main screens.

---

## 9. Appendix

### Open Questions
*   A specific charting library needs to be identified.
*   The data flow for candlestick data for the chart needs to be clarified.

### Out of Scope
*   All features related to AI/LLM.
*   Detailed statistical dashboards.
*   Integration with brokers.
*   Notifications and alerts.
*   Community features.

### References
*   `docs/brief.md`
*   `docs/market-research.md`
*   `docs/brainstorming-session-results.md`
*   `docs/brownfield-architecture.md`
