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
import { mrfresetUser, fetchUsers } from '@/store/thunk/userManagement.thunk';

interface UserDeleteDialogProps {
  open: boolean;
  closeDialog: () => void;
  user: any;
  onMfaReset?: () => void;
    tenant_id: string;

}

const UserMfaResetDialog = ({
  open,
  closeDialog,
  user,
  onMfaReset,
  tenant_id,
}: UserDeleteDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMfaReset = async () => {
      if (!user?.id) return;
          setIsProcessing(true);
          try {
            const res: any = await dispatch(mrfresetUser({ user_id: user.id, tenant_id }) as any);
            if (res.error) {
              toast.error(res.error.message || 'Failed to reset MFA', {
                position: 'top-center',
              });
            }
                else {
                toast.custom(
                    () => (
                        <Alert variant="mono" icon="success">
                            <AlertIcon>
                                <RiCheckboxCircleFill />
                            </AlertIcon>
                            <AlertTitle>MFA Verification reset successfully</AlertTitle>
                        </Alert>
                    ),
                    { position: 'top-center' }
                );
                if (onMfaReset) {
                    onMfaReset();
                } else {
                    dispatch(fetchUsers({ page: 1, per_page: 10 }) as any);
                }
                closeDialog();
            }
          } catch (error) {
            console.error('MFA reset error', error);
          } finally {
            setIsProcessing(false);
          }


     setIsProcessing(true);

    
  };
  // <strong>{user?.email || user?.name || user?.id}</strong>?
  // {isProcessing && <LoaderCircleIcon className="animate-spin" />}
  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm MFA Verification Reset</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to reset MFA for the user <strong>{user?.name}</strong>?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="secondary"
            onClick={handleMfaReset}
            disabled={isProcessing}
          >
            {isProcessing && <LoaderCircleIcon className="animate-spin" />}
            Reset MFA
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserMfaResetDialog;
