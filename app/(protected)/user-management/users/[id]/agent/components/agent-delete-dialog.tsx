'use client';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
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
import { AppDispatch } from '@/store';
import { deleteUser, fetchUsers } from '@/store/thunk/userManagement.thunk';

interface UserDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  user: any;
  onDeleted?: () => void;
  tenant_id: any;
}

const AgentDeleteDialog = ({
  open,
  closeDialog,
  user,
  onDeleted,
  tenant_id,
}: UserDeleteDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleDelete = async () => {
    if (!user?.id) return;
    setIsProcessing(true);
    try {
      const res: any = await dispatch(deleteUser({ id: user.id, tenant_id }) as any);
      if (res.error) {
        toast.error(res.error.message || 'Failed to delete user', {
          position: 'top-center',
        });
      } else {
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
          onDeleted();
        } else {
          dispatch(fetchUsers({ page: 1, per_page: 10, tenant_id }) as any);
        }
        closeDialog();
      }
    } catch (err) {
      console.error('delete user error', err);
    } finally {
      setIsProcessing(false);
    }
  };
  // <strong>{user?.email || user?.name || user?.id}</strong>?
  // {isProcessing && <LoaderCircleIcon className="animate-spin" />}
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
            {isProcessing && <LoaderCircleIcon className="animate-spin" />}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AgentDeleteDialog;
