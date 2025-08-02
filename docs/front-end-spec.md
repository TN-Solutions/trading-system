# AI-Powered Trading Support System UI/UX Specification

This document defines the user experience goals, information architecture, user flows, and visual design specifications for AI-Powered Trading Support System's user interface. It serves as the foundation for visual design and frontend development, ensuring a cohesive and user-centered experience.

## Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-02 | 1.0 | Initial Draft | Sally (UX Expert) |

## 1. Overall UX Goals & Principles

### Target User Personas

*   **The Serious Learner:** Traders with less than 2 years of experience, actively seeking a consistent methodology. They need a structured framework for analysis, logging, and a way to control emotions and build confidence.
*   **The Part-time Pro:** Profitable but inconsistent traders who trade alongside a primary job. They need time-saving automation tools to help them find and fix small, performance-impacting leaks in their strategy.

### Usability Goals

*   **Efficiency of Use:** Allow traders to log their analysis with minimal friction, helping them quickly return to observing the market.
*   **Ease of Learning:** New users can complete the core journaling process in less than 5 minutes without detailed instructions.
*   **Habit Formation:** The interface must be engaging and valuable enough to encourage users to create at least 3 reports per week.
*   **Trust and Reliability:** Users must trust that their data is safe, secure, and that analyses are presented accurately.

### Design Principles

1.  **Clarity over Cleverness:** Prioritize clear communication and easy-to-understand data presentation over complex aesthetic design elements. The interface must be professional and focused.
2.  **Efficiency is Key:** Every interaction must be purposeful and optimized for speed. Minimize clicks and unnecessary steps.
3.  **Data-driven Confidence:** The design must highlight data and insights, helping users make informed decisions and feel in control.
4.  **Progressive Disclosure:** Only show what is necessary at the right time. Avoid overwhelming users by hiding advanced features or information until they are requested.

## 2. Information Architecture (IA)

### Site Map / Screen Inventory

```mermaid
graph TD
    subgraph (auth)
        A[Sign In]
        B[Sign Up]
    end

    subgraph (dashboard)
        C[Dashboard]
        D[Reports] --> D1[Report Editor: /reports/[reportId]]
        E[Assets]
        F[Methodologies]
        G[Account Settings]
    end

    A --> C
    B --> C
```

### Navigation Structure

*   **Primary Navigation (Main Sidebar):**
    *   A vertical navigation bar on the left side of the screen.
    *   Items include:
        *   Dashboard
        *   Reports (Report Management)
        *   Assets (Asset Management)
        *   Methodologies (Methodology Management)

*   **User Navigation (Top-Right Header):**
    *   A dropdown menu triggered by the user's avatar.
    *   Leverages the existing `nav-user.tsx` component.
    *   Items include:
        *   Account Settings
        *   Sign Out

*   **Breadcrumb Strategy:**
    *   Breadcrumbs will be displayed at the top of the main content area on all sub-pages.
    *   Example: `Home > Reports > Editing 'Analysis of EURUSD'`

## 3. User Flows

### User Flow: Create a New Analysis Report

*   **User Goal:** To quickly and easily log a complete trading analysis, including chart analysis and notes.
*   **Entry Points:** "New Report" button on the `Reports` management page.
*   **Success Criteria:** A new analysis report is successfully saved to the database with all user inputs.

#### Flow Diagram

```mermaid
graph TD
    A[User navigates to /reports] --> B{Clicks 'New Report'};
    B --> C[Modal appears: 'Create New Report'];
    C --> D[User enters Title, selects Asset & Methodology];
    D --> E{Clicks 'Create'};
    E --> F[Navigate to /reports/[newReportId]];
    F --> G[User adds analysis blocks];
    G --> H[For each block: User draws on chart & adds notes];
    H --> I{Clicks 'Save'};
    I --> J[Show success notification];
    J --> K[User returns to /reports page];

    E -- Validation Fails --> D;
    I -- Save Fails --> L[Show error notification];
```

#### Edge Cases & Error Handling:

*   **Validation Error:** If the user does not enter a title, the system will display an error message and prevent report creation.
*   **Save Error:** If there is an error during saving (e.g., network loss), the system will display a non-blocking error message and allow the user to retry. The state of the report will be preserved.
*   **Unsaved Changes:** If the user attempts to leave the edit page without saving, a confirmation dialog will appear to warn them about unsaved changes.

## 4. Wireframes & Mockups

*   **Primary Design Files:** All detailed wireframes and mockups will be created and maintained in **Figma**. A link to the Figma project will be provided here once it is set up.

### Key Screen Layouts

#### Screen: Reports Management Page (`/reports`)

