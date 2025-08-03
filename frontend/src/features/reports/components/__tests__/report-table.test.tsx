import { render, screen } from '@testing-library/react';
import { ReportTable } from '../report-table';
import { createReportColumns } from '../report-table/columns';
import { ReportWithDetails } from '@/types/report';

// Mock the data table hooks
jest.mock('@/hooks/use-data-table');
jest.mock('nuqs');

const mockReports: ReportWithDetails[] = [
  {
    id: 'report-1',
    user_id: 'user-1',
    asset_id: 'asset-1',
    methodology_id: 'methodology-1',
    title: 'Q4 2024 EUR/USD Analysis',
    status: 'draft',
    created_at: '2023-01-01T00:00:00Z',
    updated_at: '2023-01-01T00:00:00Z',
    asset: {
      id: 'asset-1',
      symbol: 'EURUSD',
      name: 'Euro / US Dollar'
    },
    methodology: {
      id: 'methodology-1',
      name: 'Technical Analysis'
    }
  },
  {
    id: 'report-2',
    user_id: 'user-1',
    asset_id: 'asset-2',
    methodology_id: 'methodology-2',
    title: 'Q4 2024 BTC/USD Analysis',
    status: 'published',
    created_at: '2023-01-02T00:00:00Z',
    updated_at: '2023-01-02T00:00:00Z',
    asset: {
      id: 'asset-2',
      symbol: 'BTCUSD',
      name: 'Bitcoin / US Dollar'
    },
    methodology: {
      id: 'methodology-2',
      name: 'Fundamental Analysis'
    }
  }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

// Mock the use-data-table hook
const mockUseDataTable = require('@/hooks/use-data-table');
mockUseDataTable.useDataTable = jest.fn(() => ({
  table: {
    getHeaderGroups: () => [
      {
        id: 'header-group-1',
        headers: [
          { id: 'title', column: { columnDef: { header: 'Title' } }, getContext: () => ({}) },
          { id: 'asset', column: { columnDef: { header: 'Asset' } }, getContext: () => ({}) },
          { id: 'methodology', column: { columnDef: { header: 'Methodology' } }, getContext: () => ({}) },
          { id: 'status', column: { columnDef: { header: 'Status' } }, getContext: () => ({}) },
          { id: 'created_at', column: { columnDef: { header: 'Created' } }, getContext: () => ({}) },
          { id: 'actions', column: { columnDef: { header: '' } }, getContext: () => ({}) }
        ]
      }
    ],
    getRowModel: () => ({
      rows: mockReports.map((report, index) => ({
        id: `row-${index}`,
        original: report,
        getVisibleCells: () => [
          { id: 'title', column: { id: 'title' }, getValue: () => report.title, getContext: () => ({ cell: { getValue: () => report.title } }) },
          { id: 'asset', column: { id: 'asset' }, getValue: () => report.asset.symbol, getContext: () => ({ row: { original: report } }) },
          { id: 'methodology', column: { id: 'methodology' }, getValue: () => report.methodology.name, getContext: () => ({ row: { original: report } }) },
          { id: 'status', column: { id: 'status' }, getValue: () => report.status, getContext: () => ({ cell: { getValue: () => report.status } }) },
          { id: 'created_at', column: { id: 'created_at' }, getValue: () => report.created_at, getContext: () => ({ cell: { getValue: () => report.created_at } }) },
          { id: 'actions', column: { id: 'actions' }, getValue: () => '', getContext: () => ({ row: { original: report } }) }
        ]
      }))
    }),
    getCanPreviousPage: () => false,
    getCanNextPage: () => false,
    getPageCount: () => 1,
    getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
    previousPage: jest.fn(),
    nextPage: jest.fn(),
    setPageIndex: jest.fn(),
    setPageSize: jest.fn()
  }
}));

// Mock nuqs
const mockUseQueryState = require('nuqs');
mockUseQueryState.parseAsInteger = {
  withDefault: jest.fn(() => ({ parse: jest.fn(), serialize: jest.fn() }))
};
mockUseQueryState.useQueryState = jest.fn(() => [10, jest.fn()]);

describe('ReportTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders table with report data', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    render(
      <ReportTable
        data={mockReports}
        totalItems={mockReports.length}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Q4 2024 EUR/USD Analysis')).toBeInTheDocument();
    expect(screen.getByText('Q4 2024 BTC/USD Analysis')).toBeInTheDocument();
    expect(screen.getByText('EURUSD')).toBeInTheDocument();
    expect(screen.getByText('BTCUSD')).toBeInTheDocument();
    expect(screen.getByText('Technical Analysis')).toBeInTheDocument();
    expect(screen.getByText('Fundamental Analysis')).toBeInTheDocument();
  });

  it('displays status badges correctly', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    render(
      <ReportTable
        data={mockReports}
        totalItems={mockReports.length}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('Draft')).toBeInTheDocument();
    expect(screen.getByText('Published')).toBeInTheDocument();
  });

  it('shows asset symbol and name', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    render(
      <ReportTable
        data={mockReports}
        totalItems={mockReports.length}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByText('EURUSD')).toBeInTheDocument();
    expect(screen.getByText('Euro / US Dollar')).toBeInTheDocument();
    expect(screen.getByText('BTCUSD')).toBeInTheDocument();
    expect(screen.getByText('Bitcoin / US Dollar')).toBeInTheDocument();
  });

  it('formats dates correctly', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    render(
      <ReportTable
        data={mockReports}
        totalItems={mockReports.length}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Check if dates are formatted (this will depend on locale)
    expect(screen.getByText(/1\/1\/2023|01\/01\/2023/)).toBeInTheDocument();
    expect(screen.getByText(/1\/2\/2023|01\/02\/2023/)).toBeInTheDocument();
  });

  it('handles empty data gracefully', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    // Mock empty data
    mockUseDataTable.useDataTable.mockReturnValueOnce({
      table: {
        getHeaderGroups: () => [],
        getRowModel: () => ({ rows: [] }),
        getCanPreviousPage: () => false,
        getCanNextPage: () => false,
        getPageCount: () => 0,
        getState: () => ({ pagination: { pageIndex: 0, pageSize: 10 } }),
        previousPage: jest.fn(),
        nextPage: jest.fn(),
        setPageIndex: jest.fn(),
        setPageSize: jest.fn()
      }
    });
    
    render(
      <ReportTable
        data={[]}
        totalItems={0}
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Should render without crashing
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('calculates page count correctly', () => {
    const columns = createReportColumns({ onEdit: mockOnEdit, onDelete: mockOnDelete });
    
    render(
      <ReportTable
        data={mockReports}
        totalItems={25} // More than page size to test pagination
        columns={columns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    // Verify that useDataTable was called with correct pageCount
    expect(mockUseDataTable.useDataTable).toHaveBeenCalledWith({
      data: mockReports,
      columns,
      pageCount: 3, // Math.ceil(25 / 10)
      shallow: false,
      debounceMs: 500
    });
  });
});