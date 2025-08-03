import { Skeleton } from '@/components/ui/skeleton';
import { ReportEditorView } from '@/features/reports/page-views/report-editor-view';
import { Suspense } from 'react';

interface ReportEditorPageProps {
  params: Promise<{
    reportId: string;
  }>;
}

export default async function ReportEditorPage({ params }: ReportEditorPageProps) {
  const { reportId } = await params;
  
  return (
    <div className="">
      <Suspense fallback={<ReportEditorSkeleton />}>
        <ReportEditorView reportId={reportId} />
      </Suspense>
    </div>
  );
}

function ReportEditorSkeleton() {
  return (
    <div className="flex h-full flex-col space-y-6 p-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-20" />
      </div>
      
      {/* Report metadata skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
      
      {/* Analysis blocks skeleton */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-10 w-28" />
        </div>
        
        {/* Block cards skeleton */}
        {[1, 2].map((i) => (
          <div key={i} className="rounded-lg border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-8 w-8" />
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}