'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Heading } from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { MethodologyForm, MethodologyFormData } from '../components/methodology-form';
import { MethodologyTable } from '../components/methodology-table';
import { createMethodologyColumns } from '../components/methodology-table/columns';
import { createMethodology, deleteMethodology, getMethodologies, updateMethodology } from '../actions/methodology-actions';
import { Methodology } from '@/types/methodology';
import { IconPlus } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function MethodologyManagementView() {
  const [methodologies, setMethodologies] = useState<Methodology[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingMethodology, setEditingMethodology] = useState<Methodology | null>(null);

  // Fetch methodologies on component mount
  useEffect(() => {
    fetchMethodologies();
  }, []);

  const fetchMethodologies = async () => {
    try {
      setLoading(true);
      const result = await getMethodologies();
      if (result.success && result.methodologies) {
        setMethodologies(result.methodologies);
      } else {
        toast.error(result.error || 'Failed to fetch methodologies');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateMethodology = async (data: MethodologyFormData) => {
    setSubmitting(true);
    try {
      const result = await createMethodology(data);
      if (result.success && result.methodology) {
        setMethodologies(prev => [result.methodology!, ...prev]);
        setShowForm(false);
        toast.success('Methodology created successfully');
      } else {
        toast.error(result.error || 'Failed to create methodology');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateMethodology = async (data: MethodologyFormData) => {
    if (!editingMethodology) return;
    
    setSubmitting(true);
    try {
      const result = await updateMethodology(editingMethodology.id, data);
      if (result.success && result.methodology) {
        setMethodologies(prev => 
          prev.map(methodology => 
            methodology.id === editingMethodology.id ? result.methodology! : methodology
          )
        );
        setEditingMethodology(null);
        toast.success('Methodology updated successfully');
      } else {
        toast.error(result.error || 'Failed to update methodology');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMethodology = async (methodologyId: string) => {
    try {
      const result = await deleteMethodology(methodologyId);
      if (result.success) {
        setMethodologies(prev => prev.filter(methodology => methodology.id !== methodologyId));
        toast.success('Methodology deleted successfully');
      } else {
        toast.error(result.error || 'Failed to delete methodology');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    }
  };

  const handleEditMethodology = (methodology: Methodology) => {
    setEditingMethodology(methodology);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingMethodology(null);
  };

  if (loading) {
    return (
      <PageContainer scrollable>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading methodologies...</p>
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
            title='Methodology Management'
            description='Manage your trading methodologies for tagging analyses.'
          />
          <Button 
            onClick={() => setShowForm(true)}
            className='text-xs md:text-sm'
          >
            <IconPlus className='mr-2 h-4 w-4' /> Add Methodology
          </Button>
        </div>
        <Separator />
        
        <MethodologyTable
          data={methodologies}
          totalItems={methodologies.length}
          columns={createMethodologyColumns({ onEdit: handleEditMethodology, onDelete: handleDeleteMethodology })}
        />
      </div>

      {/* Create Methodology Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Methodology</DialogTitle>
          </DialogHeader>
          <MethodologyForm
            pageTitle=""
            onSubmit={handleCreateMethodology}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Methodology Dialog */}
      <Dialog open={!!editingMethodology} onOpenChange={() => setEditingMethodology(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Methodology</DialogTitle>
          </DialogHeader>
          <MethodologyForm
            initialData={editingMethodology}
            pageTitle=""
            onSubmit={handleUpdateMethodology}
            loading={submitting}
          />
        </DialogContent>
      </Dialog>
    </PageContainer>
  );
}