*   **Purpose:** To provide users with an overview of all their analysis reports and allow them to manage them (create, view, edit, delete).
*   **Key Elements:**
    *   **Header:** Page title "Analysis Reports".
    *   **Primary Action:** A prominent "New Report" button.
    *   **Search/Filter:** A search bar to filter reports by title and dropdown filters for assets or methodologies.
    *   **Data Table:** A table displaying a list of reports with columns: `Title`, `Asset`, `Methodology`, `Last Modified`, and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Users can click on a row in the table to navigate to that report's editor.

#### Screen: Report Editor (`/reports/[reportId]`)

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

#### Screen: Dashboard (`/dashboard`)

*   **Purpose:** To provide a welcoming home page and a focused starting point for users after logging in.
*   **Key Elements (Initial Version):**
    *   **Welcome Message:** A personalized greeting (e.g., "Welcome back, John!").
    *   **Quick Stats:** Cards displaying simple statistics (e.g., "Total Reports Created", "Most Used Asset").
    *   **Quick Actions / Shortcuts:** Large, clear buttons to navigate to the most common actions, such as "Create New Report" or "View All Reports".
    *   **Recent Activity:** A list of the 5 most recently edited reports.
*   **Interaction Notes:** The dashboard should be designed modularly to easily add new widgets in the future.

#### Screen: Assets Management Page (`/assets`)

*   **Purpose:** To allow users to manage (CRUD) their list of trading assets (e.g., EUR/USD, BTC/USD, AAPL).
*   **Key Elements:**
    *   **Header:** Page title "Manage Assets".
    *   **Primary Action:** "New Asset" button.
    *   **Data Table:** A table displaying a list of assets with columns: `Asset Name` (e.g., EUR/USD), `Description` (optional), and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Creating and editing assets will use a modal dialog so users do not have to leave the page.

#### Screen: Methodologies Management Page (`/methodologies`)

*   **Purpose:** To allow users to manage (CRUD) their list of their own trading methodologies (e.g., 'Supply and Demand', 'ICT', 'Wyckoff').
*   **Key Elements:**
    *   **Header:** Page title "Manage Methodologies".
    *   **Primary Action:** "New Methodology" button.
    *   **Data Table:** A table displaying a list of methodologies with columns: `Methodology Name`, `Description` (optional), and an `Actions` column (Edit, Delete).
*   **Interaction Notes:** Similar to the Assets page, creation and editing will use a modal dialog.

## 5. Component Library / Design System

*   **Design System Approach:** We will strictly adhere to and extend the existing design system provided by **Shadcn-ui** and **Tailwind CSS**. All new UI components must be built by combining Shadcn-ui primitives or following its styling principles.

### Core Components

#### Component: Data Table

*   **Purpose:** To display tabular data in a structured way, supporting sorting, filtering, and pagination.
*   **Variants:** A reusable wrapper component will be created around `Tanstack Table` to standardize the look and behavior across the `Reports`, `Assets`, and `Methodologies` pages.
*   **States:** Loading, Empty, Error.

#### Component: Modal / Dialog

*   **Purpose:** To display content or action-requiring forms in an overlay without leaving the current page.
*   **Usage Guidelines:** Use for quick create/edit forms (e.g., New Asset, New Methodology) and confirmation dialogs (e.g., "Are you sure you want to delete?").

#### Component: Button

*   **Purpose:** To trigger an action or event.
*   **Variants:**
    *   `Primary`: For the main action on a page (e.g., "New Report", "Save").
    *   `Secondary`: For secondary actions.
    *   `Destructive`: For destructive actions (e.g., "Delete").
    *   `Link`: For navigation actions that look like text.
*   **States:** Default, Hover, Focused, Disabled.

#### Component: Form Controls (Input, Select, Textarea)

*   **Purpose:** To collect input data from users.
*   **Usage Guidelines:** Always associated with a clear `Label`. Use `Zod` and `React Hook Form` for validation.
*   **States:** Default, Focused, Disabled, Error.

#### Component: Card

*   **Purpose:** To group related content in a visual container.
*   **Usage Guidelines:** Use on the `Dashboard` to display statistics and widgets.

## 6. Branding & Style Guide

#### Visual Identity

*   **Brand Guidelines:** The interface will follow the modern, minimalist, professional aesthetic established by **Shadcn-ui**. The focus is on clarity, functionality, and reliability.

#### Color Palette

