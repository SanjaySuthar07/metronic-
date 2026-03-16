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

import UserInviteDialog from './user-add-dialog';
import UserDeleteDialog from './user-delete-dialog';

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
import { hasPermission } from '@/lib/permissions';


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
  const { user } = useSelector((s) => s.auth)

  const [roles, setRoles] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await dispatch(fetchRolesDropdown());
      setRoles(data?.payload?.roles || []);
    };
    if (user.user_type != "agency" && user.user_type != "admin") {
      fetch();
    }
  }, [dispatch]);

  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
        <Input
          placeholder="Search users"
          value={inputValue}
          onChange={(e) => onInputChange(e.target.value)}
          className="ps-9 w-full sm:w-64"
        />
        {(user?.user_type == "super_admin") && (
          <Select value={selectedRole} onValueChange={onRoleChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="All types" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">All Type</SelectItem>
              {roles.map((role: any) => {
                if (role.name === "Super Admin") {
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
          </Select>
        )}
      </div>

    </CardHeader>
  );
};

const UserList = () => {

  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((s) => s.auth)
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteUserObj, setDeleteUserObj] = useState<any>(null);
  const handleDeleteUser = (user: any) => {
    setDeleteUserObj(user);
    setDeleteDialogOpen(true);
  };

  const refreshUsers = () => {

    const roleFilter =
      selectedRole && selectedRole !== 'all' ? selectedRole : '';
    console.log("user")
    dispatch(
      fetchUsers({
        user_type: roleFilter,
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: inputValue.trim() || undefined,
        sort: sorting?.[0]?.id,
        dir: sorting?.[0]?.desc ? 'desc' : 'asc',
        id: user?.tenant_id
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
        id: user?.tenant_id
      })
    );

  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue,
    selectedRole,
    sorting,
    user?.tenant_id
  ]);

  const handleEditUser = async (id: number) => {
    try {
      const res: any = await dispatch(fetchUserDetail({ id }));
      if (res?.payload?.user) {
        setEditData(res.payload.user);
        setIsEdit(true);
        setInviteDialogOpen(true);
      }
    } catch (error) {
      console.error("Failed to fetch user details", error);
    }
  };

  const columns = useMemo<ColumnDef<any>[]>(() => {

    const cols: ColumnDef<any>[] = [

      {
        accessorKey: 'name',
        id: 'name',
        enableSorting: true,
        size: 300,

        header: ({ column }) => (
          <DataGridColumnHeader title="User" column={column} />
        ),

        cell: ({ row }) => {

          const userRow = row.original;
          const name = userRow?.name || '-';
          const email = userRow?.email || '-';

          return (
            <div className="flex items-center gap-3">

              <Avatar className="size-9">
                <AvatarFallback>
                  {getInitials(name !== '-' ? name : email)}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-0.5">
                <div className="font-medium text-sm capitalize">
                  {name}
                </div>

                <div className="text-muted-foreground text-xs">
                  {email}
                </div>
              </div>

            </div>
          );
        },

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
      }

    ];

    if (user?.user_type !== "agency") {

      cols.push({

        accessorKey: 'user_type',
        id: 'user_type',
        enableSorting: true,
        size: 160,

        header: ({ column }) => (
          <DataGridColumnHeader title="User Type" column={column} />
        ),

        cell: ({ row }) => {

          const type = row.original?.user_type;

          return type ? (
            <Badge variant="secondary" className="capitalize">
              {type}
            </Badge>
          ) : '-';
        },

        meta: {
          skeleton: <Skeleton className="h-7 w-24" />,
        },

      });

    }

    cols.push(

      {
        accessorKey: 'created_at',
        id: 'created_at',
        enableSorting: true,
        size: 160,

        header: ({ column }) => (
          <DataGridColumnHeader title="Joined" column={column} />
        ),

        cell: ({ row }) => {

          const date = row.original?.created_at;

          return date
            ? formatDate(new Date(date))
            : '-';
        },

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
              <Button className="h-7 w-7" mode="icon" variant="ghost">
                <EllipsisVertical />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">

              {
                hasPermission(user, ["agent-edit"]) && (
                  <>
                    <DropdownMenuItem
                      onClick={() => handleEditUser(row.original.id)}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )
              }

              {
                hasPermission(user, ["agent-show"]) && (
                  <>
                    <DropdownMenuItem
                      onClick={() =>
                        router.push(`/user-management/users/${row.original.id}`)
                      }
                    >
                      View
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )
              }

              <DropdownMenuItem
                variant="destructive"
                onClick={() => handleDeleteUser(row.original)}
              >
                Delete
              </DropdownMenuItem>

            </DropdownMenuContent>

          </DropdownMenu>

        ),

        meta: {
          skeleton: <Skeleton className="size-5" />,
        },
      }

    );

    return cols;

  }, [user?.user_type]);
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
          <UserDeleteDialog
            open={deleteDialogOpen}
            closeDialog={() => setDeleteDialogOpen(false)}
            user={deleteUserObj}
            onDeleted={() => {
              setDeleteDialogOpen(false);
              refreshUsers();
            }}
          />
        )
      }
      {
        inviteDialogOpen && (
          <UserInviteDialog
            open={inviteDialogOpen}
            isEdit={isEdit}
            editData={editData}
            closeDialog={() => setInviteDialogOpen(false)}
            isProfile={false}
          />
        )
      }
    </>
  );
};

export default UserList;