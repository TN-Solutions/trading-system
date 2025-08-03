'use client';

import { Button } from '@/components/ui/button';
import { IconPlus } from '@tabler/icons-react';

interface CreateReportButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function CreateReportButton({ onClick, disabled = false }: CreateReportButtonProps) {
  return (
    <Button onClick={onClick} disabled={disabled}>
      <IconPlus className='mr-2 h-4 w-4' />
      Create New Report
    </Button>
  );
}