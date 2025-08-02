# 4. Wireframes & Mockups

*   **Primary Design Files:** All detailed wireframes and mockups will be created and maintained in **Figma**. A link to the Figma project will be provided here once it is set up.

## Key Screen Layouts

### Screen: Reports Management Page (`/reports`)

*   **Purpose:** To provide users with an overview of all their analysis reports and allow them to manage them (create, view, edit, delete).
*   **Key Elements:**
    *   **Header:** Page title "Analysis Reports".
    *   **Primary Action:** A prominent "New Report" button.
    *   **Search/Filter:** A search bar to filter reports by title and dropdown filters for assets or methodologies.
    *   **Data Table:** A table displaying a list of reports with columns: `Title`, `Asset`, `Methodology`, `Last Modified`, and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Users can click on a row in the table to navigate to that report's editor.

### Screen: Report Editor (`/reports/[reportId]`)

*   **Purpose:** To provide the main workspace for users to create and edit a detailed analysis report.
*   **Key Elements:**
    *   **Header:** Displays the report's title and breadcrumbs for navigation.
    *   **Main Action Buttons:** "Save", "Save as Template", and possibly "Delete" buttons placed in a visible location.
    *   **Analysis Blocks Area:** The main area of the page where users can add, arrange, and delete analysis blocks.
    *   **Analysis Block:** Each block contains:
        *   A large interactive chart window.
        *   Chart drawing tools (Trendline, Rectangle).
        *   A text input area for notes.
*   **Interaction Notes:** Blocks can be dragged and dropped to be rearranged.

### Screen: Dashboard (`/dashboard`)

*   **Purpose:** To provide a welcoming home page and a focused starting point for users after logging in.
*   **Key Elements (Initial Version):**
    *   **Welcome Message:** A personalized greeting (e.g., "Welcome back, John!").
    *   **Quick Stats:** Cards displaying simple statistics (e.g., "Total Reports Created", "Most Used Asset").
    *   **Quick Actions / Shortcuts:** Large, clear buttons to navigate to the most common actions, such as "Create New Report" or "View All Reports".
    *   **Recent Activity:** A list of the 5 most recently edited reports.
*   **Interaction Notes:** The dashboard should be designed modularly to easily add new widgets in the future.

### Screen: Assets Management Page (`/assets`)

*   **Purpose:** To allow users to manage (CRUD) their list of trading assets (e.g., EUR/USD, BTC/USD, AAPL).
*   **Key Elements:**
    *   **Header:** Page title "Manage Assets".
    *   **Primary Action:** "New Asset" button.
    *   **Data Table:** A table displaying a list of assets with columns: `Asset Name` (e.g., EUR/USD), `Description` (optional), and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Creating and editing assets will use a modal dialog so users do not have to leave the page.

### Screen: Methodologies Management Page (`/methodologies`)

*   **Purpose:** To allow users to manage (CRUD) their list of their own trading methodologies (e.g., 'Supply and Demand', 'ICT', 'Wyckoff').
*   **Key Elements:**
    *   **Header:** Page title "Manage Methodologies".
    *   **Primary Action:** "New Methodology" button.
    *   **Data Table:** A table displaying a list of methodologies with columns: `Methodology Name`, `Description` (optional), and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Similar to the Assets page, creation and editing will use a modal dialog.
