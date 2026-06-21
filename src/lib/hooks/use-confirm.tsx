"use client";

import { useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface ConfirmOptions {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'default' | 'destructive';
}

export function useConfirm() {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const [resolve, setResolve] = useState<((value: boolean) => void) | null>(null);

  const confirm = useCallback((opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((res) => {
      setOptions(opts);
      setResolve(() => res);
    });
  }, []);

  const handleConfirm = () => {
    resolve?.(true);
    setOptions(null);
  };

  const handleCancel = () => {
    resolve?.(false);
    setOptions(null);
  };

  const ConfirmModal = () => (
    <Dialog open={!!options} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{options?.title}</DialogTitle>
          <DialogDescription>{options?.message}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            {options?.cancelLabel || 'Batal'}
          </Button>
          <Button
            variant={options?.variant === 'destructive' ? 'destructive' : 'default'}
            onClick={handleConfirm}
          >
            {options?.confirmLabel || 'Ya'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );

  return { confirm, ConfirmModal };
}
