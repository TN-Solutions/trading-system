# 7. External APIs

This section identifies the internal FastAPI service that our application will build and integrate with.

## 7.1. API: Internal Market Data Service
*   **Purpose:** To provide historical and (eventually) real-time price (candlestick) data for financial assets. This service is a core component of our backend, built with FastAPI.
*   **Source Code:** `backend/` directory in the monorepo.
*   **Deployment:** Will be deployed as a serverless function (e.g., on Vercel, AWS Lambda).
*   **Authentication:** The service will be protected and only accessible from our Next.js frontend's server-side.
*   **Key Endpoints to be Built:**
    *   `GET /api/v1/candles`: To fetch historical candlestick data for a given asset, timeframe, and date range.
        *   Query Parameters: `symbol`, `resolution`, `from`, `to`.
        *   Response: A JSON object compatible with the `klinecharts` library.
*   **Data Source:** The FastAPI service itself will connect to our primary PostgreSQL database to fetch and process data. (Note: This implies we also need a way to get market data *into* our database, which will require a separate data ingestion script/process).
