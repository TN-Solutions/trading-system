# 8. Core Workflows

This section illustrates key system processes using sequence diagrams to clarify component interactions.

## 8.1. Workflow: Creating a New Analysis Report

This diagram describes the steps from the user clicking "Save" in the report editor to the data being securely stored in Supabase.

```mermaid
sequenceDiagram
    participant User
    participant Editor as Report Editor (UI)
    participant Service as API Service Layer (Frontend)
    participant ServerAction as Server Action (Next.js)
    participant Supabase

    User->>+Editor: Clicks "Save" button
    Editor->>+Service: Calls `saveReport(reportData)`
    Service->>+ServerAction: Calls `saveReportAction(reportData)`
    
    ServerAction->>+Supabase: Upsert record in `reports` table
    Supabase-->>-ServerAction: Returns `report.id`
    
    ServerAction-->>-Service: Returns success result
    Service-->>-Editor: Returns success result
    
    Editor->>+User: Displays "Save successful" notification
```

---
