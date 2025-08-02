# 2. Information Architecture (IA)

## Site Map / Screen Inventory

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

## Navigation Structure

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
