'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { ReportForm, ReportFormData } from '../components/report-form';
import { ReportTable } from '../components/report-table';
import { createReportColumns } from '../components/report-table/columns';
import { createReport, deleteReport, getReports, ReportCreateData } from '../actions/report-actions';
import { getAssets } from '@/features/assets/actions/asset-actions';
import { getMethodologies } from '@/features/methodologies/actions/methodology-actions';
import { ReportWithDetails } from '@/types/report';
import { Asset } from '@/types/asset';
import { Methodology } from '@/types/methodology';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ReportManagementView() {
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch all required data in parallel
      const [reportsResult, assetsResult, methodologiesResult] = await Promise.all([
        getReports(),
        getAssets(),
        getMethodologies()
      ]);

      if (reportsResult.success && reportsResult.reports) {
        setReports(reportsResult.reports);
      } else {
        toast.error(reportsResult.error || 'Failed to fetch reports');
      }

      if (assetsResult.success && assetsResult.assets) {
        setAssets(assetsResult.assets);
      } else {
        toast.error(assetsResult.error || 'Failed to fetch assets');
      }

      if (methodologiesResult.success && methodologiesResult.methodologies) {
        setMethodologies(methodologiesResult.methodologies);
      } else {
        toast.error(methodologiesResult.error || 'Failed to fetch methodologies');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateReport = async (data: ReportFormData) => {
    setSubmitting(true);
    try {
      const result = await createReport(data as ReportCreateData);
      if (result.success && result.report) {
        // Fetch the updated report with asset and methodology details
        const reportsResult = await getReports();
        if (reportsResult.success && reportsResult.reports) {
          setReports(reportsResult.reports);
        }
        setShowForm(false);
        toast.success('Report created successfully');
      } else {
        toast.error(result.error || 'Failed to create report');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };


  const handleDeleteReport = async (reportId: string) => {
    try {
      const result = await deleteReport(reportId);
      if (result.success) {
        setReports(prev => prev.filter(report => report.id !== reportId));
        toast.success('Report deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete report');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };



  const canCreateReport = assets.length > 0 && methodologies.length > 0;

  if (loading) {
    return (
      <PageContainer scrollable>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading reports...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer scrollable={false}>
      <div className='flex flex-1 flex-col space-y-4'>
        <div className='flex items-start justify-between'>
          <Heading
            title='Report Management'
            description='Create and manage your trading analysis reports.'
          />
          <Button 
            onClick={() => setShowForm(true)}
            className='text-xs md:text-sm'
            disabled={!canCreateReport}
            title={!canCreateReport ? 'You need at least one asset and one methodology to create a report' : ''}
          >
            <IconPlus className='mr-2 h-4 w-4' /> Create Report
          </Button>
        </div>
        <Separator />
        
        {!canCreateReport && (
          <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Setup Required
                </h3>
                <div className="mt-2 text-sm text-orange-700 dark:text-orange-300">
                  <p>
                    To create reports, you need at least one asset and one methodology. 
                    Please create them first in their respective management pages.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <ReportTable
          data={reports}
          totalItems={reports.length}
          columns={createReportColumns({ onDelete: handleDeleteReport })}
        />
      </div>

      {/* Create Report Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Report</DialogTitle>
          </DialogHeader>
          <ReportForm
            pageTitle=""
            onSubmit={handleCreateReport}
            loading={submitting}
            assets={assets}
            methodologies={methodologies}
          />
        </DialogContent>
      </Dialog>

    </PageContainer>
  );
}