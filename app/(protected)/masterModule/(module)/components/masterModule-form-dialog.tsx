'use client';

import { useState } from 'react';
import { LoaderCircleIcon, Trash2 } from 'lucide-react';
import { useDispatch } from 'react-redux';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

import { deleteModule } from '@/store/thunk/masterModule.thunk';
import { AppDispatch } from '@/store';

interface PermissionDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  id: number | null;
  onDeleted: () => void;
}

const PermissionDeleteDialog = ({
  open,
  closeDialog,
  id,
  onDeleted,
}: PermissionDeleteDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!id) return;

    setIsDeleting(true);

    try {
      const res: any = await dispatch(deleteModule(id));

      if (res?.payload?.success || res?.meta?.requestStatus === 'fulfilled') {
        toast.success('Module deleted successfully', {
          position: 'top-center',
          style: {
            background: '#ef4444',
            color: '#fff',
            border: 'none',
          },
        });

        onDeleted(); // This will refetch the list
      } else {
        toast.error('Failed to delete module', {
          position: 'top-center',
        });
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Something went wrong while deleting the module');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-destructive">
            <Trash2 className="size-5" />
            Delete Module
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this module? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={closeDialog}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting || !id}
          >
            {isDeleting ? (
              <>
                <LoaderCircleIcon className="mr-2 size-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 size-4" />
                Yes, Delete Module
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PermissionDeleteDialog;