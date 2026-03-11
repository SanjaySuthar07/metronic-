'use client';

import { Fragment, useMemo, useState } from 'react';
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

const roles = [
  { id: 1, name: 'Admin' },
  { id: 2, name: 'Agent' },
  { id: 3, name: 'Agency' },
];

const initialUsers = [
  {
    id: 1,
    name: 'Sanjay',
    email: 'sanjay@gmail.com',
    user_type: 'Admin',
    created_at: '2024-01-10',
  },
  {
    id: 2,
    name: 'Rahul',
    email: 'rahul@gmail.com',
    user_type: 'Agent',
    created_at: '2024-02-15',
  },
  {
    id: 3,
    name: 'Vishal',
    email: 'vishal@gmail.com',
    user_type: 'User',
    created_at: '2024-03-05',
  },
];

const DataGridToolbar = ({
  inputValue,
  onInputChange,
  onAddUser,
  selectedRole,
  onRoleChange,
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
                <SelectItem value={role.name}>{role.name}</SelectItem>
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
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const [isEdit, setIsEdit] = useState(false)
  const [editData, setEditData] = useState<any>(null)

  const [deleteUserObj, setDeleteUserObj] = useState<any>(null)
  const router = useRouter();

  const [users, setUsers] = useState(initialUsers);

  const [inputValue, setInputValue] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<SortingState>([]);

  const filteredUsers = useMemo(() => {

    let data = [...users];

    if (inputValue) {
      data = data.filter(
        (u) =>
          u.name.toLowerCase().includes(inputValue.toLowerCase()) ||
          u.email.toLowerCase().includes(inputValue.toLowerCase())
      );
    }

    if (selectedRole !== 'all') {
      data = data.filter((u) => u.user_type === selectedRole);
    }

    return data;

  }, [users, inputValue, selectedRole]);

  const handleDeleteUser = (user: any) => {
    setDeleteUserObj(user)
    setDeleteDialogOpen(true)
  }
  const handleEditUser = (id: number) => {
    const user = users.find(u => u.id === id)
    if (!user) return
    setEditData(user)
    setIsEdit(true)
    setInviteDialogOpen(true)
  }

  const handleSaveUser = (data: any) => {
    if (isEdit) {
      setUsers(prev =>
        prev.map(u => u.id === data.id ? data : u)
      )
    } else {
      setUsers(prev => [...prev, data])
    }
  }
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
              <div className="font-medium text-sm">{user.name}</div>
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
        <Badge variant="secondary">{row.original.user_type}</Badge>
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
              onClick={() => handleEditUser(row.original.id)}
            >
              Edit
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() =>
                router.push(`/user-management/users/${row.original.id}`)
              }
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
    data: filteredUsers,

    pageCount: Math.ceil(filteredUsers.length / pagination.pageSize),

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

    <DataGrid table={table} recordCount={filteredUsers.length}>

      <Card>

        <DataGridToolbar
          inputValue={inputValue}
          onInputChange={setInputValue}
          onAddUser={() => {
            setIsEdit(false)
            setEditData(null)
            setInviteDialogOpen(true)
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

      <InviteAddDialog
        open={inviteDialogOpen}
        closeDialog={() => setInviteDialogOpen(false)}
        isEdit={isEdit}
        editData={editData}
        onSave={handleSaveUser}
      />

      {deleteUserObj && (
        <InviteDeleteDialog
          open={deleteDialogOpen}
          closeDialog={() => setDeleteDialogOpen(false)}
          user={deleteUserObj}
          onDeleted={(user: any) => {
            setUsers(prev => prev.filter(u => u.id !== user.id))
            setDeleteDialogOpen(false)
          }}
        />
      )}
    </DataGrid>

  );
};

export default InviteList;