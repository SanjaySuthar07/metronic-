'use client';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

import { fetchPermissionsDropdown } from '@/store/thunk/userManagement.thunk';
import { X } from 'lucide-react';

const RoleViewDialog = ({
  open,
  closeDialog,
  tenant_id,
  editData,
}: {
  open: boolean;
  closeDialog: () => void;
  editData: any;
  tenant_id: any;
}) => {
  const dispatch = useDispatch();

  const [permissionList, setPermissionList] = useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [roleName, setRoleName] = useState('');

  useEffect(() => {
    const getPermissions = async () => {
      const res: any = await dispatch(fetchPermissionsDropdown());
      setPermissionList(res?.payload?.permissions || []);
    };
    getPermissions();
  }, [dispatch]);

  useEffect(() => {
    if (open && editData) {
      const permissionIds =
        editData?.permissions?.map((p: any) => p.id) ?? [];

      setSelectedPermissions(permissionIds);
      setRoleName(editData?.name || '');
    }
  }, [open, editData]);

  useEffect(() => {
    if (!open) {
      setSelectedPermissions([]);
      setRoleName('');
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>View Role</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <X onClick={closeDialog} className='absolute right-4 top-4 cursor-pointer'  ></X>
        <div className="space-y-6">

          {/* Role Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Role Name
            </label>

            <Input
              value={roleName}
              readOnly
              placeholder="Enter role name"
            />
          </div>

          {/* Permissions */}
          <div className="space-y-2">
            <label className="text-sm font-medium leading-none">
              Permissions
            </label>

            <div className="flex flex-wrap gap-1.5 text-sm text-muted-foreground border border-input rounded-md px-3 py-3 max-h-100 overflow-y-auto">
              {selectedPermissions.length > 0 ? (
                selectedPermissions.map((permissionId) => {
                  const permission = permissionList.find(
                    (p: any) => p.id === permissionId
                  );
                  return (
                    <Badge
                      className="p-4 m-1"
                      key={permissionId}
                      variant="secondary"
                    >
                      {permission?.name}
                    </Badge>
                  );
                })
              ) : (
                <span className="text-sm text-muted-foreground">
                  No permissions assigned.
                </span>
              )}
            </div>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RoleViewDialog;