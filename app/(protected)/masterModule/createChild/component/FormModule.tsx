'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronsUpDown, Check, Plus, Pencil, Trash2 } from "lucide-react";
import {
  Type,
  Circle,
  Square,
  Box,
  Layout,
  Grid,
  Layers,
  Bookmark
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  ColumnDef,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { DataGrid } from "@/components/ui/data-grid";
import { DataGridTable } from "@/components/ui/data-grid-table";
import { DataGridColumnHeader } from "@/components/ui/data-grid-column-header";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { menuSchema, MenuSchemaType } from "../forms/menuSchema";
import { X, AlertTriangle } from "lucide-react";
import AddFieldDialog from "./AddFieldDialog";
import RoleDeleteDialog from "./delete-dialog"
import { ChevronDown } from 'lucide-react';
import { useRouter } from 'next/navigation';

/* =========================
   DROPDOWN OPTIONS
========================= */
const parentOptions = [
  { label: "No Parent", value: "no-parent" },
  { label: "User Manager", value: "user-manager" },
];

const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

const userTypeOptions = [
  { label: "All", value: "all" },
  { label: "Admin", value: "admin" },
  { label: "Customer", value: "customer" },
];

/* =========================
   STATUS ICON HELPER
========================= */
const renderStatusIcon = (value: string | boolean) => {
  const val = String(value).toLowerCase();
  if (val === "true" || val === "yes" || val === "active") {
    return <Check className="h-4 w-4 text-green-600" />;
  }
  if (val === "false" || val === "no" || val === "inactive") {
    return <X className="h-4 w-4 text-red-600" />;
  }
  return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
};

/* =========================
   TABLE COLUMNS — Modern style
========================= */


/* =========================
   STATIC DATA (example)
========================= */
const data = [
  {
    fieldType: "Auto_Increment",
    dbColumn: "id",
    visualTitle: "ID",
    inList: "true",
    inCreate: "both",
    inEdit: "both",
    inShow: "true",
    required: "both",
  },
  {
    fieldType: "Text",
    dbColumn: "name",
    visualTitle: "Full Name",
    inList: "true",
    inCreate: "true",
    inEdit: "true",
    inShow: "true",
    required: "true",
  },
  {
    fieldType: "Auto_Increment",
    dbColumn: "created_at",
    visualTitle: "Created at",
    inList: "false",
    inCreate: "both",
    inEdit: "both",
    inShow: "false",
    required: "both",
  },
];
const adminOptions = [
  { label: "Super Admin", value: "super-admin" },
  { label: "Sub Admin", value: "sub-admin" },
];

const customerOptions = [
  { label: "Premium Customer", value: "premium" },
  { label: "Normal Customer", value: "normal" },
];
/* =========================
   MAIN COMPONENT
========================= */
export default function ChildMenuForm() {
  const [openModal, setOpenModal] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const router = useRouter()

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "fieldType",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Field Type" />
      ),
    },
    {
      accessorKey: "dbColumn",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Database Column" />
      ),
    },
    {
      accessorKey: "visualTitle",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Visual Title" />
      ),
    },
    {
      accessorKey: "inList",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="In List" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">{renderStatusIcon(row.original.inList)}</div>
      ),
    },
    {
      accessorKey: "inCreate",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="In Create" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">{renderStatusIcon(row.original.inCreate)}</div>
      ),
    },
    {
      accessorKey: "inEdit",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="In Edit" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">{renderStatusIcon(row.original.inEdit)}</div>
      ),
    },
    {
      accessorKey: "inShow",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="In Show" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">{renderStatusIcon(row.original.inShow)}</div>
      ),
    },
    {
      accessorKey: "required",
      enableSorting: false,
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Required" />
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">{renderStatusIcon(row.original.required)}</div>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setOpenModal(true)}
          >
            <Pencil className="h-4 w-4 text-green-600" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => {
              setSelectedRow(row.original);
              setDeleteOpen(true);
            }}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        </div>
      ),
    },
  ];
  const form = useForm<MenuSchemaType>({
    resolver: zodResolver(menuSchema),
    mode: "onChange",          // ✅ ADD THIS
    reValidateMode: "onChange",// ✅ ADD THIS
    defaultValues: {
      menuName: "",
      menuTitle: "",
      parentMenu: "",
      status: "",
      userType: "",
      adminType: "",
      customerType: "",
    },
  });

  const onSubmit = (values: MenuSchemaType) => {
    console.log(values);
  };
  const selectedUserType = form.watch("userType");
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const renderDropdown = (
    name: keyof MenuSchemaType,
    label: string,
    options: { label: string; value: string }[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-1">

          {/* LABEL */}
          <FormLabel className="font-medium text-gray-800">
            {label} <span className="text-red-500">*</span>
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "font-normal w-full justify-between",
                    !field.value && "text-muted-foreground",
                    fieldState.error &&
                    "border-red-500 focus-visible:ring-red-500"
                  )}
                >
                  {field.value
                    ? options.find((o) => o.value === field.value)?.label
                    : `Select ${label}`}

                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>

            <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {options.map((item) => (
                      <CommandItem
                        key={item.value}
                        onSelect={() =>
                          form.setValue(name, item.value, {
                            shouldValidate: true, // 🔥 VERY IMPORTANT
                          })
                        }
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            field.value === item.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* ERROR */}
          <FormMessage />
        </FormItem>
      )}
    />
  );
  const [iconSearch, setIconSearch] = React.useState("");
  React.useEffect(() => {
    if (selectedUserType !== "admin") {
      form.setValue("adminType", "");
    }
    if (selectedUserType !== "customer") {
      form.setValue("customerType", "");
    }
  }, [selectedUserType]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Child Menu</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {/* FORM FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="menuName"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-medium text-gray-800">
                      Menu Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter Menu Name"
                        {...field}
                        className={cn(
                          fieldState.error && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="menuTitle"
                render={({ field, fieldState }) => {
                  const icons = [
                    { name: "Type", icon: Type },
                    { name: "Circle", icon: Circle },
                    { name: "Square", icon: Square },
                    { name: "Box", icon: Box },
                    { name: "Layout", icon: Layout },
                    { name: "Grid", icon: Grid },
                    { name: "Layers", icon: Layers },
                    { name: "Bookmark", icon: Bookmark },
                    // ← Add more Lucide icons here (20–50 is good for start)
                    // You can later import * as Lucide from "lucide-react" and map Object.keys(Lucide)
                  ];

                  const SelectedIcon = icons.find(i => i.name === field.value)?.icon || Box; // fallback to Box

                  return (
                    <FormItem className="space-y-1">
                      <FormLabel className="font-medium text-gray-800">
                        Menu Title and Icon <span className="text-red-500">*</span>
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center border rounded-md overflow-hidden bg-white",
                              fieldState.error && "border-red-500 focus-within:ring-2 focus-within:ring-red-500/30"
                            )}
                          >
                            {/* LEFT ICON BACKGROUND */}
                            <div className="bg-gray-100 px-3 cursor-pointer py-2 flex items-center justify-center border-r">
                              <SelectedIcon className="h-5 w-4 text-gray-500" />
                            </div>

                            {/* INPUT */}
                            <input
                              placeholder="Enter Menu Title"
                              className="flex-1 px-3 py-2 text-sm outline-none bg-transparent placeholder:text-muted-foreground"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />

                            {/* DROPDOWN ICON */}
                            <div className="px-2">
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent className="" align="start">
                          {/* Search input */}
                          <div className="relative mb-3">
                            <input
                              placeholder="Search The Icons"
                              className="w-full border rounded-md px-3 py-1.5 text-sm outline-none focus:border-blue-500"
                              value={iconSearch}
                              onChange={(e) => setIconSearch(e.target.value)}
                            />
                          </div>

                          {/* Icons grid */}
                          <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto pr-1">
                            {icons
                              .filter((i) =>
                                i.name.toLowerCase().includes(iconSearch.toLowerCase())
                              )
                              .map((item, idx) => {
                                const IconComp = item.icon;
                                const isSelected = field.value === item.name;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      field.onChange(item.name);
                                      // Optional: close popover after select
                                      // But many UIs keep it open → user preference
                                    }}
                                    className={cn(
                                      "flex items-center justify-center p-2 rounded-md hover:bg-gray-100 transition-colors",
                                      isSelected && "bg-blue-50 border border-blue-400",
                                      "focus:outline-none focus:ring-2 focus:ring-blue-400/40"
                                    )}
                                  >
                                    <IconComp className="h-5 w-5 text-gray-700" />
                                  </button>
                                );
                              })}
                          </div>

                          {icons.filter(i => i.name.toLowerCase().includes(iconSearch.toLowerCase())).length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-4">
                              No icons found
                            </p>
                          )}
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {renderDropdown("parentMenu", "Parent Menu", parentOptions)}
              {renderDropdown("status", "Status", statusOptions)}
              {renderDropdown("userType", "User Type", userTypeOptions)}
              {selectedUserType === "admin" &&
                renderDropdown("adminType", "Admin", adminOptions)}


              {selectedUserType === "customer" &&
                renderDropdown("customerType", "Customer", customerOptions)}

            </div>
            <div className="col-span-1  ">
              <FormLabel className="font-medium text-gray-800">Action</FormLabel>
              <div className="flex grid-cols-3  gap-6 mt-3  items-center">
                {["Create form", "Edit form", "Show page", "Delete action"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Checkbox id={item} />
                    <label htmlFor={item} className="text-sm text-nowrap cursor-pointer">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FormLabel className="font-medium  text-gray-800">Permissions</FormLabel>
              <div className="flex gap-6 mt-2 flex-wrap">
                {["Module Access", "Module Create", "Module Edit", "Module Show", "Module Delete"].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <Checkbox id={item} />
                    <label htmlFor={item} className="text-sm cursor-pointer">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ─── MODERN TABLE SECTION ─── */}
            <div className="mt-8 border rounded-md overflow-hidden">
              <div className="flex justify-between items-center p-4 border-b bg-muted/40">
                <span className="font-medium text-gray-800">Fields</span>
                <Button type="button" onClick={() => setOpenModal(true)} size="sm" className="gap-1">
                  <Plus className="h-4 w-4" />
                  Add Field
                </Button>
              </div>

              <DataGrid table={table} recordCount={data.length} isLoading={false}>
                <ScrollArea className="max-h-[400px]">
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGrid>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={() => router.push("/masterModule")}>
                Cancel
              </Button>
              <Button type="submit" className="px-8">Submit</Button>
            </div>

          </form>
        </Form>
      </CardContent>
      <RoleDeleteDialog
        open={deleteOpen}
        closeDialog={() => setDeleteOpen(false)}
        role={selectedRow}
      />
      <AddFieldDialog
        open={openModal}
        onClose={() => setOpenModal(false)}
      />
    </Card>
  );
}