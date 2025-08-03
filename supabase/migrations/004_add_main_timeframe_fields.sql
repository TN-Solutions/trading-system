-- Add main timeframe related fields to reports table
ALTER TABLE public.reports 
ADD COLUMN main_timeframe TEXT DEFAULT 'H4',
ADD COLUMN main_timeframe_bias TEXT DEFAULT 'neutral' CHECK (main_timeframe_bias IN ('bullish', 'bearish', 'neutral')),
ADD COLUMN main_timeframe_notes TEXT;