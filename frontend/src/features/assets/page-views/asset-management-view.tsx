'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { AssetForm, AssetFormData } from '../components/asset-form';
import { AssetTable } from '../components/asset-table';
import { createAssetColumns } from '../components/asset-table/columns';
import { createAsset, deleteAsset, getAssets, updateAsset } from '../actions/asset-actions';
import { Asset } from '@/types/asset';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function AssetManagementView() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);

  // Fetch assets on component mount
  useEffect(() => {
    fetchAssets();
  }, []);

  const fetchAssets = async () => {
    try {
      setLoading(true);
      const result = await getAssets();
      if (result.success && result.assets) {
        setAssets(result.assets);
      } else {
        toast.error(result.error || 'Failed to fetch assets');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAsset = async (data: AssetFormData) => {
    setSubmitting(true);
    try {
      const result = await createAsset(data);
      if (result.success && result.asset) {
        setAssets(prev => [result.asset!, ...prev]);
        setShowForm(false);
        toast.success('Asset created successfully');
      } else {
        toast.error(result.error || 'Failed to create asset');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAsset = async (data: AssetFormData) => {
    if (!editingAsset) return;
    
    setSubmitting(true);
    try {
      const result = await updateAsset(editingAsset.id, data);
      if (result.success && result.asset) {
        setAssets(prev => 
          prev.map(asset => 
            asset.id === editingAsset.id ? result.asset! : asset
          )
        );
        setEditingAsset(null);
        toast.success('Asset updated successfully');
      } else {
        toast.error(result.error || 'Failed to update asset');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    try {
      const result = await deleteAsset(assetId);
      if (result.success) {
        setAssets(prev => prev.filter(asset => asset.id !== assetId));
        toast.success('Asset deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete asset');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAsset(null);
  };

  // Use assets directly since actions are handled at the component level

  if (loading) {
    return (
      <PageContainer scrollable>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading assets...</p>
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
            title='Asset Management'
            description='Manage your trading assets for creating reports.'
          />
          <Button 
            onClick={() => setShowForm(true)}
            className='text-xs md:text-sm'
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add Asset
          </Button>
        </div>
        <Separator />
        
        <AssetTable
          data={assets}
          totalItems={assets.length}
          columns={createAssetColumns({ onEdit: handleEditAsset, onDelete: handleDeleteAsset })}
        />
      </div>

      {/* Create Asset Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Asset</DialogTitle>
          </DialogHeader>
          <AssetForm
            pageTitle=""
            onSubmit={handleCreateAsset}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Asset Dialog */}
      <Dialog open={!!editingAsset} onOpenChange={() => setEditingAsset(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Asset</DialogTitle>
          </DialogHeader>
          <AssetForm
            initialData={editingAsset}
            pageTitle=""
            onSubmit={handleUpdateAsset}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}