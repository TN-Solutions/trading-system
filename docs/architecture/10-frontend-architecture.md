# 10. Frontend Architecture

This section defines the specific architectural details for the Next.js application, adhering strictly to the established directory structure.

## 10.1. Routing and Component Architecture

We will follow and extend the established pattern.

**1. Route Definition in `app`:**

*   **Report Management:**
    *   Create directory `frontend/src/app/dashboard/reports/`.
    *   Its `page.tsx` will be responsible for fetching the list of reports and then rendering the `ReportListingView` component from `features`.
*   **Report Editor:**
    *   Create directory `frontend/src/app/dashboard/reports/[reportId]/`.
    *   Its `page.tsx` will fetch data for a specific report based on `reportId` and render the `ReportEditorView` component from `features`.
*   **Asset Management:**
    *   Create directory `frontend/src/app/dashboard/assets/`.
    *   Its `page.tsx` will fetch and render the `AssetManagementView` from `features`.
*   **Methodology Management:**
    *   Create directory `frontend/src/app/dashboard/methodologies/`.
    *   Its `page.tsx` will fetch and render the `MethodologyManagementView` from `features`.

**2. Component Organization in `features`:**

*   **`frontend/src/features/reports/`**:
    *   `components/`: Contains child components like `report-data-table.tsx`, `report-editor.tsx`, `analysis-block.tsx`.
    *   `actions/`: Contains related Server Actions (`saveReportAction`, `deleteReportAction`).
    *   `page-views/`: Contains the main "view" components called by the `page.tsx` files in `app`.
        *   `report-listing-view.tsx`
        *   `report-editor-view.tsx`
*   **`frontend/src/features/assets/`**: Will have a similar structure (`components`, `actions`, `page-views`).
*   **`frontend/src/features/methodologies/`**: Will have a similar structure.

## 10.2. State Management Architecture

*   **Local State:** Use React's `useState` and `useReducer` for state confined to a single component.
*   **Global State:** Use **Zustand** for state shared across the application, such as logged-in user information or the complex state of the `Report Editor`.

## 10.3. Routing Architecture

*   **Routing:** Use the **Next.js App Router**. Routes are defined by the directory structure within `frontend/src/app/`.
*   **Protected Routes:** A **Middleware** (`frontend/src/middleware.ts`) will be used to check for user authentication before allowing access to protected pages (e.g., `/dashboard`, `/reports`). Unauthenticated users will be redirected to `/auth/sign-in`.

---
