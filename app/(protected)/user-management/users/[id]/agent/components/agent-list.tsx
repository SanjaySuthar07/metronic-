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
  fetchRolesDropdown,
  fetchUserDetail,
  fetchUsers,
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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useRouter } from 'next/navigation';
import AgentAddDialog from './agent-add-dialog';
import AgentDeleteDialog from './agent-delete-dialog';
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
  // const [roles, setRoles] = useState<any[]>([]);

  // const { userDetail } = useSelector((s) => s.userManagement)
  // useEffect(() => {
  //   const fetch = async () => {
  //     const data = await dispatch(fetchRolesDropdown());
  //     setRoles(data?.payload?.roles || []);
  //   };
  //   fetch();
  // }, [dispatch]);

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

        {/* <Select value={selectedRole} onValueChange={onRoleChange}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="All types" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="all">All Type</SelectItem>

            {roles.map((role: any) => {
              // hide admin role from filter options
              if (role.name === 'Super Admin') {
                return null;
              }

              return (
                <Fragment key={role.id}>
                  <SelectItem value={role.name} className="capitalize">
                    {role.name}
                  </SelectItem>
                </Fragment>
              );
            })}
          </SelectContent>
        </Select> */}

      </div>

      <Button className="bg-primary text-white hidden" onClick={onAddUser}>
        <Plus className="size-4 mr-1" />
        Add User
      </Button>
    </CardHeader>
  );
};

const AgentList = () => {
  const { userDetail } = useSelector((state: any) => state.userManagement);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserObj, setDeleteUserObj] = useState<any>(null);
  const handleDeleteUser = (user: any) => {
    setDeleteUserObj(user);
    setDeleteDialogOpen(true);
  };

  const refreshUsers = () => {
    if (!userDetail?.tenant_id) return;
    const roleFilter =
      selectedRole && selectedRole !== 'all' ? selectedRole : '';

    dispatch(
      fetchUsers({
        user_type: roleFilter,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: inputValue.trim() || undefined,
        sort: sorting?.[0]?.id,
        dir: sorting?.[0]?.desc ? 'desc' : 'asc',
        id: userDetail?.tenant_id
      })
    );
  };

  const { users, loadingUsers } = useSelector(
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
    if (!userDetail?.tenant_id) return;

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
        id: userDetail?.tenant_id
      })
    );

  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue,
    selectedRole,
    sorting,
    userDetail?.tenant_id
  ]);

  const handleEditUser = async (id: number) => {
    try {
      const res: any = await dispatch(fetchUserDetail({ id, tenant_id: userDetail?.tenant_id }));
      if (res?.payload?.user) {
        setEditData(res.payload.user);
        setIsEdit(true);
        setInviteDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };
  const columns = useMemo<ColumnDef<any>[]>(() => [

    {
      accessorKey: 'name',
      id: 'name',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="User" column={column} />,

      cell: ({ row }) => {

        const user = row.original;
        const name = user?.first_name + " " + user?.last_name || '-';
        const email = user?.email || '-';

        return (
          <div className="flex items-center gap-3">

            <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name !== '-' ? name : email)}
              </AvatarFallback>
            </Avatar>

            <div className="space-y-0.5">
              <div className="font-medium text-sm capitalize">{name}</div>
              <div className="text-muted-foreground text-xs">{email}</div>
            </div>

          </div>
        );
      },

      size: 160,

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

    // {
    //   accessorKey: 'user_type',
    //   id: 'user_type',
    //   enableSorting: true,

    //   header: ({ column }) =>
    //     <DataGridColumnHeader title="User Type" column={column} />,

    //   cell: ({ row }) => {

    //     const type = row.original?.user_type;

    //     return type ? (
    //       <Badge variant="secondary" className="capitalize">
    //         {type}
    //       </Badge>
    //     ) : '-';
    //   },

    //   size: 160,

    //   meta: {
    //     skeleton: <Skeleton className="h-7 w-24" />,
    //   },
    // },

    {
      accessorKey: 'created_at',
      id: 'created_at',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="Joined" column={column} />,

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
              onClick={() => handleEditUser(row.original.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/user-management/users/${row.original.id}`)}>
              View
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
        recordCount={users?.total}
        isLoading={loadingUsers}
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
      {
        deleteUserObj && (
          <AgentDeleteDialog
            open={deleteDialogOpen}
            closeDialog={() => setDeleteDialogOpen(false)}
            user={deleteUserObj}
            tenant_id={userDetail?.tenant_id}
            onDeleted={() => {
              setDeleteDialogOpen(false);
              refreshUsers();
            }}
          />
        )
      }
      {
        inviteDialogOpen ? (
          <AgentAddDialog
            open={inviteDialogOpen}
            isEdit={isEdit}
            editData={editData}
            closeDialog={() => setInviteDialogOpen(false)}
            isProfile={false}
            tenant_id={userDetail?.tenant_id}
          />
        ) : ""
      }

    </>
  );
};

export default AgentList;