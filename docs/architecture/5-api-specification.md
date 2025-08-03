# 5. API Specification

While most of the application's data access is handled via the Supabase client library, the introduction of the custom **FastAPI Market Data Service** requires a formal API specification for its endpoints.

## 5.1. FastAPI Market Data Service

This service is responsible for ingesting and serving market data.

### Endpoint: `POST /api/v1/candles`

This endpoint is used by the MetaTrader 5 Expert Advisor (EA) to push OHLC (Open, High, Low, Close) candle data into the system.

*   **Method:** `POST`
*   **URL:** `/api/v1/candles`
*   **Description:** Receives a single or a batch of candlestick data and stores it in the database.
*   **Authentication:** The request must include a secret API key in the `X-API-KEY` header. The FastAPI service will validate this key against a value stored in its environment variables.

#### Request Header

```
X-API-KEY: <Your-Secret-API-Key>
Content-Type: application/json
```

#### Request Body (Payload)

The body should be a JSON object containing a list of candles.

```json
{
  "candles": [
    {
      "symbol": "EURUSD",
      "timeframe": "H1",
      "timestamp": "2025-08-03T10:00:00Z",
      "open": 1.08500,
      "high": 1.08650,
      "low": 1.08480,
      "close": 1.08620,
      "volume": 1200
    },
    {
      "symbol": "EURUSD",
      "timeframe": "H1",
      "timestamp": "2025-08-03T11:00:00Z",
      "open": 1.08620,
      "high": 1.08750,
      "low": 1.08600,
      "close": 1.08730,
      "volume": 1500
    }
  ]
}
```

#### Success Response

*   **Code:** `201 Created`
*   **Body:**
    ```json
    {
      "status": "success",
      "message": "Data ingested successfully.",
      "records_added": 2
    }
    ```

#### Error Responses

*   **Code:** `401 Unauthorized`
    *   **Reason:** Missing or invalid `X-API-KEY`.
    *   **Body:**
        ```json
        {
          "detail": "Invalid or missing API Key"
        }
        ```
*   **Code:** `422 Unprocessable Entity`
    *   **Reason:** The request payload is malformed or fails validation (e.g., missing fields, incorrect data types).
    *   **Body:** (Example from Pydantic)
        ```json
        {
          "detail": [
            {
              "loc": ["body", "candles", 0, "symbol"],
              "msg": "field required",
              "type": "value_error.missing"
            }
          ]
        }
        ```

### Endpoint: `GET /api/v1/candles`

This endpoint is used by the Next.js frontend to fetch historical candlestick data for displaying in charts.

*   **Method:** `GET`
*   **URL:** `/api/v1/candles`
*   **Description:** Retrieves historical candlestick data for a given symbol and timeframe.
*   **Authentication:** This endpoint is protected and can only be called from the Next.js backend (server components/actions). The Next.js backend will use a secure token or internal network rules to communicate with the FastAPI service.

#### Query Parameters

| Parameter | Type | Description | Example |
| :--- | :--- | :--- | :--- |
| `symbol` | `string` | The trading symbol to fetch data for. | `EURUSD` |
| `timeframe`| `string` | The chart timeframe/resolution. | `H1` |
| `from` | `integer`| Unix timestamp for the start of the date range. | `1691020800` |
| `to` | `integer` | Unix timestamp for the end of the date range. | `1691107200` |

#### Success Response

*   **Code:** `200 OK`
*   **Body:** A JSON array of objects compatible with the `klinecharts` library.
    ```json
    [
      {
        "timestamp": 1691020800000,
        "open": 1.08500,
        "high": 1.08650,
        "low": 1.08480,
        "close": 1.08620,
        "volume": 1200
      }
    ]
    ```
---

