'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { LoaderCircleIcon } from 'lucide-react';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/store';

import {
  fetchPermissions,
  createPermissions,
  updatePermissions
} from '@/store/thunk/userManagement.thunk';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const PermissionAddSchema = z.object({
  name: z.string().nonempty('Permission name is required').min(2).max(50)
});

type PermissionAddSchemaType = z.infer<typeof PermissionAddSchema>;

const PermissionAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
  tenant_id
}: {
  open: boolean;
  closeDialog: () => void;
  isEdit: boolean;
  editData: any;
  tenant_id: any
}) => {

  const dispatch = useDispatch<AppDispatch>();
  const { userDetail } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<PermissionAddSchemaType>({
    resolver: zodResolver(PermissionAddSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {

    if (!open) return;

    if (isEdit && editData?.data) {
      form.reset({
        name: editData.data.name
      });
    } else {
      form.reset({ name: '' });
    }

  }, [open, isEdit, editData, form]);

  const handleSubmit = async (values: PermissionAddSchemaType) => {

    if (!userDetail?.tenant_id) return;

    setIsProcessing(true);

    try {
      let res: any;
      if (isEdit) {
        res = await dispatch(
          updatePermissions({
            id: editData.data.id,
            name: values.name,
            tenant_id
          })
        );

      } else {

        res = await dispatch(
          createPermissions({
            name: values.name,
            tenant_id
          })
        );

      }

      if (res?.meta?.requestStatus === 'fulfilled') {
        dispatch(
          fetchPermissions({
            page: 1,
            per_page: 10,
            id: userDetail.tenant.id
          })
        );

        closeDialog();

        toast.success(
          isEdit
            ? 'Permission Updated Successfully'
            : 'Permission Created Successfully',
          {
            position: 'top-center',
            style: {
              background: '#16a34a',
              color: '#fff'
            }
          }
        );

      }

    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }

  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit' : 'Add'} Permission
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>

          <form onSubmit={form.handleSubmit(handleSubmit)}>

            <DialogBody className="pt-2.5 space-y-6">

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>Permission Name</FormLabel>

                    <FormControl>
                      <Input
                        placeholder="Enter Permission Name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />

                  </FormItem>
                )}
              />

            </DialogBody>

            <DialogFooter>

              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isProcessing}
              >

                {isProcessing && (
                  <LoaderCircleIcon className="animate-spin mr-2" />
                )}

                {isEdit ? 'Update' : 'Add'} Permission

              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>
    </Dialog>
  );
};

export default PermissionAddDialog;