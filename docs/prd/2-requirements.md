# 2. Requirements

## Functional Requirements

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

## Non-Functional Requirements

*   **NFR1:** The application must be built as a web application on the existing Next.js platform.
*   **NFR2:** The MVP will use **Supabase** for core CRUD operations and user authentication to accelerate development.
*   **NFR3:** User data must be stored in Supabase's PostgreSQL database.
*   **NFR4:** The system must leverage Supabase's built-in security features, including Row Level Security, to ensure user data is completely isolated and private.
*   **NFR5:** The user interface must be designed with a desktop-first approach.
*   **NFR6:** The MVP must be completed within a 3-4 month timeframe.

---
