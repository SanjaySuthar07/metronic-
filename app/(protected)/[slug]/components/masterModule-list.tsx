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
import { deleteDataApi, getDataApi } from '@/store/thunk/dynamicModule.thunk';
import DeleteDialog from './masterModule-delete-dialog';

/* =========================
   TOOLBAR DESIGN
========================= */

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
  slug,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onAddUser: () => void;
  slug: string;
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
          onClick={() => router.push(`/${slug}/addData`)}
          className="bg-blue-600 hover:bg-blue-700 text-white h-9 px-4 capitalize"
        >
          <Plus className="mr-1 size-4 " />
          Add {slug}
        </Button>
      </div>
    </div>
  );
};


/* =========================
   MAIN COMPONENT
========================= */

const MasterModuleList = ({ slug }: { slug: string }) => {
  const router = useRouter()
  const { getModuleTableData, getModuleTableDataLoading } = useSelector((s: any) => s.dynamicModule)
  // const { user } = useSelector((s: any) => s.auth);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<any>(null);

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
    dispatch(getDataApi({ slug }));
  }, [dispatch, slug]);

  const fetchModuleData = useSelector(
    (state: RootState) => state.masterModule.moduleList
  );
  const [moduleData, setModuleData] = useState<any[]>([]);
  const formatDate = (dateString: string) => {

    const date = new Date(dateString);

    const day = String(date.getDate()).padStart(2, '0');

    const month = String(date.getMonth() + 1).padStart(2, '0');

    const year = String(date.getFullYear()).slice(-2);

    return `${day}-${month}-${year}`;

  };

  useEffect(() => {
    let data = getModuleTableData?.data;
 
    if (data?.data) {
      data = data.data;
    }
 
    const finalData = Array.isArray(data) ? data : [];
 
    const formattedData = finalData.map((item: any) => ({
      id: item?.id,
      name: item?.name || "-",
      email: item?.email || "-",
      address: item?.address || "-",
      gender: item?.gender || "-",
      country: item?.country || "-",
      term: item?.term || "-",
      created_at: item?.created_at || "-",
    }));
 
    setModuleData(formattedData);
  }, [getModuleTableData]);


  const handleConfirmDelete = async (id: number) => {
    await dispatch(deleteDataApi({ slug, id })).unwrap();

    dispatch(getDataApi({ slug })); // refresh table
  };

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
        // dispatch(fetchmodule({
        //   page: pagination.pageIndex + 1,
        //   limit: pagination.pageSize,
        // }));
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  };
  const columns = useMemo<ColumnDef<any>[]>(() => {

    if (!moduleData || moduleData.length === 0) return [];

    const keys = Object.keys(moduleData[0]);

    const dynamicCols = keys.map((key) => ({
      accessorKey: key,
      id: key,
      header: ({ column }: any) => (
        <DataGridColumnHeader
          title={key.replaceAll("_", " ").toUpperCase()}
          column={column}
        />
      ),
      cell: ({ row }: any) => {
        const value = row.original[key];

        if (value === null || value === undefined) return "-";

        if (key.includes("date") || key.includes("created_at")) {
          const date = new Date(value);
          return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        }

        return String(value);
      },
    }));

    // 🔥 ACTION COLUMN ADD
    const actionCol: ColumnDef<any> = {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="h-7 w-7" variant="ghost">
              <EllipsisVertical />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>

            {/* 🔍 VIEW */}
            {/* <DropdownMenuItem
              onClick={() => {
                setEditData(row.original);
                setViewDialogOpen(true);
              }}
            >
              View
            </DropdownMenuItem>

            <DropdownMenuSeparator /> */}

            {/* ✏️ EDIT */}
            <DropdownMenuItem
              onClick={() => {
                router.push(`/${slug}/addData/${row.original.id}`);
              }}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            {/* 🗑 DELETE */}
            <DropdownMenuItem
              onClick={() => {
                setDeleteData(row.original);
                setDeleteDialogOpen(true);
              }}
            >
              Delete
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      ),
      size: 100,
    };

    return [...dynamicCols, actionCol];

  }, [moduleData]);

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
            slug={slug}
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

      <DeleteDialog
        open={deleteDialogOpen}
        closeDialog={() => setDeleteDialogOpen(false)}
        data={deleteData}
        onConfirm={handleConfirmDelete}
      />
    </>
  );

};

export default MasterModuleList;
