import { render, screen } from '@testing-library/react';
import { MethodologyTable } from '../methodology-table';
import { methodologyColumns } from '../methodology-table/columns';
import { Methodology } from '@/types/methodology';

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

const mockMethodologies: Methodology[] = [
  {
    id: '1',
    user_id: 'user-1',
    name: 'ICT',
    description: 'Inner Circle Trader methodology',
    created_at: '2023-01-01T00:00:00Z'
  },
  {
    id: '2',
    user_id: 'user-1',
    name: 'Smart Money Concepts',
    description: 'Advanced price action methodology',
    created_at: '2023-01-02T00:00:00Z'
  }
];

const mockOnEdit = jest.fn();
const mockOnDelete = jest.fn();

describe('MethodologyTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders data table with toolbar', () => {
    render(
      <MethodologyTable
        data={mockMethodologies}
        totalItems={mockMethodologies.length}
        columns={methodologyColumns}
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
      <MethodologyTable
        data={mockMethodologies}
        totalItems={10}
        columns={methodologyColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(useDataTableSpy).toHaveBeenCalledWith({
      data: mockMethodologies,
      columns: methodologyColumns,
      pageCount: 1, // Math.ceil(10 / 10)
      shallow: false,
      debounceMs: 500
    });
  });

  it('calculates page count correctly', () => {
    const useDataTableSpy = require('@/hooks/use-data-table').useDataTable;
    
    render(
      <MethodologyTable
        data={mockMethodologies}
        totalItems={25}
        columns={methodologyColumns}
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

  it('handles empty data gracefully', () => {
    render(
      <MethodologyTable
        data={[]}
        totalItems={0}
        columns={methodologyColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(screen.getByTestId('data-table')).toBeInTheDocument();
    expect(screen.getByTestId('data-table-toolbar')).toBeInTheDocument();
  });

  it('uses default page size of 10', () => {
    const useDataTableSpy = require('@/hooks/use-data-table').useDataTable;
    
    render(
      <MethodologyTable
        data={mockMethodologies}
        totalItems={100}
        columns={methodologyColumns}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
      />
    );

    expect(useDataTableSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        pageCount: 10 // Math.ceil(100 / 10)
      })
    );
  });
});