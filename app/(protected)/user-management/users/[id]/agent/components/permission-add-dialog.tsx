'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { LoaderCircleIcon } from 'lucide-react';
import { z } from 'zod';

import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useDispatch } from 'react-redux';
import {
  fetchPermissions,
  createPermissions,
  updatePermissions
} from '@/store/thunk/userManagement.thunk';
import { PermissionsAddSchemaType } from '../forms/permissions-add-schema';

// Permission form schema
const PermissionAddSchema = z.object({
  name: z.string().nonempty('Permission name is required').min(2).max(50)
});
type PermissionAddSchemaType = z.infer<typeof PermissionAddSchema>;
  const PermissionAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
}: {
  open: boolean;
  closeDialog: () => void;
  isEdit: boolean
  editData: any
  onSave: (data: any) => void
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const dispatch = useDispatch(); 
  
  const form = useForm<PermissionAddSchemaType>({
    resolver: zodResolver(PermissionAddSchema),
    defaultValues: {
      name: ''
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    if (open) {
      if (isEdit && editData) {
        form.reset({
          name: editData.name || ''
        });
      } else {
        form.reset({
          name: ''
        });
      }
    }
  }, [open, isEdit, editData, form]);
  const handleSubmit = async (values: PermissionsAddSchemaType) => {
      console.log('submit values');
      setIsProcessing(true);
  
      try {
        const payload: any = {
          ...values,
        };

        if (isEdit) {
          delete payload.roleId;
        }

        if (isEdit && editData?.id) {
          payload.id = editData.id;
        }

        let res: any;
        if (isEdit) {
          res = await dispatch(updatePermissions(payload));
        } else {
          res = await dispatch(createPermissions({ name: values.name}));
        }

        // const result: any = await dispatch(updatePermissions(payload) as any);
        // if(updatePermissions.fulfilled.match(result)) {
        //   dispatch(fetchPermissions({ page: 1, per_page: 10 }) as any);
        // }
  
        // if (result.error) {
        //   toast.error(result.error.message || 'Failed to save permission', {
        //     position: 'top-center',
        //   });
        // } else {
        //   toast.custom(
        //     () => (
        //       <Alert variant="mono" icon="success" close={false}>
        //         <AlertIcon>
        //           <RiCheckboxCircleFill />
        //         </AlertIcon>
        //         <AlertTitle>
        //           {isEdit ? 'Permission updated successfully' : 'Permission added successfully'}
        //         </AlertTitle>
        //       </Alert>
        //     ),
        //     { position: 'top-center' }
        //   );
        //   closeDialog();
        // }

        if (res?.meta?.requestStatus === "fulfilled") {
          await dispatch(fetchPermissions({ page: 1, per_page: 10 }));
          closeDialog();
          toast.success(
            isEdit
              ? "Permissions Update Successfully"
              : "Permission Created Successfully",
            {
              position: "top-center",
              style: {
                background: "#16a34a",
                color: "#fff",
                border: "none",
              },
            }
          );
        }
      } catch (err) {
        console.error('save user error', err);
      } finally {
        setIsProcessing(false);
      }
    };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit' : 'Add'} Permission</DialogTitle>
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
                      <Input placeholder="Enter Permission Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </DialogBody>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog}>
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={!form.formState.isDirty || isProcessing}
              >
                {isProcessing && (
                  <LoaderCircleIcon className="animate-spin" />
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