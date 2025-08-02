# 4. Data Models

This section defines the core data models/entities that will be shared between the frontend and backend.

## 4.1. Model: `Asset`
*   **Purpose:** Represents a financial instrument a user can analyze.
*   **Attributes:**
    *   `id`: `uuid` - Primary key.
    *   `user_id`: `uuid` - Foreign key to the user.
    *   `symbol`: `text` - Unique trading symbol per user (e.g., "EURUSD").
    *   `name`: `text` - Full name of the asset (e.g., "Euro / US Dollar").
    *   `description`: `text` - Optional description.
    *   `created_at`: `timestamp` - Creation timestamp.
*   **Constraint:** `(user_id, symbol)` must be unique.

```typescript
// packages/shared-types/src/asset.ts
export interface Asset {
  id: string;
  user_id: string;
  symbol: string; // Unique per user
  name: string;
  description?: string;
  created_at: string;
}
```

## 4.2. Model: `Methodology`
*   **Purpose:** Represents a user-defined analysis strategy.
*   **Attributes:**
    *   `id`: `uuid` - Primary key.
    *   `user_id`: `uuid` - Foreign key to the user.
    *   `name`: `text` - Name of the methodology (e.g., "ICT").
    *   `description`: `text` - Optional description.
    *   `created_at`: `timestamp` - Creation timestamp.

```typescript
// packages/shared-types/src/methodology.ts
export interface Methodology {
  id: string; // uuid
  user_id: string; // uuid
  name: string;
  description?: string;
  created_at: string; // timestamp
}
```

## 4.3. Model: `Report`
*   **Purpose:** Acts as a container for a complete analysis.
*   **Attributes:**
    *   `id`: `uuid` - Primary key.
    *   `user_id`: `uuid` - Foreign key to the user.
    *   `asset_id`: `uuid` - Foreign key to the `Asset`.
    *   `methodology_id`: `uuid` - Foreign key to the `Methodology`.
    *   `title`: `text` - Title of the report.
    *   `status`: `text` - Status (e.g., 'draft', 'published').
    *   `created_at`: `timestamp` - Creation timestamp.
    *   `updated_at`: `timestamp` - Last update timestamp.

```typescript
// packages/shared-types/src/report.ts
export interface Report {
  id: string; // uuid
  user_id: string; // uuid
  asset_id: string; // uuid
  methodology_id: string; // uuid
  title: string;
  status: 'draft' | 'published';
  created_at: string; // timestamp
  updated_at: string; // timestamp
}
```

## 4.4. Model: `AnalysisBlock`
*   **Purpose:** Represents a single unit of analysis within a report.
*   **Attributes:**
    *   `id`: `uuid` - Primary key.
    *   `report_id`: `uuid` - Foreign key to the `Report`.
    *   `user_id`: `uuid` - Foreign key to the user (for RLS simplification).
    *   `timeframe`: `text` - Chart timeframe (e.g., 'H4', 'D1').
    *   `is_primary`: `boolean` - Marks if this is the primary analysis timeframe.
    *   `bias`: `text` - Bias of the analysis ('bullish', 'bearish', 'neutral').
    *   `chart_data`: `jsonb` - Data for chart drawings.
    *   `notes`: `text` - User's text notes.
    *   `snapshot_image_url`: `text` - Optional URL to a screenshot of the analysis.
    *   `created_at`: `timestamp` - Creation timestamp.

```typescript
// packages/shared-types/src/analysis.ts
export interface ChartDrawing {
  id: string;
  type: 'trendline' | 'rectangle';
  points: { x: number; y: number }[];
}

export interface AnalysisBlock {
  id: string;
  report_id: string;
  user_id: string;
  timeframe: string;
  is_primary: boolean;
  bias: 'bullish' | 'bearish' | 'neutral';
  chart_data: ChartDrawing[];
  notes: string;
  snapshot_image_url?: string;
  created_at: string;
}
```

## 4.5. Model: `TradeEntry`
*   **Purpose:** Records the details of an actual trade executed based on a report.
*   **Attributes:**
    *   `id`: `uuid` - Primary key.
    *   `report_id`: `uuid` - Foreign key (1-to-1 relationship) to the `Report`.
    *   `user_id`: `uuid` - Foreign key to the user.
    *   `order_type`: `text` - Order type ('market' or 'limit').
    *   `entry_pattern`: `text` - Entry pattern/model (e.g., "Engulfing candle").
    *   `entry_price`: `numeric` - Entry price.
    *   `stop_loss`: `numeric` - Stop loss price.
    *   `take_profit_1`: `numeric` - Take profit target 1.
    *   `take_profit_2`: `numeric` - Optional take profit target 2.
    *   `take_profit_3`: `numeric` - Optional take profit target 3.
    *   `trade_type`: `text` - Trade type ('long' or 'short').
    *   `outcome`: `text` - Outcome ('win', 'loss', 'breakeven', 'running').
    *   `executed_at`: `timestamp` - Execution timestamp.
    *   `closed_at`: `timestamp` - Optional closing timestamp.
    *   `entry_image_url`: `text` - Optional URL to a screenshot of the entry.

```typescript
// packages/shared-types/src/trade.ts
export interface TradeEntry {
  id: string;
  report_id: string;
  user_id: string;
  order_type: 'market' | 'limit';
  entry_pattern: string;
  entry_price: number;
  stop_loss: number;
  take_profit_1: number;
  take_profit_2?: number;
  take_profit_3?: number;
  trade_type: 'long' | 'short';
  outcome: 'win' | 'loss' | 'breakeven' | 'running';
  executed_at: string; // timestamp
  closed_at?: string; // timestamp
  entry_image_url?: string;
}
```

---
