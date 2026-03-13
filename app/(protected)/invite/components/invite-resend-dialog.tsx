'use client';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
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
import { resendInvitation } from '@/store/thunk/invite.thunk';
interface InviteResendDialogProps {
  open: boolean;
  closeDialog: () => void;
  user: any;
  onResent?: (user: any) => void;
}
const InviteResendDialog = ({
  open,
  closeDialog,
  user,
  onResent,
}: InviteResendDialogProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleResend = async () => {
    if (!user?.email || !user?.user_type) return;

    setIsProcessing(true);

    try {
      await dispatch(
        resendInvitation({
          email: user.email,
          user_type: user.user_type,
        })
      ).unwrap();

      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>Invitation resent successfully</AlertTitle>
          </Alert>
        ),
        { position: 'top-center' }
      );

      if (onResent) {
        onResent(user);
      }

      closeDialog();

    } catch (err) {
      console.error('resend invitation error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Resend</DialogTitle>
        </DialogHeader>

        <DialogDescription>
          Are you sure you want to resend the invitation to <strong>{user?.name}</strong>?
        </DialogDescription>

        <DialogFooter>

          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>

          <Button
            variant="mono"
            onClick={handleResend}
            disabled={isProcessing}
          >
            {isProcessing && (
              <LoaderCircleIcon className="animate-spin mr-2" />
            )}
            Resend
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InviteResendDialog;