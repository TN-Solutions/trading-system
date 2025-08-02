# 5. API Specification

Because we are using Supabase as the primary backend for the MVP, we do not need to define a traditional REST or GraphQL API specification. Instead, our "API" is the set of tables, views, and functions within our PostgreSQL database, accessed via the Supabase client library.

Security and business logic will be enforced at two levels:

1.  **Row Level Security (RLS) in PostgreSQL:** This is the first and most critical line of defense. RLS policies will ensure that users can only access (read, write, update, delete) their own data.
2.  **Service Layer in Next.js:** All interactions with Supabase will be encapsulated within server-side functions in the Next.js application. This abstraction layer will contain additional business logic and prevent Supabase details from being exposed to the client-side.

### Example Query Flow:

1.  A React component (client-side) needs to display a list of reports.
2.  It calls a Server Action in Next.js named `getReports()`.
3.  The `getReports()` function (running on the server) initializes the Supabase client with the logged-in user's credentials.
4.  It executes a query against the `reports` table.
5.  PostgreSQL applies the RLS policies, returning only the rows where the `user_id` matches the current user's ID.
6.  The `getReports()` function returns the secure data to the React component for display.

---
