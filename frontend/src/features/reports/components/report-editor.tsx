'use client';

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Save } from 'lucide-react';
import { toast } from 'sonner';
import { ReportWithBlocks, AnalysisBlock, Asset, Methodology } from '@/types';
import { AnalysisBlockComponent } from './analysis-block';
import { updateReport } from '@/features/reports/actions/report-actions';
import { createAnalysisBlock } from '@/features/reports/actions/analysis-block-actions';

interface ReportEditorProps {
  report: ReportWithBlocks;
  assets: Asset[];
  methodologies: Methodology[];
  onReportUpdated: (updatedReport: ReportWithBlocks) => void;
}

const timeframeOptions = [
  'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN1'
];

const biasOptions = [
  { value: 'bullish', label: 'Bullish' },
  { value: 'bearish', label: 'Bearish' },
  { value: 'neutral', label: 'Neutral' },
] as const;

export function ReportEditor({ report, assets, methodologies, onReportUpdated }: ReportEditorProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isAddingBlock, setIsAddingBlock] = useState(false);
  const [reportData, setReportData] = useState({
    title: report.title,
    asset_id: report.asset_id,
    methodology_id: report.methodology_id,
    main_timeframe: report.main_timeframe,
    main_timeframe_bias: report.main_timeframe_bias,
    main_timeframe_notes: report.main_timeframe_notes || '',
    status: report.status,
  });
  
  const [newBlockData, setNewBlockData] = useState({
    timeframe: 'H4',
    bias: 'neutral' as 'bullish' | 'bearish' | 'neutral',
    notes: '',
    snapshot_image_url: '',
  });

  const handleSaveReport = async () => {
    setIsSaving(true);
    try {
      const result = await updateReport(report.id, reportData);

      if (result.success && result.report) {
        // Update the report data in the parent component
        const updatedReport: ReportWithBlocks = {
          ...result.report,
          asset: report.asset,
          methodology: methodologies.find(m => m.id === result.report!.methodology_id) || report.methodology,
          analysis_blocks: report.analysis_blocks,
        };
        onReportUpdated(updatedReport);
        toast.success('Report updated successfully');
      } else {
        toast.error(result.error || 'Failed to update report');
      }
    } catch (error) {
      console.error('Error updating report:', error);
      toast.error('Failed to update report');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBlock = async () => {
    setIsSaving(true);
    try {
      const result = await createAnalysisBlock({
        report_id: report.id,
        ...newBlockData,
      });

      if (result.success && result.data) {
        // Add the new block to the report
        const updatedReport: ReportWithBlocks = {
          ...report,
          analysis_blocks: [...report.analysis_blocks, result.data],
        };
        onReportUpdated(updatedReport);
        
        // Reset the form
        setNewBlockData({
          timeframe: 'H4',
          bias: 'neutral',
          notes: '',
          snapshot_image_url: '',
        });
        setIsAddingBlock(false);
        toast.success('Analysis block added successfully');
      } else {
        toast.error(result.error || 'Failed to add analysis block');
      }
    } catch (error) {
      console.error('Error adding analysis block:', error);
      toast.error('Failed to add analysis block');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBlockUpdated = useCallback((updatedBlock: AnalysisBlock) => {
    const updatedReport: ReportWithBlocks = {
      ...report,
      analysis_blocks: report.analysis_blocks.map(block =>
        block.id === updatedBlock.id ? updatedBlock : block
      ),
    };
    onReportUpdated(updatedReport);
  }, [report, onReportUpdated]);

  const handleBlockDeleted = useCallback((blockId: string) => {
    const updatedReport: ReportWithBlocks = {
      ...report,
      analysis_blocks: report.analysis_blocks.filter(block => block.id !== blockId),
    };
    onReportUpdated(updatedReport);
  }, [report, onReportUpdated]);

  return (
    <div className="h-screen flex flex-col">
      {/* Fixed Header */}
      <div className="flex-shrink-0 bg-background border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">Report Details</h1>
          <Button onClick={handleSaveReport} disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            Save Report
          </Button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="space-y-6">
          {/* Report Metadata Section */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Report Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={reportData.title}
                  onChange={(e) => setReportData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter report title"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asset">Asset</Label>
                  <Select
                    value={reportData.asset_id}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, asset_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select asset" />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((asset) => (
                        <SelectItem key={asset.id} value={asset.id}>
                          {asset.symbol} - {asset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="methodology">Methodology</Label>
                  <Select
                    value={reportData.methodology_id}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, methodology_id: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select methodology" />
                    </SelectTrigger>
                    <SelectContent>
                      {methodologies.map((methodology) => (
                        <SelectItem key={methodology.id} value={methodology.id}>
                          {methodology.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="main_timeframe">Main Timeframe</Label>
                  <Select
                    value={reportData.main_timeframe}
                    onValueChange={(value) => setReportData(prev => ({ ...prev, main_timeframe: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select main timeframe" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeframeOptions.map((tf) => (
                        <SelectItem key={tf} value={tf}>
                          {tf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={reportData.status}
                    onValueChange={(value: 'draft' | 'published') => 
                      setReportData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Main Timeframe Info Section */}
          <Card>
            <CardHeader>
              <CardTitle>Main Timeframe Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Timeframe and Bias Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="main_timeframe_display">Timeframe</Label>
                  <div className="px-3 py-2 bg-muted rounded-md text-sm font-medium">
                    {reportData.main_timeframe}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="main_timeframe_bias">Bias</Label>
                  <Select
                    value={reportData.main_timeframe_bias}
                    onValueChange={(value: 'bullish' | 'bearish' | 'neutral') => 
                      setReportData(prev => ({ ...prev, main_timeframe_bias: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select bias" />
                    </SelectTrigger>
                    <SelectContent>
                      {biasOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Chart Placeholder - Full Width */}
              <div className="space-y-2">
                <Label>Chart Analysis</Label>
                <div className="w-full h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg flex items-center justify-center bg-muted/50">
                  <div className="text-center space-y-2">
                    <div className="text-muted-foreground">Chart visualization will be added here</div>
                    <div className="text-sm text-muted-foreground">Future integration: TradingView chart or custom chart component</div>
                  </div>
                </div>
              </div>

              {/* Notes - Full Width */}
              <div className="space-y-2">
                <Label htmlFor="main_timeframe_notes">Analysis Notes</Label>
                <textarea
                  id="main_timeframe_notes"
                  value={reportData.main_timeframe_notes}
                  onChange={(e) => setReportData(prev => ({ ...prev, main_timeframe_notes: e.target.value }))}
                  placeholder="Enter your main timeframe analysis notes here..."
                  className="min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-y"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          {/* Analysis Blocks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Analysis Blocks</h2>
              <Button
                onClick={() => setIsAddingBlock(true)}
                disabled={isAddingBlock || isSaving}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Block
              </Button>
            </div>

            {/* Add New Block Form */}
            {isAddingBlock && (
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                  <CardTitle>New Analysis Block</CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsAddingBlock(false)}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleAddBlock} disabled={isSaving}>
                      Add Block
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-timeframe">Timeframe</Label>
                      <Select
                        value={newBlockData.timeframe}
                        onValueChange={(value) => setNewBlockData(prev => ({ ...prev, timeframe: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select timeframe" />
                        </SelectTrigger>
                        <SelectContent>
                          {timeframeOptions.map((tf) => (
                            <SelectItem key={tf} value={tf}>
                              {tf}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="new-bias">Bias</Label>
                      <Select
                        value={newBlockData.bias}
                        onValueChange={(value: 'bullish' | 'bearish' | 'neutral') => 
                          setNewBlockData(prev => ({ ...prev, bias: value }))
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select bias" />
                        </SelectTrigger>
                        <SelectContent>
                          {biasOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Adding secondary timeframe analysis. Main timeframe: <strong>{report.main_timeframe}</strong> (configured in report settings above)
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Existing Analysis Blocks */}
            {report.analysis_blocks.length === 0 && !isAddingBlock ? (
              <Card>
                <CardContent className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <p className="text-gray-500 mb-4">No analysis blocks yet</p>
                    <Button onClick={() => setIsAddingBlock(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Block
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {/* Display secondary timeframe blocks sorted by timeframe */}
                {report.analysis_blocks
                  .sort((a, b) => a.timeframe.localeCompare(b.timeframe))
                  .map((block) => (
                    <AnalysisBlockComponent
                      key={block.id}
                      block={block}
                      onBlockUpdated={handleBlockUpdated}
                      onBlockDeleted={handleBlockDeleted}
                    />
                  ))
                }
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}