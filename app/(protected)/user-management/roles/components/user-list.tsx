'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redirect } from 'next/navigation';

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { AppDispatch, RootState } from '@/store';
import { fetchRoles } from '@/store/thunk/userManagement.thunk';

import { EllipsisVertical, Plus, Search } from 'lucide-react';
import { getInitials } from '@/lib/helpers';

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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';



const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddUser: () => void;
}) => {
  return (
    <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />

          <Input
            placeholder="Search roles"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="ps-9 w-full sm:w-64"
          />
        </div>

      </div>

      <Button className="bg-primary text-white" onClick={onAddUser}>
        <Plus className="size-4 mr-1" />
        Add Role
      </Button>

    </CardHeader>
  );
};


const RolesList = () => {

  const dispatch = useDispatch<AppDispatch>();

  const { roles, loadingRoles } = useSelector(
    (state: RootState) => state.userManagement
  );

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  useEffect(() => {
    const sortField = sorting?.[0]?.id;
    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';
    // dispatch(
    //   fetchRoles({
    //     page: pagination.pageIndex + 1,
    //     per_page: pagination.pageSize,
    //     search: inputValue || undefined,
    //     sort: sortField,
    //     dir: sortField ? sortDirection : undefined,
    //   })
    // );
    dispatch(
      fetchRoles()
    );
  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue,
    sorting,
  ]);



  const columns = useMemo<ColumnDef<any>[]>(() => [

    {
      accessorKey: 'name',
      id: 'name',
      enableSorting: true,

      header: ({ column }) =>
        <DataGridColumnHeader title="Role" column={column} />,

      cell: ({ row }) => {
        const role = row.original;
        const name = role?.name || '-';
        return (
          <div className="flex items-center gap-3">

            <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="font-medium text-sm">
              {name}
            </div>

          </div>
        );
      },

      size: 300,

      meta: {
        skeleton: (
          <div className="flex items-center gap-3">
            <Skeleton className="size-9 rounded-full" />
            <Skeleton className="h-4 w-40" />
          </div>
        ),
      },
    },


    {
      accessorKey: "permissions",
      id: "permissions",
      header: ({ column }) => (
        <DataGridColumnHeader title="Permissions" column={column} />
      ),

      cell: ({ row }) => {
        const permissions = row.original?.permissions || [];

        if (!permissions.length) return "-";

        return (
          <div className="flex flex-wrap gap-1">
            {permissions?.slice(0, 3)?.map((perm: any) => (
              <Badge className='ml-1' key={perm.id} variant="secondary">
                {perm.name}
              </Badge>
            ))}
            {permissions.length > 3 ?
              <span className='ml-2'>
                {permissions.length} more
              </span>
              :
              ""}

          </div>
        );
      },

      size: 400,

      meta: {
        skeleton: <Skeleton className="h-7 w-40" />,
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

            <DropdownMenuItem>
              Edit
            </DropdownMenuItem>

            <DropdownMenuItem>
              View
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
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
    data: roles?.data || [],
    pageCount:
      roles?.total
        ? Math.ceil(roles.total / pagination.pageSize)
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
        recordCount={roles?.total}
        isLoading={loadingRoles}
        onRowClick={(row) => redirect(`/roles/${row.id}`)}
      >

        <Card>

          <DataGridToolbar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onAddUser={() => setInviteDialogOpen(true)}
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
        closeDialog={() => setInviteDialogOpen(false)}
      />
    </>
  );
};
export default RolesList;