'use client';

import { useEffect, useMemo, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

import {
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  PaginationState,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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

import RoleInviteDialog from './masterModule-form-dialog';
import RoleViewDialog from './masterModule-view-dialog';

import { hasPermission } from '@/lib/permissions';
import { useRouter, useSearchParams } from 'next/navigation';

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
  const [parentMenu, setParentMenu] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [status, setStatus] = useState('');
  const router = useRouter()
  return (
    <div className="py-4 px-5 flex  flex-row items-center justify-between gap-3 border-b border-gray-100">

      <div className="flex flex-wrap items-center gap-3 w-full">

        <div className="relative">
          <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <Input
            placeholder="Search users"
            value={inputValue}
            onChange={(e) => onInputChange(e.target.value)}
            className="pl-9 w-[220px] h-9 rounded-md"
          />
        </div>

        <Select value={parentMenu} onValueChange={setParentMenu}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select Parent Menu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin Panel</SelectItem>
            <SelectItem value="inventory">Inventory</SelectItem>
            <SelectItem value="sales">Sales</SelectItem>
          </SelectContent>
        </Select>

        <Select value={createdBy} onValueChange={setCreatedBy}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Select Created By" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[160px] h-9">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">

        <Button
          onClick={() => router.push("/masterModule/createParent")}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4"
        >
          <Plus className="mr-1 size-4" />
          Create Parent Menu
        </Button>

        <Button
          onClick={() => router.push("/masterModule/createChild")}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4"
        >
          <Plus className="mr-1 size-4" />
          Create Child Menu
        </Button>

      </div>
    </div>
  );
};


/* =========================
   MAIN COMPONENT
========================= */

const MasterModuleList = () => {

  // const { user } = useSelector((s: any) => s.auth);

  // const dispatch = useDispatch<AppDispatch>();

  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  const [editData, setEditData] = useState<any>(null);

  const [inputValue, setInputValue] = useState('');

  // const { roles, loadingRoles } = useSelector(
  //   (state: RootState) => state.userManagement
  // );


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

  // useEffect(() => {

  //   const sortField = sorting?.[0]?.id;

  //   const sortDirection = sorting?.[0]?.desc ? 'desc' : 'asc';

  //   dispatch(
  //     fetchRoles({
  //       page: pagination.pageIndex + 1,
  //       per_page: pagination.pageSize,
  //       search: inputValue || undefined,
  //       sort: sortField,
  //       dir: sortField ? sortDirection : undefined,
  //       tenant_id: user?.tenant_id
  //     })
  //   );

  // }, [
  //   dispatch,
  //   pagination.pageIndex,
  //   pagination.pageSize,
  //   inputValue,
  //   sorting,
  //   user?.tenant_id
  // ]);


  /* =========================
     EDIT / VIEW ROLE
  ========================= */

  // const handleEditUser = async (id: number, type: any) => {

  //   try {

  //     const res: any = await dispatch(
  //       fetchRoleDetail({
  //         id,
  //         tenant_id: user.tenant_id
  //       })
  //     );

  //     if (res?.payload?.role) {

  //       setEditData(res.payload.role);

  //       setIsEdit(true);

  //       if (type == "edit") {
  //         setInviteDialogOpen(true);
  //       } else {
  //         setViewDialogOpen(true);
  //       }

  //     }

  //   } catch (error) {
  //     console.error("Failed to fetch role details", error);
  //   }

  // };


  /* =========================
     TABLE COLUMNS
  ========================= */

  const columns = useMemo<ColumnDef<any>[]>(() => [

    {
      accessorKey: 'Model Name',
      id: 'ModelName',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Model Name" column={column} />,
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
      size: 160,
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
      accessorKey: 'Parent Menu',
      id: 'MenuTitle',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Menu Title" column={column} />,
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
      size: 160,
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
      accessorKey: 'Status',
      id: 'Status',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Status" column={column} />,
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
      size: 160,
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
      accessorKey: 'Order Name',
      id: 'Order Name',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Order Name" column={column} />,
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
      size: 160,
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
      accessorKey: 'Created By',
      id: 'Created By',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Created By" column={column} />,
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
      size: 160,
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
      accessorKey: 'Created Date',
      id: 'Created Date',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Created Date" column={column} />,
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
      size: 160,
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
            <>
              <DropdownMenuItem
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
            <DropdownMenuItem
            >
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 160,
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

    data: [],

    // pageCount:
    //   roles?.total
    //     ? Math.ceil(roles.total / pagination.pageSize)
    //     : -1,
    pageCount: 5,

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
        recordCount={2}
        isLoading={false}
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
          // isEdit={isEdit}
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

export default MasterModuleList;