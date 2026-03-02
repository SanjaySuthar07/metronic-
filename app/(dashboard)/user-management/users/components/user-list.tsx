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
import { Skeleton } from '@/components/ui/skeleton';
import UserInviteDialog from './user-add-dialog';

const UserList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { users, loading, total, currentPage, perPage } =
    useSelector((state: RootState) => state.userManagement);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: currentPage ? currentPage - 1 : 0,
    pageSize: perPage || 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  /* ===============================
     Fetch Users
  ================================= */

  useEffect(() => {
    dispatch(
      fetchUsers({
        user_type: 'agency',
        page: pagination.pageIndex + 1,
        query: searchQuery,
      })
    );
  }, [dispatch, pagination.pageIndex, searchQuery]);

  /* ===============================
     Columns
  ================================= */

  const columns = useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <DataGridColumnHeader title="User" column={column} />
        ),
        cell: ({ row }) => {
          const user = row.original;

          if (loading) {
            return (
              <div className="flex items-center gap-3">
                <Skeleton className="size-8 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            );
          }

          return (
            <div className="flex items-center gap-3">
              <Avatar className="size-8">
                <AvatarFallback>
                  {getInitials(user.name || user.email)}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium text-sm">{user.name}</div>
                <div className="text-muted-foreground text-xs">
                  {user.email}
                </div>
              </div>
            </div>
          );
        },
      },
      {
        accessorKey: 'user_type',
        header: 'User Type',
        cell: ({ row }) =>
          loading ? (
            <Skeleton className="w-20 h-6" />
          ) : (
            <Badge variant="secondary">
              <BadgeDot />
              {row.original.user_type}
            </Badge>
          ),
      },
      {
        accessorKey: 'created_at',
        header: 'Joined',
        cell: ({ row }) =>
          loading ? (
            <Skeleton className="w-20 h-6" />
          ) : (
            formatDate(new Date(row.original.created_at))
          ),
      },
      {
        id: 'actions',
        cell: () => (
          <ChevronRight className="text-muted-foreground/70 size-4" />
        ),
      },
    ],
    [loading]
  );

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
    const [inputValue, setInputValue] = useState(searchQuery);

    const handleSearch = () => {
      setSearchQuery(inputValue);
      setPagination({ ...pagination, pageIndex: 0 });
    };

    return (
      <CardHeader className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative">
          <Search className="size-4 absolute start-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search users"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="ps-9 w-64"
            disabled={loading}
          />
          {searchQuery && (
            <Button
              mode="icon"
              variant="dim"
              className="absolute end-1.5 top-1/2 -translate-y-1/2 h-6 w-6"
              onClick={() => {
                setSearchQuery('');
                setInputValue('');
              }}
            >
              <X />
            </Button>
          )}
        </div>

        <Button onClick={() => setInviteDialogOpen(true)}>
          <Plus />
          Add user
        </Button>
      </CardHeader>
    );
  };

  /* ===============================
     UI
  ================================= */

  return (
    <>
      <DataGrid
        table={table}
        recordCount={total}
        isLoading={loading}
        onRowClick={(row) =>
          redirect(`/user-management/users/${row.id}`)
        }
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