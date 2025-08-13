import { updateReport } from '../report-actions';

// Mock Supabase
const mockSupabase = {
  auth: {
    getUser: jest.fn(),
  },
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          single: jest.fn(),
        })),
      })),
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        eq: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(),
          })),
        })),
      })),
    })),
  })),
};

jest.mock('@/lib/supabase/client', () => ({
  createClient: () => Promise.resolve(mockSupabase),
}));

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('updateReport - Main Timeframe Validation', () => {
  const mockUser = { id: 'user-123' };
  const mockReportId = 'report-123';

  beforeEach(() => {
    jest.clearAllMocks();
    mockSupabase.auth.getUser.mockResolvedValue({ 
      data: { user: mockUser }, 
      error: null 
    });
  });

  it('should prevent main timeframe update when report has analysis blocks', async () => {
    const existingReport = {
      id: mockReportId,
      main_timeframe: 'H4',
      status: 'draft',
      analysis_blocks: [{ id: 'block-1' }],
    };

    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: existingReport,
              error: null,
            }),
          })),
        })),
      })),
    });

    const updateData = {
      title: 'Updated Report',
      asset_id: 'asset-123',
      methodology_id: 'methodology-123',
      main_timeframe: 'H1', // Trying to change from H4 to H1
      main_timeframe_bias: 'bullish' as const,
      analysis_date: '2024-01-01T10:00:00Z',
      status: 'draft' as const,
    };

    const result = await updateReport(mockReportId, updateData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot change main timeframe after analysis blocks have been added or report is published');
  });

  it('should prevent main timeframe update when report is published', async () => {
    const existingReport = {
      id: mockReportId,
      main_timeframe: 'H4',
      status: 'published',
      analysis_blocks: [],
    };

    mockSupabase.from.mockReturnValue({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn().mockResolvedValue({
              data: existingReport,
              error: null,
            }),
          })),
        })),
      })),
    });

    const updateData = {
      title: 'Updated Report',
      asset_id: 'asset-123',
      methodology_id: 'methodology-123',
      main_timeframe: 'H1', // Trying to change from H4 to H1
      main_timeframe_bias: 'bullish' as const,
      analysis_date: '2024-01-01T10:00:00Z',
      status: 'published' as const,
    };

    const result = await updateReport(mockReportId, updateData);

    expect(result.success).toBe(false);
    expect(result.error).toBe('Cannot change main timeframe after analysis blocks have been added or report is published');
  });

  it('should allow main timeframe update when report is draft and has no analysis blocks', async () => {
    const existingReport = {
      id: mockReportId,
      main_timeframe: 'H4',
      status: 'draft',
      analysis_blocks: [],
    };

    const mockAsset = { id: 'asset-123' };
    const mockMethodology = { id: 'methodology-123' };
    const mockUpdatedReport = {
      id: mockReportId,
      title: 'Updated Report',
      main_timeframe: 'H1',
    };

    // Mock the database calls
    let selectCallCount = 0;
    mockSupabase.from.mockImplementation((table) => {
      if (table === 'reports') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: existingReport,
                  error: null,
                }),
              })),
            })),
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn().mockResolvedValue({
                    data: mockUpdatedReport,
                    error: null,
                  }),
                })),
              })),
            })),
          })),
        };
      } else if (table === 'assets') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: mockAsset,
                  error: null,
                }),
              })),
            })),
          })),
        };
      } else if (table === 'methodologies') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: mockMethodology,
                  error: null,
                }),
              })),
            })),
          })),
        };
      }
    });

    const updateData = {
      title: 'Updated Report',
      asset_id: 'asset-123',
      methodology_id: 'methodology-123',
      main_timeframe: 'H1', // Changing from H4 to H1
      main_timeframe_bias: 'bullish' as const,
      analysis_date: '2024-01-01T10:00:00Z',
      status: 'draft' as const,
    };

    const result = await updateReport(mockReportId, updateData);

    expect(result.success).toBe(true);
    expect(result.report).toEqual(mockUpdatedReport);
  });

  it('should allow update when main timeframe is not being changed', async () => {
    const existingReport = {
      id: mockReportId,
      main_timeframe: 'H4',
      status: 'draft',
      analysis_blocks: [{ id: 'block-1' }], // Has blocks but timeframe not changing
    };

    const mockAsset = { id: 'asset-123' };
    const mockMethodology = { id: 'methodology-123' };
    const mockUpdatedReport = {
      id: mockReportId,
      title: 'Updated Report Title',
      main_timeframe: 'H4', // Same timeframe
    };

    mockSupabase.from.mockImplementation((table) => {
      if (table === 'reports') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: existingReport,
                  error: null,
                }),
              })),
            })),
          })),
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                select: jest.fn(() => ({
                  single: jest.fn().mockResolvedValue({
                    data: mockUpdatedReport,
                    error: null,
                  }),
                })),
              })),
            })),
          })),
        };
      } else if (table === 'assets') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: mockAsset,
                  error: null,
                }),
              })),
            })),
          })),
        };
      } else if (table === 'methodologies') {
        return {
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                single: jest.fn().mockResolvedValue({
                  data: mockMethodology,
                  error: null,
                }),
              })),
            })),
          })),
        };
      }
    });

    const updateData = {
      title: 'Updated Report Title',
      asset_id: 'asset-123',
      methodology_id: 'methodology-123',
      main_timeframe: 'H4', // Same as existing
      main_timeframe_bias: 'bearish' as const,
      analysis_date: '2024-01-01T10:00:00Z',
      status: 'draft' as const,
    };

    const result = await updateReport(mockReportId, updateData);

    expect(result.success).toBe(true);
    expect(result.report).toEqual(mockUpdatedReport);
  });
});