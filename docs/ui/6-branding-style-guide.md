# 6. Branding & Style Guide

### Visual Identity

*   **Brand Guidelines:** The interface will follow the modern, minimalist, professional aesthetic established by **Shadcn-ui**. The focus is on clarity, functionality, and reliability.

### Color Palette

*   We will use the default **"Slate"** theme from Shadcn-ui as a base.
*   **Primary/Accent:** `primary` (Shadcn's default blue) will be used for primary action buttons, links, and elements needing attention.
*   **Destructive:** `destructive` (default red) will be used for delete actions and error messages.
*   **Neutral:** The `background`, `foreground`, `card`, `border` colors from the "Slate" theme will be used for text, borders, and backgrounds.

### Typography

*   **Font Family:** **Inter**, as defined in `frontend/src/lib/font.ts`.
*   **Type Scale:**
    *   **H1 (Page Title):** 2.25rem (36px), Bold
    *   **H2 (Section Title):** 1.875rem (30px), Bold
    *   **H3 (Card Title):** 1.5rem (24px), Semi-Bold
    *   **Body:** 1rem (16px), Regular
    *   **Small/Caption:** 0.875rem (14px), Regular

### Iconography

*   **Icon Library:** **Tabler Icons** (`@tabler/icons-react`), to ensure consistency with existing components.
*   **Usage Guidelines:** Icons should be used sparingly to support content comprehension, not for decoration.

### Spacing & Layout

*   **Grid System:** The layout will be based on Flexbox and CSS Grid, provided by Tailwind CSS utility classes.
*   **Spacing Scale:** All spacing (margin, padding, gaps) must follow the default Tailwind CSS spacing scale (e.g., `p-4`, `m-8`, `gap-2`) to ensure visual consistency.
