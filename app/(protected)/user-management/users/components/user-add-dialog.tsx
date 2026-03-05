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
import { fetchRolesDropdown } from '@/store/thunk/userManagement.thunk';

const UserAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
}: {
  open: boolean;
  closeDialog: () => void;
  isEdit: boolean;
  editData: any;
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

  useEffect(() => {
    const fetchRoles = async () => {
      const data: any = await dispatch(fetchRolesDropdown());
      setRoles(data?.payload?.roles || []);
    };

    fetchRoles();
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

    setTimeout(() => {

      toast.custom(
        () => (
          <Alert variant="mono" icon="success" close={false}>
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>
              {isEdit ? "User updated successfully" : "User added successfully"}
            </AlertTitle>
          </Alert>
        ),
        { position: 'top-center' }
      );

      setIsProcessing(false);
      closeDialog();

    }, 800);

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