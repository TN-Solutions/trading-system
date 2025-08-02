# 9. Database Schema

This section translates the defined data models into a concrete SQL database schema for PostgreSQL. The `CREATE TABLE` statements below include necessary data types, foreign keys, and constraints.

```sql
-- User table (managed by Supabase Auth)
-- This table already exists in Supabase's `auth` schema.
-- We will reference it via `auth.users(id)`.

-- Table to store user's trading assets
CREATE TABLE public.assets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    symbol TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id, symbol)
);
-- Enable Row Level Security
ALTER TABLE public.assets ENABLE ROW LEVEL SECURITY;

-- Table to store user's trading methodologies
CREATE TABLE public.methodologies (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.methodologies ENABLE ROW LEVEL SECURITY;

-- Main table for analysis reports
CREATE TABLE public.reports (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    asset_id uuid NOT NULL REFERENCES public.assets(id) ON DELETE RESTRICT,
    methodology_id uuid NOT NULL REFERENCES public.methodologies(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- 'draft' or 'published'
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Table for analysis blocks within a report
CREATE TABLE public.analysis_blocks (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid NOT NULL REFERENCES public.reports(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    timeframe TEXT NOT NULL,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    bias TEXT NOT NULL, -- 'bullish', 'bearish', 'neutral'
    chart_data JSONB,
    notes TEXT,
    snapshot_image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- Enable Row Level Security
ALTER TABLE public.analysis_blocks ENABLE ROW LEVEL SECURITY;

-- Table for trade entries associated with a report
CREATE TABLE public.trade_entries (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id uuid NOT NULL UNIQUE REFERENCES public.reports(id) ON DELETE CASCADE, -- UNIQUE constraint for 1-to-1 relationship
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    order_type TEXT NOT NULL, -- 'market' or 'limit'
    entry_pattern TEXT,
    entry_price NUMERIC NOT NULL,
    stop_loss NUMERIC NOT NULL,
    take_profit_1 NUMERIC,
    take_profit_2 NUMERIC,
    take_profit_3 NUMERIC,
    trade_type TEXT NOT NULL, -- 'long' or 'short'
    outcome TEXT NOT NULL DEFAULT 'running', -- 'win', 'loss', 'breakeven', 'running'
    executed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    closed_at TIMESTAMPTZ,
    entry_image_url TEXT
);
-- Enable Row Level Security
ALTER TABLE public.trade_entries ENABLE ROW LEVEL SECURITY;
```

---