*   We will use the default **"Slate"** theme from Shadcn-ui as a base.
*   **Primary/Accent:** `primary` (Shadcn's default blue) will be used for primary action buttons, links, and elements needing attention.
*   **Destructive:** `destructive` (default red) will be used for delete actions and error messages.
*   **Neutral:** The `background`, `foreground`, `card`, `border` colors from the "Slate" theme will be used for text, borders, and backgrounds.

#### Typography

*   **Font Family:** **Inter**, as defined in `frontend/src/lib/font.ts`.
*   **Type Scale:**
    *   **H1 (Page Title):** 2.25rem (36px), Bold
    *   **H2 (Section Title):** 1.875rem (30px), Bold
    *   **H3 (Card Title):** 1.5rem (24px), Semi-Bold
    *   **Body:** 1rem (16px), Regular
    *   **Small/Caption:** 0.875rem (14px), Regular

#### Iconography

*   **Icon Library:** **Tabler Icons** (`@tabler/icons-react`), to ensure consistency with existing components.
*   **Usage Guidelines:** Icons should be used sparingly to support content comprehension, not for decoration.

#### Spacing & Layout

*   **Grid System:** The layout will be based on Flexbox and CSS Grid, provided by Tailwind CSS utility classes.
*   **Spacing Scale:** All spacing (margin, padding, gaps) must follow the default Tailwind CSS spacing scale (e.g., `p-4`, `m-8`, `gap-2`) to ensure visual consistency.

## 7. Accessibility Requirements

*   **Compliance Target:** The goal is to comply with **Web Content Accessibility Guidelines (WCAG) 2.1 Level AA**.

### Key Requirements

#### Visual

*   **Color Contrast:** All text must have a minimum contrast ratio of **4.5:1** against its background.
*   **Focus Indicators:** All interactive elements (links, buttons, input fields) must have a clear and visible focus indicator when navigated by keyboard. Shadcn-ui provides this by default.

#### Interaction

*   **Keyboard Navigation:** All functionality must be accessible and operable using only a keyboard. The navigation order must be logical and intuitive.
*   **Screen Reader Support:** Use ARIA (Accessible Rich Internet Applications) attributes as needed to provide context for screen reader users, especially for dynamic components.

#### Content

*   **Semantic HTML:** Use semantic HTML tags correctly (e.g., `<nav>` for navigation, `<main>` for main content, `<h1>`-`<h6>` for headings) to create a logical page structure.
*   **Form Labels:** All form input fields must be associated with a clear `<label>` tag.
*   **Alternative Text:** All meaningful images must have a descriptive `alt` attribute.

### Testing Strategy

*   Manual testing by navigating with only a keyboard.
*   Use automated tools like Lighthouse and axe DevTools to scan for common issues.
*   Test with BrowserTools MCP screen reader.

## 8. Responsiveness Strategy

*   **Approach:** The design will follow a **desktop-first** strategy, optimizing for large screens and then gracefully adapting to smaller screens like tablets and mobile phones.

### Breakpoints

*   We will use the default Tailwind CSS breakpoints:
    *   `sm`: 640px
    *   `md`: 768px
    *   `lg`: 1024px
    *   `xl`: 1280px

### Adaptation Patterns

*   **Layout Changes:**
    *   On smaller screens (`< 1024px`), multi-column layouts (e.g., on the Dashboard) will switch to a single column.
    *   Components will use `flex-wrap` to automatically wrap when there is not enough space.

*   **Navigation Changes:**
    *   On smaller screens (`< 1024px`), the main left sidebar will be hidden by default and can be toggled via a "hamburger" button in the header.

*   **Data Table Adaptation:**
    *   On narrow screens, Data Tables will allow horizontal scrolling to view all columns. The most important columns will be kept visible on the left.

*   **Interaction Changes:**
    *   The size of touch targets like buttons and links will be ensured to be large enough for easy use on touch devices.

## 9. Animation & Micro-interactions

*   **Motion Principles:** Motion should be used purposefully to provide feedback and guide the user, not for decoration. Animations should be fast, subtle, and non-intrusive.
*   **Key Animations:**
    *   **State Changes:** Use a light fade effect when elements appear or disappear.
    *   **Button Clicks:** Provide a subtle press effect to confirm interaction.
    *   **Modal/Dialog:** The dialog will appear with a slight zoom and fade effect.

## 10. Performance Considerations

*   **Page Load:** Optimize images and use Next.js features like dynamic imports to reduce initial load time.
*   **Interaction Response:** Ensure user interactions have immediate feedback (<100ms). Use loading states for asynchronous operations.
*   **Design Strategies:** Avoid using large images, videos, or complex animations that could slow down performance.

## 11. Next Steps

1.  **Review:** Share this document with stakeholders (PM, Architect, Devs) to gather feedback.
2.  **Visual Design:** Start creating detailed mockups in Figma based on the defined wireframes and style guide.
3.  **Handoff:** Prepare to hand off the designs and this document to the Frontend Architect to begin detailed technical architecture design.

## 12. Appendix

### Related Documents

*   [Product Requirements Document (PRD)](./prd.md)
*   [Project Brief](./brief.md)
*   [Market Research](./market-research.md)
*   [Brownfield Architecture](./template-architecture.md)
