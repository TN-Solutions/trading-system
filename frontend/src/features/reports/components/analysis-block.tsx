'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Save, Edit2, X } from 'lucide-react';
import { TradingChart } from '@/components/charts';
import { ImageUpload } from '@/components/ui/image-upload';
import { AnalysisBlock } from '@/types';
import { updateAnalysisBlock, deleteAnalysisBlock } from '@/features/reports/actions/analysis-block-actions';
import { toast } from 'sonner';

interface AnalysisBlockProps {
  block: AnalysisBlock;
  onBlockUpdated: (updatedBlock: AnalysisBlock) => void;
  onBlockDeleted: (blockId: string) => void;
}

const biasOptions = [
  { value: 'bullish', label: 'Bullish', color: 'bg-green-100 text-green-800' },
  { value: 'bearish', label: 'Bearish', color: 'bg-red-100 text-red-800' },
  { value: 'neutral', label: 'Neutral', color: 'bg-gray-100 text-gray-800' },
] as const;

const timeframeOptions = [
  'M1', 'M5', 'M15', 'M30', 'H1', 'H4', 'D1', 'W1', 'MN1'
];

export function AnalysisBlockComponent({ block, onBlockUpdated, onBlockDeleted }: AnalysisBlockProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [initialFormData] = useState({
    timeframe: block.timeframe,
    bias: block.bias,
    notes: block.notes || '',
    snapshot_image_url: block.snapshot_image_url || '',
  });
  const [formData, setFormData] = useState(initialFormData);

  // Check if there are changes
  const hasChanges = formData.timeframe !== initialFormData.timeframe ||
                     formData.bias !== initialFormData.bias ||
                     formData.notes !== initialFormData.notes ||
                     formData.snapshot_image_url !== initialFormData.snapshot_image_url;

  const currentBias = biasOptions.find(option => option.value === formData.bias);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const result = await updateAnalysisBlock({
        id: block.id,
        ...formData,
      });

      if (result.success && result.data) {
        onBlockUpdated(result.data);
        toast.success('Analysis block updated successfully');
      } else {
        toast.error(result.error || 'Failed to update analysis block');
      }
    } catch (error) {
      console.error('Error updating analysis block:', error);
      toast.error('Failed to update analysis block');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this analysis block? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await deleteAnalysisBlock(block.id);

      if (result.success) {
        onBlockDeleted(block.id);
        toast.success('Analysis block deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete analysis block');
      }
    } catch (error) {
      console.error('Error deleting analysis block:', error);
      toast.error('Failed to delete analysis block');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex items-center space-x-3">
          <CardTitle className="text-lg font-semibold">
            Secondary Analysis - {formData.timeframe}
          </CardTitle>
          {currentBias && (
            <Badge className={currentBias.color}>
              {currentBias.label}
            </Badge>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            onClick={handleSave}
            disabled={isLoading || !hasChanges}
          >
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            disabled={isLoading}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Secondary timeframe layout - Two columns */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-[400px]">
          {/* Left column - Chart area with tabs */}
          <div className="flex flex-col">
            <Tabs defaultValue="chart" className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">Chart</TabsTrigger>
                <TabsTrigger value="screenshot">Chart Screenshot</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="flex-1 mt-4">
                <div className="flex flex-col h-full">
                  <Label className="mb-2">Chart - {formData.timeframe}</Label>
                  <div className="flex-1">
                    <TradingChart 
                      height={300}
                      symbol="EURUSD" 
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="screenshot" className="flex-1 mt-4">
                <div className="flex flex-col h-full">
                  <Label className="mb-2">Chart Screenshot</Label>
                  
                  <div className="flex-1 flex flex-col">
                    <ImageUpload
                      value={formData.snapshot_image_url}
                      onChange={(url) => setFormData(prev => ({ ...prev, snapshot_image_url: url || '' }))}
                      disabled={isLoading}
                      className="w-full flex-1"
                      maxSizeBytes={2 * 1024 * 1024}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Upload a screenshot for this timeframe (max 2MB)
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          {/* Right column - Form section */}
          <div className="flex flex-col space-y-4">
            <div className="flex-1 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="timeframe">Timeframe</Label>
                <Select
                  value={formData.timeframe}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, timeframe: value }))}
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
                <Label htmlFor="bias">Bias</Label>
                <Select
                  value={formData.bias}
                  onValueChange={(value: 'bullish' | 'bearish' | 'neutral') => 
                    setFormData(prev => ({ ...prev, bias: value }))
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

              <div className="space-y-2">
                <Label htmlFor="notes">Analysis Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Add analysis notes..."
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="resize-none"
                />
              </div>


            </div>
            
            <div className="text-xs text-gray-500 mt-auto">
              Created: {new Date(block.created_at).toLocaleString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}