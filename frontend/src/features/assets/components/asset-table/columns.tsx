'use client';
import { DataTableColumnHeader } from '@/components/ui/table/data-table-column-header';
import { Asset } from '@/types/asset';
import { Column, ColumnDef } from '@tanstack/react-table';
import { Text, TrendingUp } from 'lucide-react';
import { CellAction } from './cell-action';

interface AssetColumnProps {
  onEdit?: (asset: Asset) => void;
  onDelete?: (assetId: string) => void;
}

export const createAssetColumns = ({ onEdit, onDelete }: AssetColumnProps): ColumnDef<Asset>[] => [
  {
    id: 'symbol',
    accessorKey: 'symbol',
    header: ({ column }: { column: Column<Asset, unknown> }) => (
      <DataTableColumnHeader column={column} title='Symbol' />
    ),
    cell: ({ cell }) => (
      <div className="font-mono font-semibold">
        {cell.getValue<Asset['symbol']>()}
      </div>
    ),
    meta: {
      label: 'Symbol',
      placeholder: 'Search symbols...',
      variant: 'text',
      icon: TrendingUp
    },
    enableColumnFilter: true
  },
  {
    id: 'name',
    accessorKey: 'name',
    header: ({ column }: { column: Column<Asset, unknown> }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ cell }) => <div>{cell.getValue<Asset['name']>()}</div>,
    meta: {
      label: 'Name',
      placeholder: 'Search names...',
      variant: 'text',
      icon: Text
    },
    enableColumnFilter: true
  },
  {
    accessorKey: 'description',
    header: 'Description',
    cell: ({ cell }) => {
      const description = cell.getValue<Asset['description']>();
      return (
        <div className="max-w-[300px] truncate">
          {description || '-'}
        </div>
      );
    }
  },
  {
    accessorKey: 'created_at',
    header: ({ column }: { column: Column<Asset, unknown> }) => (
      <DataTableColumnHeader column={column} title='Created' />
    ),
    cell: ({ cell }) => {
      const date = new Date(cell.getValue<Asset['created_at']>());
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
      const asset = row.original;
      return (
        <CellAction 
          data={asset} 
          onEdit={onEdit}
          onDelete={onDelete}
        />
      );
    }
  }
];

// Export a default set of columns for backward compatibility
export const assetColumns = createAssetColumns({});