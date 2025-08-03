export type Report = {
  id: string;
  user_id: string;
  asset_id: string;
  methodology_id: string;
  title: string;
  main_timeframe: string;
  main_timeframe_bias: 'bullish' | 'bearish' | 'neutral';
  main_timeframe_notes?: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
};

export type ReportWithDetails = Report & {
  asset: {
    id: string;
    symbol: string;
    name: string;
  };
  methodology: {
    id: string;
    name: string;
  };
};

export type AnalysisBlock = {
  id: string;
  report_id: string;
  user_id: string;
  timeframe: string;
  bias: 'bullish' | 'bearish' | 'neutral';
  chart_data?: any; // JSON data for chart drawings
  notes?: string;
  snapshot_image_url?: string;
  created_at: string;
};

export type ReportWithBlocks = ReportWithDetails & {
  analysis_blocks: AnalysisBlock[];
};