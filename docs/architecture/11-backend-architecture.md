# 11. Backend Architecture

The backend architecture follows a hybrid model, combining the power of a Backend-as-a-Service (BaaS) platform with a custom microservice for specialized tasks.

## 11.1. Primary Backend: Supabase (BaaS)

For the core application logic, the backend is maximally simplified by leveraging **Supabase** as the primary platform.

*   **Model:** Backend-as-a-Service (BaaS).
*   **Business Logic:**
    1.  **Row Level Security (RLS) Policies:** Core data security and authorization logic for user-specific data (reports, assets, etc.) is defined directly in the PostgreSQL database. This is a robust and efficient security practice.
        *   **Example:** An RLS policy on the `reports` table would be: `(auth.uid() = user_id)`. This ensures a user can only interact with reports they own.
    2.  **PostgreSQL Functions and Triggers:** More complex logic, such as automatically updating the `updated_at` field whenever a report is modified, can be handled by PostgreSQL trigger functions.
    3.  **Next.js Server Actions:** Business logic that cannot be expressed in SQL will be placed in Server Actions. These actions are the primary interface between the frontend and Supabase.

## 11.2. Market Data Service: FastAPI

For the specialized task of market data ingestion and delivery, a custom microservice is used.

*   **Framework:** FastAPI (Python)
*   **Responsibilities:**
    *   **Data Ingestion:** Exposing a secure `POST /api/v1/candles` endpoint to receive OHLC data from a MetaTrader 5 Expert Advisor (EA).
    *   **Data Serving:** Exposing a `GET /api/v1/candles` endpoint to provide historical market data to the Next.js frontend for charting.
*   **Database Interaction:** The FastAPI service connects directly to the Supabase PostgreSQL database using a dedicated service role (`service_role`) with limited permissions (e.g., only `INSERT` and `SELECT` on `market_data_candles` table). It does not handle user authentication or business logic outside of its specific domain.

## 11.3. Database Architecture

*   **Schema:** Defined in detail in Section 9.
*   **Data Access Layer:**
    *   **For User Data:** The **Supabase Client Library**, called from within Next.js Server Actions, acts as the data access layer.
    *   **For Market Data:** The FastAPI service uses a standard PostgreSQL driver (like `psycopg2` or `asyncpg`) to interact with the database.

## 11.4. Authentication and Authorization Architecture

*   **User Authentication:** Handled entirely by **Supabase Auth**. It manages sign-ups, logins, session management, and issues JWTs for users.
*   **User Authorization:** Enforced primarily by **Row Level Security (RLS)** in PostgreSQL, based on the `user_id` (retrieved from `auth.uid()`) stored in each user-specific table.
*   **Service Authentication:**
    *   **MT5 EA to FastAPI:** A secret API key (`X-API-KEY` header) is used to authorize the EA to push data.
    *   **Next.js to FastAPI:** Communication between the Next.js server-side and the FastAPI service is secured through network policies or a shared secret token, ensuring the `GET` endpoint is not publicly exposed.
---

