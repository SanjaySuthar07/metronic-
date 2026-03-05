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
import { fetchRoles, fetchUsers } from '@/store/thunk/userManagement.thunk';

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

import UserInviteDialog from './user-add-dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';


// ======================= TOOLBAR =======================

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
  selectedRole,
  onRoleChange,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddUser: () => void;
  selectedRole: string;
  onRoleChange: (value: string) => void;
}) => {

  const dispatch = useDispatch<AppDispatch>();

  const { roles } = useSelector((state: RootState) => state.userManagement);

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />

          <Input
            placeholder="Search users"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="ps-9 w-full sm:w-64"
          />
        </div>

        <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Type</SelectItem>

            {roles?.data?.map((role: any) => (
              <Fragment key={role.id}>
                <SelectItem value={role.name}>{role.name}</SelectItem>
              </Fragment>
            ))}
          </SelectContent>
        </Select>

      </div>

      <Button className="bg-primary text-white" onClick={onAddUser}>
        <Plus className="size-4 mr-1" />
        Add User
      </Button>

    </CardHeader>
  );
};


// ======================= USER LIST =======================

const UserList = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { users, loadingUsers } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState<any>();

  const [inputValue, setInputValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);


  // reset page when filter changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [inputValue, selectedRole]);


  // fetch users
  useEffect(() => {

    const sortField = sorting?.[0]?.id;
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    const roleFilter =
      selectedRole && selectedRole !== 'all'
        ? selectedRole
        : '';

    dispatch(
      fetchUsers({
        user_type: roleFilter,
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


  // ================= TABLE COLUMNS =================

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      id: 'name',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="User" column={column} />,

      cell: ({ row }) => {

        const user = row.original;
        const name = user?.name || '-';
        const email = user?.email || '-';

        return (
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name !== '-' ? name : email)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <div className="font-medium text-sm">{name}</div>
              <div className="text-muted-foreground text-xs">{email}</div>
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
      accessorKey: 'user_type',
      id: 'user_type',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="User Type" column={column} />,

      cell: ({ row }) => {
        const type = row.original?.user_type;

        return type ? (
          <Badge variant="secondary" className="capitalize">
            {type}
          </Badge>
        ) : '-';
      },

      size: 160,

      meta: {
        skeleton: <Skeleton className="h-7 w-24" />,
      },
    },

    {
      accessorKey: 'created_at',
      id: 'created_at',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="Joined" column={column} />,

      cell: ({ row }) => {
        const date = row.original?.created_at;
        return date ? formatDate(new Date(date)) : '-';
      },

      size: 160,

      meta: {
        skeleton: <Skeleton className="h-7 w-28" />,
      },
    },

    {
      id: 'actions',
      header: 'Actions',

      cell: ({ row }) => (

        <DropdownMenu>

          <DropdownMenuTrigger asChild>
            <Button className="h-7 w-7" mode="icon" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>

            <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setInviteDialogOpen(true);
                setIsEdit(true);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>
      ),

      size: 75,
      enableSorting: false,
      enableResizing: false,

      meta: {
        skeleton: <Skeleton className="size-5" />,
      },
    },

  ], []);


  const table = useReactTable({

    columns,
    data: users?.data || [],

    pageCount:
      users?.total
        ? Math.ceil(users.total / pagination.pageSize)
        : -1,

    manualPagination: true,
    manualSorting: true,

    state: {
      pagination,
      sorting,
    },

    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });


  return (
    <>
      <DataGrid
        table={table}
        recordCount={users?.total}
        isLoading={loadingUsers}
      >

        <Card>

          <DataGridToolbar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onAddUser={() => {
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

      <UserInviteDialog
        open={inviteDialogOpen}
        isEdit={isEdit}
        editData={editData}
        closeDialog={() => setInviteDialogOpen(false)}
      />
    </>
  );
};

export default UserList;