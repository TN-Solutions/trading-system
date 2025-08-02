# 3. User Flows

## User Flow: Create a New Analysis Report

*   **User Goal:** To quickly and easily log a complete trading analysis, including chart analysis and notes.
*   **Entry Points:** "New Report" button on the `Reports` management page.
*   **Success Criteria:** A new analysis report is successfully saved to the database with all user inputs.

### Flow Diagram

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

### Edge Cases & Error Handling:

*   **Validation Error:** If the user does not enter a title, the system will display an error message and prevent report creation.
*   **Save Error:** If there is an error during saving (e.g., network loss), the system will display a non-blocking error message and allow the user to retry. The state of the report will be preserved.
*   **Unsaved Changes:** If the user attempts to leave the edit page without saving, a confirmation dialog will appear to warn them about unsaved changes.
