'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { getAssets } from '@/features/assets/actions/asset-actions';
import { getMethodologies } from '@/features/methodologies/actions/methodology-actions';
import { getReportWithBlocks } from '@/features/reports/actions/report-actions';
import { ReportEditor } from '@/features/reports/components/report-editor';
import { Asset, Methodology, ReportWithBlocks } from '@/types';
import { AlertCircle, ArrowLeft, Home, FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ReportEditorViewProps {
  reportId: string;
}

export function ReportEditorView({ reportId }: ReportEditorViewProps) {
  const router = useRouter();
  const [report, setReport] = useState<ReportWithBlocks | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Fetch all required data in parallel
        const [reportResult, assetsResult, methodologiesResult] = await Promise.all([
          getReportWithBlocks(reportId),
          getAssets(),
          getMethodologies(),
        ]);

        if (!reportResult.success) {
          setError(reportResult.error || 'Failed to load report');
          return;
        }

        if (!assetsResult.success) {
          setError(assetsResult.error || 'Failed to load assets');
          return;
        }

        if (!methodologiesResult.success) {
          setError(methodologiesResult.error || 'Failed to load methodologies');
          return;
        }

        setReport(reportResult.report!);
        setAssets(assetsResult.assets || []);
        setMethodologies(methodologiesResult.methodologies || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [reportId]);

  const handleReportUpdated = (updatedReport: ReportWithBlocks) => {
    setReport(updatedReport);
  };

  const handleReportDeleted = () => {
    router.push('/dashboard/reports');
  };

  const handleBack = () => {
    router.push('/dashboard/reports');
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-sm text-muted-foreground">Loading report editor...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>Report not found</AlertDescription>
          </Alert>
          <div className="flex justify-center">
            <Button onClick={handleBack} variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 border-b bg-background">
        <div className="px-6 py-4 space-y-4">


          {/* Report Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <h1 className="text-3xl font-bold tracking-tight">{report.title}</h1>
                <Badge 
                  variant={report.status === 'published' ? 'default' : report.status === 'draft' ? 'secondary' : 'outline'}
                  className="text-xs"
                >
                  {report.status}
                </Badge>
              </div>
              <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Asset:</span>
                  <span>{report.asset.symbol}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Method:</span>
                  <span>{report.methodology.name}</span>
                </div>
                <div className="w-1 h-1 bg-muted-foreground rounded-full"></div>
                <div className="flex items-center space-x-1">
                  <span className="font-medium">Timeframe:</span>
                  <span>{report.main_timeframe}</span>
                </div>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Reports
            </Button>
          </div>
        </div>
      </div>

      {/* Editor Content - This will scroll */}
      <div className="flex-1 overflow-hidden">
        <ReportEditor
          report={report}
          assets={assets}
          methodologies={methodologies}
          onReportUpdated={handleReportUpdated}
          onReportDeleted={handleReportDeleted}
        />
      </div>
    </div>
  );
}