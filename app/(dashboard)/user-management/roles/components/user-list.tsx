'use client';

import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { redirect } from 'next/navigation';
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import { AppDispatch, RootState } from '@/store';
import { fetchUsers } from '@/store/thunk/userManagement.thunk';
import { ChevronRight, Plus, Search, X } from 'lucide-react';
import { formatDate, getInitials } from '@/lib/helpers';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge, BadgeDot } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardFooter, CardHeader, CardTable } from '@/components/ui/card';
import { DataGrid } from '@/components/ui/data-grid';
import { DataGridColumnHeader } from '@/components/ui/data-grid-column-header';
import { DataGridPagination } from '@/components/ui/data-grid-pagination';
import { DataGridTable } from '@/components/ui/data-grid-table';
import { Input } from '@/components/ui/input';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import UserInviteDialog from './user-add-dialog';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading, total, currentPage, perPage } = useSelector((state: RootState) => state.userManagement);
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage ? currentPage - 1 : 0,
    pageSize: perPage || 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);
  const roleList = [
    {
      id: 1,
      name: "agency"
    }
  ]
  /* ===============================
     Fetch Users
  ================================= */

  useEffect(() => {
    dispatch(
      fetchUsers({
        user_type: 'agency',
        page: pagination.pageIndex + 1,
      })
    );
  }, [dispatch, pagination.pageIndex]);

  /* ===============================
     Columns
  ================================= */

  const columns = useMemo<ColumnDef<any>[]>(() => [
    {
      accessorKey: 'name',
      id: 'user',
      header: ({ column }) => (
        <DataGridColumnHeader title="User" column={column} />
      ),
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
              <div className="font-medium text-sm">
                {name}
              </div>
              <div className="text-muted-foreground text-xs">
                {email}
              </div>
            </div>
          </div>
        );
      },
      size: 300,
    },

    {
      accessorKey: 'user_type',
      id: 'user_type',
      header: ({ column }) => (
        <DataGridColumnHeader title="User Type" column={column} />
      ),
      cell: ({ row }) => {
        const type = row.original?.user_type;

        if (!type) return '-';

        return (
          <Badge variant="secondary" className="capitalize">
            <BadgeDot />
            {type}
          </Badge>
        );
      },
      size: 160,
    },

    {
      accessorKey: 'created_at',
      id: 'joined',
      header: ({ column }) => (
        <DataGridColumnHeader title="Joined" column={column} />
      ),
      cell: ({ row }) => {
        const date = row.original?.created_at;
        return date ? formatDate(new Date(date)) : '-';
      },
      size: 160,
    },

    {
      accessorKey: 'email_verified_at',
      id: 'last_sign_in',
      header: ({ column }) => (
        <DataGridColumnHeader title="Last Sign In" column={column} />
      ),
      cell: ({ row }) => {
        const last = row.original?.email_verified_at;
        return last ? formatDate(new Date(last)) : '-';
      },
      size: 170,
    },

    {
      id: 'actions',
      header: '',
      cell: () => (
        <ChevronRight className="text-muted-foreground/70 size-4" />
      ),
      size: 40,
    },
  ], []);



  /* ===============================
     Table
  ================================= */

  const table = useReactTable({
    columns,
    data: users || [],
    pageCount: Math.ceil(total / perPage),
    manualPagination: true,
    state: {
      pagination,
      sorting,
    },
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  /* ===============================
     Toolbar
  ================================= */

  const DataGridToolbar = () => {
    const [inputValue, setInputValue] = useState('');

    return (
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

          <div className="relative">
            <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search users"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="ps-9 w-full sm:w-64"
            />
          </div>
        </div>

        <div>
          <Button
            className="bg-primary text-white"
            onClick={() => setInviteDialogOpen(true)}
          >
            <Plus className="size-4 mr-1" />
            Add User
          </Button>
        </div>

      </CardHeader>
    );
  };

  return (
    <>
      <DataGrid
        table={table}
        recordCount={total}
        isLoading={loading}
        onRowClick={(row) =>
          redirect(`/user-management/users/${row.id}`)
        }
        tableClassNames={{
          bodyRow: `
      border-b border-border
      hover:bg-muted/40
      transition-colors
      cursor-pointer
    `,
          headerRow: "border-b border-border",
          edgeCell: "px-5"
        }}
      >
        <Card>
          <DataGridToolbar />

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

export default UserList;