'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { ReportWithDetails } from '@/types/report';
import { Column, ColumnDef } from '@tanstack/react-table';
import { FileText, TrendingUp, Target, Calendar } from 'lucide-react';
import { CellAction } from './cell-action';

interface ReportColumnProps {
  onEdit?: (report: ReportWithDetails) => void;
  onDelete?: (reportId: string) => void;
}

export const createReportColumns = ({ onEdit, onDelete }: ReportColumnProps): ColumnDef<ReportWithDetails>[] => [
  {
    id: 'title',
    accessorKey: 'title',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Title' />
    ),
    cell: ({ cell }) => (
      <div className="font-semibold">
        {cell.getValue<ReportWithDetails['title']>()}
      </div>
    ),
    meta: {
      label: 'Title',
      placeholder: 'Search titles...',
      variant: 'text',
      icon: FileText
    },
    enableColumnFilter: true
  },
  {
    id: 'asset',
    accessorKey: 'asset.symbol',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Asset' />
    ),
    cell: ({ row }) => (
      <div className="font-mono">
        <div className="font-semibold">{row.original.asset.symbol}</div>
        <div className="text-xs text-muted-foreground">{row.original.asset.name}</div>
      </div>
    ),
    meta: {
      label: 'Asset',
      placeholder: 'Search assets...',
      variant: 'text',
      icon: TrendingUp
    },
    enableColumnFilter: true
  },
  {
    id: 'methodology',
    accessorKey: 'methodology.name',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Methodology' />
    ),
    cell: ({ row }) => (
      <div>{row.original.methodology.name}</div>
    ),
    meta: {
      label: 'Methodology',
      placeholder: 'Search methodologies...',
      variant: 'text',
      icon: Target
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'status',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ cell }) => {
      const status = cell.getValue<ReportWithDetails['status']>();
      return (
        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          status === 'published' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' 
            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
        }`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      );
    },
    meta: {
      label: 'Status',
      placeholder: 'Filter by status...',
      variant: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Published', value: 'published' }
      ]
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<ReportWithDetails['created_at']>());
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    meta: {
      label: 'Created',
      icon: Calendar
    }
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }: { column: Column<ReportWithDetails, unknown> }) => (
      <DataTableColumnHeader column={column} title='Updated' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<ReportWithDetails['updated_at']>());
      return (
        <div className="text-sm text-muted-foreground">
          {date.toLocaleDateString()}
        </div>
      );
    },
    meta: {
      label: 'Updated',
      icon: Calendar
    }
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const report = row.original;
      return (
        <CellAction 
          data={report} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    }
  }
];

// Export a default set of columns for backward compatibility
export const reportColumns = createReportColumns({});