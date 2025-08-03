# 7. Internal APIs

This section identifies the internal FastAPI service that our application will build and integrate with. We are no longer using external third-party APIs for market data.

## 7.1. API: Internal Market Data Service
*   **Purpose:** To provide historical and (eventually) real-time price (candlestick) data for financial assets. This service is a core component of our backend, built with FastAPI.
*   **Source Code:** `backend/` directory in the monorepo.
*   **Deployment:** Will be deployed as a serverless function or a containerized service (e.g., on Vercel, AWS Lambda, or Google Cloud Run).
*   **Authentication:** The service will be protected. The ingestion endpoint uses an API key, and the data retrieval endpoint is only accessible from our Next.js frontend's server-side.

*   **Data Ingestion Flow:**
    1.  A custom **MetaTrader 5 Expert Advisor (EA)**, written in MQL5, runs on a trading terminal.
    2.  The EA captures OHLC (candlestick) data for configured symbols and timeframes.
    3.  The EA sends this data via a `POST` request to the `/api/v1/candles` endpoint of our FastAPI service.
    4.  The FastAPI service validates the request and stores the data in the primary PostgreSQL database.

*   **Key Endpoints:**
    *   `POST /api/v1/candles`: To receive and store candlestick data from the MT5 EA. The specification is detailed in `docs/architecture/5-api-specification.md`.
    *   `GET /api/v1/candles`: To fetch historical candlestick data for a given asset, timeframe, and date range, for use by the frontend.
        *   Query Parameters: `symbol`, `timeframe`, `from`, `to`.
        *   Response: A JSON object compatible with the `klinecharts` library.

