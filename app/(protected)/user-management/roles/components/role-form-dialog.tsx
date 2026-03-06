'use client';

import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch } from 'react-redux';

import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import { Button } from '@/components/ui/button';

import { Badge, BadgeButton } from '@/components/ui/badge';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandCheck,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { ScrollArea } from '@/components/ui/scroll-area';

import { RoleSchema, RoleSchemaType } from '../forms/role-schema';
import { fetchPermissionsDropdown, updateRoles } from '@/store/thunk/userManagement.thunk';

const RoleInviteDialog = ({
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
  const queryClient = useQueryClient();

  const [permissionList, setPermissionList] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isProcess, setIsProcess] = useState(false)
  const form = useForm<RoleSchemaType>({
    // resolver: zodResolver(RoleSchema),
    defaultValues: {
      name: '',
      permissions: [],
    },
    mode: 'onSubmit',
  });

  useEffect(() => {
    const getPermissions = async () => {
      const res: any = await dispatch(fetchPermissionsDropdown());
      setPermissionList(res?.payload?.permissions || []);
    };

    getPermissions();
  }, [dispatch]);

  useEffect(() => {
    if (!open) {
      form.reset();
      setSelectedPermissions([]);
    }
  }, [open, form]);

  useEffect(() => {
    if (open && editData) {
      const permissionIds =
        editData?.permissions?.map((p: any) => p.id) ?? [];

      form.reset({
        name: editData?.name || '',
        permissions: permissionIds,
      });

      setSelectedPermissions(permissionIds);
    }
  }, [open, editData, form]);

  useEffect(() => {
    form.setValue('permissions', selectedPermissions, {
      shouldDirty: true,
    });

    form.trigger('permissions');
  }, [selectedPermissions, form]);

  const togglePermissionSelection = (permissionId: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId]
    );
  };
  const handleSubmit = async (values: RoleSchemaType) => {
    setIsProcess(true);
    const payload = {
      id: editData?.id,
      name: values.name,
      permissions: selectedPermissions,
    };

    const res: any = await dispatch(updateRoles(payload));
    console.log(res)
    setIsProcess(false);
    if (res?.meta?.requestStatus == "fulfilled") {
      dispatch(
        fetchRoles({
          page: 1,
          per_page: 10,
        })
      );
      closeDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Edit Role' : 'Add Role'}
          </DialogTitle>
          <DialogDescription>

          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role Name</FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter role name"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions"
              render={() => (
                <FormItem>
                  <FormLabel>Permissions</FormLabel>
                  <div className="flex flex-wrap gap-1.5 text-sm text-muted-foreground border border-input rounded-md px-3 py-3 max-h-52 overflow-y-auto">
                    {selectedPermissions.length > 0 ? (
                      selectedPermissions.map((permissionId) => {
                        const permission = permissionList.find(
                          (p: any) => p.id === permissionId
                        );
                        return (
                          <Badge
                            key={permissionId}
                            variant="secondary"
                          >
                            {permission?.name || permissionId}
                            <BadgeButton
                              onClick={() =>
                                togglePermissionSelection(
                                  permissionId
                                )
                              }
                            >
                              <X size={14} />
                            </BadgeButton>
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        No permissions assigned.
                      </span>
                    )}
                  </div>

                  <div className="pt-1">
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                          >
                            Add Permissions
                          </Button>
                        </PopoverTrigger>

                        <PopoverContent
                          className="w-[250px] p-0"
                          align="start"
                        >
                          <Command>
                            <CommandInput placeholder="Search permissions..." />

                            <CommandList>
                              <CommandEmpty>
                                No permissions found.
                              </CommandEmpty>

                              <CommandGroup>
                                <ScrollArea className="h-[220px]">
                                  {permissionList.map(
                                    (permission) => (
                                      <CommandItem
                                        key={permission.id}
                                        onSelect={() =>
                                          togglePermissionSelection(
                                            permission.id
                                          )
                                        }
                                      >
                                        <span className="flex-1">
                                          {permission.name}
                                        </span>

                                        <CommandCheck
                                          className={
                                            selectedPermissions.includes(
                                              permission.id
                                            )
                                              ? 'opacity-100'
                                              : 'opacity-0'
                                          }
                                        />
                                      </CommandItem>
                                    )
                                  )}
                                </ScrollArea>
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>

              <Button type="submit">
                {
                  isProcess ? <LoaderCircleIcon className="animate-spin" /> :
                    isEdit ? 'Update Role' : 'Create Role'
                }



              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoleInviteDialog;