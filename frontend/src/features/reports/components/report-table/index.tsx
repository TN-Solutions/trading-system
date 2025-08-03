'use client';

import { DataTable } from '@/components/ui/table/data-table';
import { DataTableToolbar } from '@/components/ui/table/data-table-toolbar';
import { useDataTable } from '@/hooks/use-data-table';
import { ReportWithDetails } from '@/types/report';
import { ColumnDef } from '@tanstack/react-table';
import { parseAsInteger, useQueryState } from 'nuqs';
import { useRouter } from 'next/navigation';

interface ReportTableParams<TData, TValue> {
  data: TData[];
  totalItems: number;
  columns: ColumnDef<TData, TValue>[];
  onEdit?: (report: ReportWithDetails) => void;
  onDelete?: (reportId: string) => void;
}

export function ReportTable<TData, TValue>({
  data,
  totalItems,
  columns,
  onEdit,
  onDelete
}: ReportTableParams<TData, TValue>) {
  const router = useRouter();
  const [pageSize] = useQueryState('perPage', parseAsInteger.withDefault(10));

  const pageCount = Math.ceil(totalItems / pageSize);

  const { table } = useDataTable({
    data,
    columns,
    pageCount: pageCount,
    shallow: false,
    debounceMs: 500
  });

  const handleRowClick = (row: any) => {
    // Navigate to the report editor page
    router.push(`/dashboard/reports/${row.original.id}`);
  };

  return (
    <DataTable table={table} onRowClick={handleRowClick}>
      <DataTableToolbar table={table} />
    </DataTable>
  );
}