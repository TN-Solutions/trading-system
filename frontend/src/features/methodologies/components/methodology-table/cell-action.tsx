'use client';
import { AlertModal } from '@/components/modal/alert-modal';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Methodology } from '@/types/methodology';
import { IconEdit, IconDotsVertical, IconTrash } from '@tabler/icons-react';
import { useState } from 'react';

interface CellActionProps {
  data: Methodology;
  onEdit?: (methodology: Methodology) => void;
  onDelete?: (methodologyId: string) => void;
}

export const CellAction: React.FC<CellActionProps> = ({ 
  data, 
  onEdit, 
  onDelete 
}) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const onConfirm = async () => {
    if (onDelete) {
      setLoading(true);
      try {
        await onDelete(data.id);
        setOpen(false);
      } catch (error) {
        console.error('Failed to delete methodology:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='h-8 w-8 p-0'>
            <span className='sr-only'>Open menu</span>
            <IconDotsVertical className='h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onClick={() => onEdit?.(data)}
          >
            <IconEdit className='mr-2 h-4 w-4' /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <IconTrash className='mr-2 h-4 w-4' /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};