'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Methodology } from '@/types/methodology';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text, BookOpen } from 'lucide-react';
import { CellAction } from './cell-action';

interface MethodologyColumnProps {
  onEdit?: (methodology: Methodology) => void;
  onDelete?: (methodologyId: string) => void;
}

export const createMethodologyColumns = ({ onEdit, onDelete }: MethodologyColumnProps): ColumnDef<Methodology>[] => [
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Methodology, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => (
      <div className="font-semibold">
        {cell.getValue<Methodology['name']>()}
      </div>
    ),
    meta: {
      label: 'Name',
      placeholder: 'Search methodologies...',
      variant: 'text',
      icon: BookOpen
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ cell }) => {
      const description = cell.getValue<Methodology['description']>();
      return (
        <div className="max-w-[300px] truncate">
          {description || '-'}
        </div>
      );
    },
    meta: {
      label: 'Description',
      placeholder: 'Search descriptions...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Methodology, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Methodology['created_at']>());
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const methodology = row.original;
      return (
        <CellAction 
          data={methodology} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    }
  }
];

// Export a default set of columns for backward compatibility
export const methodologyColumns = createMethodologyColumns({});