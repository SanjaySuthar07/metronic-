'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { LoaderCircleIcon } from 'lucide-react';

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { UserAddSchema, UserAddSchemaType } from '../forms/user-add-schema';

import { useDispatch } from 'react-redux';
import {
  fetchRolesDropdown,
  fetchUserDetail,
  fetchUsers,
  updateUser,
} from '@/store/thunk/userManagement.thunk';

const UserAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
  isProfile
}: {
  open: boolean;
  closeDialog: () => void;
  isEdit: boolean;
  editData: any;
  isProfile: boolean
}) => {

  const dispatch = useDispatch();

  const [roles, setRoles] = useState<any[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const form = useForm<UserAddSchemaType>({
    resolver: zodResolver(UserAddSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
    },
  });

  // fetch list of roles for dropdown
  useEffect(() => {
    const fetch = async () => {
      const data: any = await dispatch(fetchRolesDropdown() as any);
      setRoles(data?.payload?.roles || []);
    };

    fetch();
  }, [dispatch]);

  useEffect(() => {
    if (!open) return;

    if (isEdit && editData) {
      const role = roles.find(
        (r: any) => r.name === editData.user_type
      );

      form.reset({
        name: editData.name || '',
        email: editData.email || '',
        roleId: role?.id?.toString() || '',
      });
    } else {
      form.reset({
        name: '',
        email: '',
        roleId: '',
      });
    }
  }, [open, isEdit, editData, roles]);
  const handleSubmit = async (values: UserAddSchemaType) => {
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
      const result: any = await dispatch(updateUser(payload) as any);
      if (updateUser.fulfilled.match(result)) {
        if (isProfile) {
          dispatch(fetchUserDetail(editData));
        } else {
          dispatch(fetchUsers({ page: 1, per_page: 10 }) as any);
        }
      }

      if (result.error) {
        toast.error(result.error.message || 'Failed to save user', {
          position: 'top-center',
        });
      } else {
        toast.custom(
          () => (
            <Alert variant="mono" icon="success" close={false}>
              <AlertIcon>
                <RiCheckboxCircleFill />
              </AlertIcon>
              <AlertTitle>
                {isEdit ? 'User updated successfully' : 'User added successfully'}
              </AlertTitle>
            </Alert>
          ),
          { position: 'top-center' }
        );
        closeDialog();
      }
    } catch (err) {
      console.error('save user error', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (

    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (!value) closeDialog();
      }}
    >

      <DialogContent>

        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit User" : "Add User"}
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
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isEdit}
                        placeholder="Enter email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {!isEdit && (
                <FormField
                  control={form.control}
                  name="roleId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Role</FormLabel>

                      <FormControl>

                        <Select
                          onValueChange={(value) => field.onChange(value)}
                          value={field.value}
                        >

                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>

                          <SelectContent>

                            <SelectGroup>

                              {roles.map((role: any) => (

                                <SelectItem
                                  key={role.id}
                                  value={role.id.toString()}
                                >
                                  {role.name}
                                </SelectItem>

                              ))}

                            </SelectGroup>

                          </SelectContent>

                        </Select>

                      </FormControl>

                      <FormMessage />

                    </FormItem>
                  )}
                />
              )}

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

                {isEdit ? "Update User" : "Add User"}

              </Button>

            </DialogFooter>

          </form>

        </Form>

      </DialogContent>

    </Dialog>
  );
};

export default UserAddDialog;