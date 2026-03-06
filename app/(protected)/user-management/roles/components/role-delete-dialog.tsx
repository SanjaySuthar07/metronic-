'use client';

import { RiCheckboxCircleFill, RiErrorWarningFill } from '@remixicon/react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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

const RoleDeleteDialog = ({
  open,
  closeDialog,
  role,
}: {
  open: boolean;
  closeDialog: () => void;
  role: any;
}) => {
  const queryClient = useQueryClient();
  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete the role <strong>{"s"}</strong>?
        </DialogDescription>
        <DialogFooter>
          <Button variant="outline" onClick={closeDialog}>
            Cancel
          </Button>
          <Button
            variant="destructive"
          // onClick={() => mutation.mutate()}
          // disabled={mutation.status === 'pending'}
          >
            {/* {mutation.status === 'pending' && ( */}
            {/* <LoaderCircleIcon className="animate-spin" /> */}
            {/* )} */}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleDeleteDialog;
