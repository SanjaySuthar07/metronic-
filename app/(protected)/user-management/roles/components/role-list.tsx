'use client';

import { useEffect, useMemo, useState } from 'react';
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
import { fetchRoleDetail, fetchRoles } from '@/store/thunk/userManagement.thunk';

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import RoleInviteDialog from './role-form-dialog';
import RoleViewDialog from './role-view-dialog';

import { hasPermission } from '@/lib/permissions';


/* =========================
   TOOLBAR DESIGN
========================= */

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddUser: () => void;
}) => {

  const { user } = useSelector((s: any) => s.auth);
  const isSpecialRole = ['super_admin', 'agency'].includes(user?.user_type)
  const canCreate = isSpecialRole || hasPermission(user, ["role-create"])
  return (
    <CardHeader className="py-5">

      <div className="flex items-center gap-2.5">

        <div className="relative">

          <Search className="size-4 text-muted-foreground absolute start-3 top-1/2 -translate-y-1/2" />

          <Input
            placeholder="Search roles"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="ps-9 w-full md:w-64"
          />

        </div>

      </div>

      <div className="flex items-center gap-3">

        {
          canCreate && (
            <Button onClick={onAddUser}>
              <Plus />
              Add Role
            </Button>
          )}

      </div>

    </CardHeader>
  );
};


/* =========================
   MAIN COMPONENT
========================= */

const RolesList = () => {

  const { user } = useSelector((s: any) => s.auth);

  const dispatch = useDispatch<AppDispatch>();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editData, setEditData] = useState<any>(null);

  const [inputValue, setInputValue] = useState('');

  const { roles, loadingRoles } = useSelector(
    (state: RootState) => state.userManagement
  );


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


  /* =========================
     FETCH ROLES
  ========================= */

  useEffect(() => {

    const sortField = sorting?.[0]?.id;

    const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

    dispatch(
      fetchRoles({
        page: pagination.pageIndex + 1,
        per_page: pagination.pageSize,
        search: inputValue || undefined,
        sort: sortField,
        dir: sortField ? sortDirection : undefined,
        tenant_id: user?.tenant_id
      })
    );

  }, [
    dispatch,
    pagination.pageIndex,
    pagination.pageSize,
    inputValue,
    sorting,
    user?.tenant_id
  ]);


  /* =========================
     EDIT / VIEW ROLE
  ========================= */

  const handleEditUser = async (id: number, type: any) => {

    try {

      const res: any = await dispatch(
        fetchRoleDetail({
          id,
          tenant_id: user.tenant_id
        })
      );

      if (res?.payload?.role) {

        setEditData(res.payload.role);

        setIsEdit(true);

        if (type == "edit") {
          setInviteDialogOpen(true);
        } else {
          setViewDialogOpen(true);
        }

      }

    } catch (error) {
      console.error("Failed to fetch role details", error);
    }

  };


  /* =========================
     TABLE COLUMNS
  ========================= */
  const isSpecialRole = ['super_admin', 'agency'].includes(user?.user_type)
  const canEdit = isSpecialRole || hasPermission(user, ["role-edit"])
  const canView = isSpecialRole || hasPermission(user, ["role-show"])
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

            <div className="font-medium capitalize text-sm">
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
      id: 'Permissions',
      header: 'Permissions',
      enableSorting: false,
      enableResizing: false,

      cell: ({ row }) => {

        const permissions = row.original?.permissions || [];

        if (!permissions.length) return "-";

        return (

          <div className="flex items-center gap-1 flex-wrap">

            {permissions.slice(0, 3).map((perm: any) => (

              <Badge key={perm.id} variant="secondary">
                {perm.name}
              </Badge>

            ))}

            {permissions.length > 3 && (

              <span className="text-muted-foreground text-xs ms-1">
                {permissions.length - 3} more
              </span>

            )}

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
      enableSorting: false,
      enableResizing: false,

      cell: ({ row }) => (

        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button className="h-7 w-7" mode="icon" variant="ghost">
              <EllipsisVertical />
            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent>

            {canEdit && (
              <>
                <DropdownMenuItem
                  onClick={() => handleEditUser(row.original.id, "edit")}
                >
                  Edit
                </DropdownMenuItem>

                <DropdownMenuSeparator />
              </>

            )}

            {canView && (

              <DropdownMenuItem
                onClick={() => handleEditUser(row.original.id, "view")}
              >
                View
              </DropdownMenuItem>

            )}

          </DropdownMenuContent>

        </DropdownMenu>

      ),

      size: 75,

      meta: {
        skeleton: <Skeleton className="size-5" />,
      },

    },

  ], []);


  /* =========================
     COLUMN ORDER
  ========================= */

  useEffect(() => {
    setColumnOrder(columns.map((col) => col.id as string));
  }, [columns]);


  /* =========================
     TABLE INSTANCE
  ========================= */

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


  /* =========================
     RENDER
  ========================= */

  return (
    <>

      <DataGrid
        table={table}
        recordCount={roles?.total}
        isLoading={loadingRoles}
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
              setIsEdit(false);
              setEditData(null);
              setInviteDialogOpen(true);
            }}
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


      {viewDialogOpen && (

        <RoleViewDialog
          open={viewDialogOpen}
          closeDialog={() => {
            setViewDialogOpen(false);
          }}
          isEdit={isEdit}
          editData={editData}
        />

      )}


      {inviteDialogOpen && (

        <RoleInviteDialog
          open={inviteDialogOpen}
          closeDialog={() => {
            setInviteDialogOpen(false);
            setIsEdit(false);
            setEditData(null);
          }}
          isEdit={isEdit}
          editData={editData}
        />

      )}

    </>
  );

};

export default RolesList;