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
import masterModuleView from './masterModule-view';
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
import { deleteModule, fetchmodule } from '@/store/thunk/masterModule.thunk';

import { useDispatch, useSelector } from 'react-redux';
import { removeCreateModuleMessage } from '@/store/slice/masterModule.slice';

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
  const [statusdata, setStatusdata] = useState('');
  const router = useRouter()
  const [moduleData, setModuleData] = useState<any[]>([]);



  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(removeCreateModuleMessage());
  }, []);



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


      </div>

      {/* RIGHT SIDE BUTTONS */}
      <div className="flex items-center gap-2">
        <Button
          onClick={() => router.push("/daynamicModule/addData")}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4"
        >
          <Plus className="mr-1 size-4" />
          Add Data
        </Button>
      </div>
    </div>
  );
};


/* =========================
   MAIN COMPONENT
========================= */

const MasterModuleList = () => {
  const router = useRouter()

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
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      fetchmodule({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        dir: sorting?.[0]?.desc ? "desc" : "asc",
        sort: sorting?.[0]?.id === "Created Date" ? "created_at" : sorting?.[0]?.id ? sorting?.[0]?.id.toLocaleLowerCase().replaceAll(" ", "_") : undefined

      })
    );
  }, [dispatch, pagination.pageIndex, pagination.pageSize, sorting]);

  const fetchModuleData = useSelector(
    (state: RootState) => state.masterModule.moduleList
  );
  console.log("fetchModuleData", fetchModuleData);
  const [moduleData, setModuleData] = useState<any[]>([]);
  const formatDate = (dateString: string) => {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;

  };

  useEffect(() => {
    if (fetchModuleData?.data) {

      const formattedData = fetchModuleData.data.map((item: any) => ({
        id: item.id,
        name: item.main_model_name || "-",

        menu_title: item.menu_title || "-",

        status: item.status || false,

        order_name: item.order_number || "-",

        created_by: item.created_by || "-",

        created_date: item.created_at
      }));

      setModuleData(formattedData);
    }
  }, [fetchModuleData]);



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

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this module?")) return;

    try {
      const res: any = await dispatch(deleteModule(id));

      if (res?.payload?.success) {
        // optional: refetch list
        dispatch(fetchmodule({
          page: pagination.pageIndex + 1,
          limit: pagination.pageSize,
        }));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
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
      accessorKey: 'Menu Title',
      id: 'MenuTitle',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Menu Title" column={column} />,
      cell: ({ row }) => {
        const role = row.original;
        const name = role?.menu_title || '-';
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
    }
    ,

    {
      accessorKey: 'status',
      id: 'status',
      enableSorting: true,
      header: ({ column }) =>
        <DataGridColumnHeader title="Status" column={column} />,
      cell: ({ row }) => {
        const role = row.original;



        const name = role?.status === true ? 'Active' : 'Inactive';

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
      }, size: 160,
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
        const name = role?.order_name || '-';
        return (
          <div className="flex items-center gap-3">
            {/* <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name)}
              </AvatarFallback>
            </Avatar> */}
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
        const name = role?.created_by || '-';
        return (
          <div className="flex items-center gap-3">
            {/* <Avatar className="size-9">
              <AvatarFallback>
                {getInitials(name)}
              </AvatarFallback>
            </Avatar> */}
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
        const name = formatDate(role?.created_date) || '-';
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
                onClick={() => router.push(`/masterModule/createChild/${row.original.id}`)}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
            </>
            <DropdownMenuItem
              onClick={() => router.push(`/masterModule/${row.original.id}`)}
            >
              View
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => handleDelete(row.original.id)}
            >
              Delete
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





  console.log("fetchModuleData", moduleData);
  /* =========================
     TABLE INSTANCE
  ========================= */

  const table = useReactTable({

    columns,

    data: moduleData || [],

    pageCount: fetchModuleData?.total
      ? Math.ceil(fetchModuleData.total / pagination.pageSize)
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
        recordCount={fetchModuleData?.total || 0}
        tableLayout={{
          columnsResizable: true,
          columnsPinnable: true,
          columnsMovable: true,
          columnsVisibility: true,
        }}
      >

        <Card>

          <DataGridToolbar
            pagination={pagination}

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
