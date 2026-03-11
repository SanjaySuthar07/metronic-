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
interface InviteDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  user: any;
  onDeleted?: (user: any) => void;
}
const InviteDeleteDialog = ({
  open,
  closeDialog,
  user,
  onDeleted,
}: InviteDeleteDialogProps) => {

  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {

    if (!user?.id) return;

    setIsProcessing(true);

    try {

      // fake delay (optional)
      await new Promise((res) => setTimeout(res, 500));

      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>User deleted successfully</AlertTitle>
          </Alert>
        ),
        { position: 'top-center' }
      );

      if (onDeleted) {
        onDeleted(user);
      }

      closeDialog();

    } catch (err) {
      console.error('delete user error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to delete the user <strong>{user?.name}</strong>?
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
            {isProcessing && (
              <LoaderCircleIcon className="animate-spin mr-2" />
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteDeleteDialog;