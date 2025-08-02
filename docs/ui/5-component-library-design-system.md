# 5. Component Library / Design System

*   **Design System Approach:** We will strictly adhere to and extend the existing design system provided by **Shadcn-ui** and **Tailwind CSS**. All new UI components must be built by combining Shadcn-ui primitives or following its styling principles.

## Core Components

### Component: Data Table

*   **Purpose:** To display tabular data in a structured way, supporting sorting, filtering, and pagination.
*   **Variants:** A reusable wrapper component will be created around `Tanstack Table` to standardize the look and behavior across the `Reports`, `Assets`, and `Methodologies` pages.
*   **States:** Loading, Empty, Error.

### Component: Modal / Dialog

*   **Purpose:** To display content or action-requiring forms in an overlay without leaving the current page.
*   **Usage Guidelines:** Use for quick create/edit forms (e.g., New Asset, New Methodology) and confirmation dialogs (e.g., "Are you sure you want to delete?").

### Component: Button

*   **Purpose:** To trigger an action or event.
*   **Variants:**
    *   `Primary`: For the main action on a page (e.g., "New Report", "Save").
    *   `Secondary`: For secondary actions.
    *   `Destructive`: For destructive actions (e.g., "Delete").
    *   `Link`: For navigation actions that look like text.
*   **States:** Default, Hover, Focused, Disabled.

### Component: Form Controls (Input, Select, Textarea)

*   **Purpose:** To collect input data from users.
*   **Usage Guidelines:** Always associated with a clear `Label`. Use `Zod` and `React Hook Form` for validation.
*   **States:** Default, Focused, Disabled, Error.

### Component: Card

*   **Purpose:** To group related content in a visual container.
*   **Usage Guidelines:** Use on the `Dashboard` to display statistics and widgets.
