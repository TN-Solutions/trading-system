# 11. Backend Architecture

The backend architecture for the MVP is maximally simplified by leveraging **Supabase** as the primary platform.

## 11.1. Service Architecture

*   **Model:** Backend-as-a-Service (BaaS).
*   **Business Logic:**
    1.  **Row Level Security (RLS) Policies:** Core data security and authorization logic is defined directly in the PostgreSQL database. This is a robust and efficient security practice.
        *   **Example:** An RLS policy on the `reports` table would be: `(auth.uid() = user_id)`. This ensures a user can only interact with reports they own.
    2.  **PostgreSQL Functions and Triggers:** More complex logic, such as automatically updating the `updated_at` field whenever a report is modified, can be handled by PostgreSQL trigger functions.
    3.  **Next.js Server Actions:** Business logic that cannot be expressed in SQL (e.g., calling an external API like the market data API) will be placed in Server Actions.

## 11.2. Database Architecture

*   **Schema:** Defined in detail in Section 9.
*   **Data Access Layer:**
    *   There is no traditional DAL (like an ORM) on the backend.
    *   Instead, the **Supabase Client Library**, called from within Next.js Server Actions, acts as our data access layer.

## 11.3. Authentication and Authorization Architecture

*   **Authentication:** Handled entirely by **Supabase Auth**. It manages sign-ups, logins, session management, and issues JWTs for users.
*   **Authorization:** Enforced primarily by **Row Level Security (RLS)** in PostgreSQL, based on the `user_id` (retrieved from `auth.uid()`) stored in each table.

---
