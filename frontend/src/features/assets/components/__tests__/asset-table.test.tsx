import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AssetTable } from '../asset-table';
import { assetColumns } from '../asset-table/columns';
import { Asset } from '@/types/asset';

// Mock the hooks and components
jest.mock('@/hooks/use-data-table', () => ({
  useDataTable: () => ({
    table: {
      getHeaderGroups: () => [],
      getRowModel: () => ({ rows: [] }),
      getAllColumns: () => [],
      getFilteredSelectedRowModel: () => ({ rows: [] })
    }
  })
}));

jest.mock('@/components/ui/table/data-table', () => ({
  DataTable: ({ children }: any) => <div data-testid="data-table">{children}</div>
}));

jest.mock('@/components/ui/table/data-table-toolbar', () => ({
  DataTableToolbar: () => <div data-testid="data-table-toolbar">Toolbar</div>
}));

const mockAssets: Asset[] = [
  {
    id: '1',
    user_id: 'user-1',
    symbol: 'EURUSD',
    name: 'Euro / US Dollar',
    description: 'Major currency pair',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    symbol: 'GBPUSD',
    name: 'British Pound / US Dollar',
    description: 'Major currency pair',
    created_at: '2023-01-02T00:00:00Z'
  }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('AssetTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data table with toolbar', () => {
    render(
      <AssetTable
        data={mockAssets}
        totalItems={mockAssets.length}
        columns={assetColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('data-table-toolbar')).toBeInTheDocument();
  });

  it('passes correct props to useDataTable hook', () => {
    const useDataTableSpy = require('@/hooks/use-data-table').useDataTable;
    
    render(
      <AssetTable
        data={mockAssets}
        totalItems={10}
        columns={assetColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(useDataTableSpy).toHaveBeenCalledWith({
      data: mockAssets,
      columns: assetColumns,
      pageCount: 1, // Math.ceil(10 / 10)
      shallow: false,
      debounceMs: 500
    });
  });

  it('calculates page count correctly', () => {
    const useDataTableSpy = require('@/hooks/use-data-table').useDataTable;
    
    render(
      <AssetTable
        data={mockAssets}
        totalItems={25}
        columns={assetColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(useDataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pageCount: 3 // Math.ceil(25 / 10)
      })
    );
  });
});