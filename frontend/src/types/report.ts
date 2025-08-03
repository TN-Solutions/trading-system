export type Report = {
  id: string;
  user_id: string;
  asset_id: string;
  methodology_id: string;
  title: string;
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