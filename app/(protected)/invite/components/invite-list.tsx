'use client';

import { Fragment, useEffect, useMemo, useState } from 'react';
import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

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

import { useRouter } from 'next/navigation';
import InviteAddDialog from './invite-add-dialog';
import InviteDeleteDialog from './role-delete-dialog';

import { useDispatch, useSelector } from 'react-redux';
import { fetchInvitation } from '@/store/thunk/invite.thunk';
import { RootState, AppDispatch } from '@/store';

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Agent' },
  { id: 3, name: 'Agency' },
];

const statusList = [
  { id: 1, name: 'Accepted' },
  { id: 2, name: 'Pending' },
  { id: 3, name: 'Rejected' },
];

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
}: any) => {
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

            {roles.map((role) => (
              <Fragment key={role.id}>
                <SelectItem value={role.name}>
                  {role.name}
                </SelectItem>
              </Fragment>
            ))}

          </SelectContent>
        </Select>

        <Select value={selectedStatus} onValueChange={onStatusChange}>

          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All Status" />
          </SelectTrigger>

          <SelectContent>

            <SelectItem value="all">All Status</SelectItem>

            {statusList.map((status) => (
              <Fragment key={status.id}>
                <SelectItem value={status.name}>
                  {status.name}
                </SelectItem>
              </Fragment>
            ))}

          </SelectContent>

        </Select>

      </div>

      <Button onClick={onAddUser}>
        <Plus className="size-4 mr-1" />
        Invite
      </Button>

    </CardHeader>
  );
};

const InviteList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const { invite } = useSelector((state: RootState) => state.invite);

  const users = invite.data || [];

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const [inputValue, setInputValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const getStatusVariant = (status: string) => {
    switch (status?.toLowerCase()) {
      case "accepted":
        return "success";

      case "pending":
        return "warning";

      case "rejected":
        return "destructive";

      default:
        return "secondary";
    }
  };
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo<ColumnDef<any>[]>(() => [

    {
      accessorKey: 'name',
      id: 'name',

      header: ({ column }) =>
        <DataGridColumnHeader title="User" column={column} />,

      cell: ({ row }) => {

        const user = row.original;

        return (
          <div className="flex items-center gap-3">

            <Avatar className="size-9">

              <AvatarFallback>
                {getInitials(user.name)}
              </AvatarFallback>

            </Avatar>

            <div>

              <div className="font-medium text-sm">
                {user.name}
              </div>

              <div className="text-xs text-muted-foreground">
                {user.email}
              </div>

            </div>

          </div>
        );
      },
    },
    {
      accessorKey: 'user_type',
      id: 'user_type',

      header: ({ column }) =>
        <DataGridColumnHeader title="User Type" column={column} />,

      cell: ({ row }) => (
        <Badge variant="secondary">
          {row.original.user_type}
        </Badge>
      ),
    },
    {
      accessorKey: 'created_at',
      id: 'created_at',

      header: ({ column }) =>
        <DataGridColumnHeader title="Joined" column={column} />,

      cell: ({ row }) =>
        formatDate(new Date(row.original.created_at)),
    },
    {
      accessorKey: 'status',
      id: 'status',

      header: ({ column }) =>
        <DataGridColumnHeader title="Status" column={column} />,

      cell: ({ row }) => (
        <Badge variant={getStatusVariant(row.original.status) as any}>
          {row.original.status}
        </Badge>
      ),
    },

    {
      id: 'actions',

      header: 'Actions',

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
              onClick={() =>
                router.push(`/user-management/users/${row.original.id}`)
              }
            >
              Resend
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => router.push(`/invite/${row.original.id}`)}
            >
              View
            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      ),
    },

  ], []);

  const table = useReactTable({

    columns,
    data: users,

    pageCount: Math.ceil(invite.total / invite.perPage),

    state: {
      pagination,
      sorting,
    },

    onPaginationChange: setPagination,
    onSortingChange: setSorting,

    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

  });

  useEffect(() => {
    dispatch(
      fetchInvitation({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
      })
    );
  }, [
    dispatch,
    selectedRole,
    selectedStatus,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue
  ]);

  return (

    <DataGrid table={table} recordCount={invite.total}>

      <Card>

        <DataGridToolbar
          inputValue={inputValue}
          onInputChange={setInputValue}
          onAddUser={() => setInviteDialogOpen(true)}
          selectedRole={selectedRole}
          onRoleChange={setSelectedRole}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
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

      <InviteAddDialog
        open={inviteDialogOpen}
        closeDialog={() => setInviteDialogOpen(false)}
      />

      {deleteDialogOpen && (
        <InviteDeleteDialog
          open={deleteDialogOpen}
          closeDialog={() => setDeleteDialogOpen(false)}
        />
      )}

    </DataGrid>

  );
};

export default InviteList;