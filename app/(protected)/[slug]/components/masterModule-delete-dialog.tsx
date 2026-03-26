'use client';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { LoaderCircleIcon } from 'lucide-react';

interface DeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  data: any;
  onConfirm: (id: number) => Promise<void>;
}

const DeleteDialog = ({
  open,
  closeDialog,
  data,
  onConfirm,
}: DeleteDialogProps) => {

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!data?.id) return;

    setIsProcessing(true);

    try {
      await onConfirm(data.id);

      toast.custom(() => (
        <Alert variant="mono" icon="success">
          <AlertIcon>
            <RiCheckboxCircleFill />
          </AlertIcon>
          <AlertTitle>Deleted successfully</AlertTitle>
        </Alert>
      ));

      closeDialog();

    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to delete <strong>{data?.name}</strong>?
        </DialogDescription>

        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isProcessing}
          >
            {isProcessing && <LoaderCircleIcon className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteDialog;