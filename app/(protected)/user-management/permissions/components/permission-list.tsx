'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { AppDispatch, RootState } from '@/store';
import {
  fetchPermissionsDetail,
  fetchPermissions,
} from '@/store/thunk/userManagement.thunk';

import { EllipsisVertical, Plus, Search } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/helpers';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';

import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';

import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';

import PermissionDeleteDialog from './permission-delete-dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import PermissionAddDialog from './permission-add-dialog';

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddPermission,
  selectedRole,
  onRoleChange,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddPermission: () => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      // const data = await dispatch(fetchRolesDropdown());
      // setRoles(data?.payload?.roles || []);
    };
    fetch();
  }, [dispatch]);

  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />

          <Input
            placeholder="Search permissions..."
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="ps-9 w-full sm:w-64"
          />
        </div>

        {/* <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Type</SelectItem>

            {roles.map((role: any) => (
              <Fragment key={role.id}>
                <SelectItem value={role.name} className="capitalize">
                  {role.name}
                </SelectItem>
              </Fragment>
            ))}
          </SelectContent>
        </Select> */}

      </div>

      <Button className="bg-primary text-white" onClick={onAddPermission}>
        <Plus className="size-4 mr-1" />
        Add Permission
      </Button>
    </CardHeader>
  );
};

const PermissionList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePermissionObj, setDeletePermissionObj] = useState<any>(null);
  const handleDeleteUser = (user: any) => {
    setDeletePermissionObj(user);
    setDeleteDialogOpen(true);
  };

  const refreshUsers = () => {
      // rerun the fetch with current filters/pagination
      const roleFilter =
        selectedRole && selectedRole !== 'all' ? selectedRole : '';
  
      dispatch(
        fetchPermissions({
          page: pagination.pageIndex + 1,
          per_page: pagination.pageSize,
          search: inputValue.trim() || undefined,
          sort: sorting?.[0]?.id,
          dir: sorting?.[0]?.desc ? 'desc' : 'asc',
        })
      );
    };

  const { permissions, loadingPermissions } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>(null);

  const [inputValue, setInputValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const [columnOrder, setColumnOrder] = useState<string[]>([]);
  const [columnPinning, setColumnPinning] = useState<any>({
    left: [],
    right: [],
  });

  const [columnVisibility, setColumnVisibility] = useState({});

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [inputValue, selectedRole]);

  useEffect(() => {

    const sortField = sorting?.[0]?.id;
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const roleFilter =
      selectedRole && selectedRole !== 'all'
        ? selectedRole
        : '';

    dispatch(
      fetchPermissions({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: inputValue.trim() || undefined,
        sort: sortField,
        dir: sortField ? sortDirection : undefined,
      })
    );

  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue,
    selectedRole,
    sorting,
  ]);

  const handleEditPermissions = async (id: number) => {
    try {
      const res: any = await dispatch(fetchPermissionsDetail({ id }));
      if (res?.payload?.permission) {
        setEditData(res.payload.permission);
        setIsEdit(true);
        setInviteDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch permission details", error);
    }
  };
  const columns = useMemo<ColumnDef<any>[]>(() => [

    {
      accessorKey: 'name',
      id: 'name',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="Permission" column={column} />,

      cell: ({ row }) => {

        const permission = row.original;
        const name = permission?.name || '-';

        return (
          <div className="flex items-center gap-3">

            <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name !== '-' ? name : 'N/A')}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <div className="font-medium text-sm capitalize">{name}</div>
            </div>

          </div>
        );
      },

      size: 300,

      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        ),
      },
    },

    {
      accessorKey: 'created_at',
      id: 'created_at',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="Created At" column={column} />,

      cell: ({ row }) => {

        const date = row.original?.created_at;

        return date
          ? formatDate(new Date(date))
          : '-';
      },

      size: 160,

      meta: {
        skeleton: <Skeleton className="h-7 w-28" />,
      },
    },

    {
      id: 'actions',
      header: 'Actions',
      enableSorting: false,
      enableHiding: false,
      size: 75,

      cell: ({ row }) => (

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button
              className="h-7 w-7"
              mode="icon"
              variant="ghost"
            >
              <EllipsisVertical />
            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem
              onClick={() => handleEditPermissions(row.original.id)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteUser(row.original)}>
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>
      ),

      meta: {
        skeleton: <Skeleton className="size-5" />,
      },
    },

  ], []);

  useEffect(() => {
    setColumnOrder(columns.map((col) => col.id as string));
  }, [columns]);

  const table = useReactTable({

    columns,
    data: permissions?.data || [],

    pageCount:
      permissions?.total
        ? Math.ceil(permissions.total / pagination.pageSize)
        : -1,

    manualPagination: true,
    manualSorting: true,

    state: {
      pagination,
      sorting,
      columnOrder,
      columnPinning,
      columnVisibility,
    },

    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnOrderChange: setColumnOrder,
    onColumnPinningChange: setColumnPinning,
    onColumnVisibilityChange: setColumnVisibility,

    columnResizeMode: 'onChange',

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>

      <DataGrid
        table={table}
        recordCount={permissions?.total}
        isLoading={loadingPermissions}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
      >

        <Card>

          <DataGridToolbar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onAddPermission={() => {
              setInviteDialogOpen(true);
              setIsEdit(false);
            }}
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
          />

          <CardTable>
            <ScrollArea>
              <DataGridTable />
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardTable>

          <CardFooter>
            <DataGridPagination />
          </CardFooter>

        </Card>

      </DataGrid>
      
      {
        deletePermissionObj && (
          <PermissionDeleteDialog
            open={deleteDialogOpen}
            closeDialog={() => setDeleteDialogOpen(false)}
            permission={deletePermissionObj}
            onDeleted={() => {
              setDeleteDialogOpen(false);
              refreshUsers();
            }}
          />
        )
      }

      <PermissionAddDialog
        open={inviteDialogOpen}
        isEdit={isEdit}
        editData={editData}
        closeDialog={() => setInviteDialogOpen(false)}
      />

    </>
  );
};

export default PermissionList;