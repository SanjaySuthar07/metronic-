'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { RiCheckboxCircleFill } from '@remixicon/react';
import { Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';

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

import { UserAddSchema, UserAddSchemaType } from '../forms/invite-add-schema';

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Agent' },
  { id: 3, name: 'Agency' },
];

const InviteAddDialog = ({
  open,
  closeDialog,
  isEdit,
  editData,
  onSave,
}: {
  open: boolean;
  closeDialog: () => void;
  isEdit: boolean;
  editData: any;
  onSave: (data: any) => void;
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const form = useForm<UserAddSchemaType>({
    resolver: zodResolver(UserAddSchema),
    defaultValues: {
      name: '',
      email: '',
      roleId: '',
    },
  });

  useEffect(() => {

    if (!open) return;

    if (isEdit && editData) {

      const role = roles.find(
        (r) => r.name === editData.user_type
      );

      form.reset({
        name: editData.name || '',
        email: editData.email || '',
        password: "",
        roleId: role?.id || '',
      });

    } else {

      form.reset({
        name: '',
        email: '',
        roleId: '',
      });

    }

  }, [open, isEdit, editData]);

  const handleSubmit = async (values: UserAddSchemaType) => {
    setIsProcessing(true);
    try {
      await new Promise((res) => setTimeout(res, 500));
      const role = roles.find((r) => r.id === values.roleId);
      const payload = {
        id: isEdit ? editData.id : Date.now(),
        name: values.name,
        email: values.email,
        user_type: role?.name || '',
        created_at: isEdit ? editData.created_at : new Date().toISOString(),
      };

      onSave(payload);

      toast.custom(
        () => (
          <Alert variant="mono" icon="success">
            <AlertIcon>
              <RiCheckboxCircleFill />
            </AlertIcon>
            <AlertTitle>
              {isEdit
                ? 'User updated successfully'
                : 'User added successfully'}
            </AlertTitle>
          </Alert>
        ),
        { position: 'top-center' }
      );

      closeDialog();

    } catch (err) {
      console.error(err);
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
            Invite
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
                    <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
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
                    <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
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
                name="password"
                render={({ field }) => (
                  <FormItem>

                    <FormLabel>
                      Password <span className="text-red-500">*</span>
                    </FormLabel>

                    <div className="relative">

                      <FormControl>
                        <Input
                          type={passwordVisible ? 'text' : 'password'}
                          placeholder="Enter your password"
                          autoComplete="current-password"
                          className="pr-10"
                          {...field}
                        />
                      </FormControl>

                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPasswordVisible(!passwordVisible)}
                        className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                      >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                      </Button>

                    </div>
                    <FormMessage />
                  </FormItem>

                )}

              />


              <FormField
                control={form.control}
                name="roleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {roles.map((role) => (
                              <SelectItem
                                key={role.id}
                                value={role.id}
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
                Invite user
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteAddDialog;