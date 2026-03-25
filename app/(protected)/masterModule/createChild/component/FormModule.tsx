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
  Bookmark,
  Loader2
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
import { toast } from "sonner";
import { childUserTypeAdmin, childUserTypeCustomer, createModule, moduleDetailsApi, updateModule } from "../../../../../store/thunk/masterModule.thunk"
import { useDispatch, useSelector } from "react-redux";
import { removeCreateModuleMessage } from '@/store/slice/masterModule.slice';
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
/* =========================
   MAIN COMPONENT
========================= */
type Props = {
  mode: "create" | "edit";
  id?: any;
};
export default function FormModule({ mode, id }: Props) {
  const [openModal, setOpenModal] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [selectedRow, setSelectedRow] = React.useState<any>(null);
  const router = useRouter()
  const [selectedAdmins, setSelectedAdmins] = React.useState<number[]>([]);
  const [selectedCustomers, setSelectedCustomers] = React.useState<number[]>([]);
  const [dynamicFields, setDynamicFields] = React.useState<any[]>([]);
  const [selectedPermissions, setSelectedPermissions] = React.useState<number[]>([]);
  const [selectedAction, setSelectedAction] = React.useState<number[]>([]);
  const dispatch = useDispatch() as any;

  React.useEffect(() => {
    if (mode === "edit" && id) {
      dispatch(moduleDetailsApi(id));
    }
  }, [id, mode]);
  const { moduleDetails } = useSelector((s: any) => s.masterModule);
  const [editIndex, setEditIndex] = React.useState<number | null>(null);
  const handleDelete = (index: number) => {
    setDynamicFields((prev) => prev.filter((_, i) => i !== index));
  };
  const togglePermission = (id: number) => {
    setSelectedPermissions((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };
  const toggleAction = (id: number) => {
    setSelectedAction((prev) =>
      prev.includes(id)
        ? prev.filter((p) => p !== id)
        : [...prev, id]
    );
  };
  const { createModuleResponse, loading } = useSelector((s: any) => s.masterModule);
  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "db_column",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Database Column" />
      ),
    },
    {
      accessorKey: "label",
      header: ({ column }) => (
        <DataGridColumnHeader column={column} title="Label" />
      ),
    },
    {
      accessorKey: "validation",
      header: "Required",
      cell: ({ row }) => renderStatusIcon(row.original.validation == "Required" || row.original.validation == "Required/Unique" ? true : false),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => renderStatusIcon(row.original.status),
    },
    {
      accessorKey: "inCreate",
      header: "Create",
      cell: ({ row }) => renderStatusIcon(row.original.visible?.includes(1)),
    },
    {
      accessorKey: "inEdit",
      header: "Edit",
      cell: ({ row }) => renderStatusIcon(row.original.visible?.includes(2)),
    },
    {
      accessorKey: "inShow",
      header: "Show",
      cell: ({ row }) => renderStatusIcon(row.original.visible?.includes(3)),
    },
    {
      accessorKey: "inDelete",
      header: "Delete",
      cell: ({ row }) => renderStatusIcon(row.original.visible?.includes(4)),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const index = row.index;

        return (
          <div className="flex gap-2">
            {/* EDIT */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setSelectedRow(row.original);
                setEditIndex(index);
                setIsEdit(true);
                setOpenModal(true);
              }}
            >
              <Pencil className="h-4 w-4 text-green-600" />
            </Button>

            {/* DELETE */}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => handleDelete(index)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        );
      },
    },
  ];
  const form = useForm<MenuSchemaType>({
    resolver: zodResolver(menuSchema) as any,
    mode: "onChange",          // ✅ ADD THIS
    reValidateMode: "onChange",// ✅ ADD THIS
    defaultValues: {
      menuName: "",
      icon: "ss", // ✅ ADD THIS
      menuTitle: "",
      parentMenu: "",
      status: "",
      orderNumber: 0,
      userType: "",
      adminType: [],       // ✅ array
      customerType: [],    // ✅ array
    },
  });

  const mapValidation = (val: string) => {
    switch (val) {
      case "Required": return "required";
      case "Required/Unique": return "required|unique";
      case "Optional": return null;
      default: null;
    }
  };

  const mapColumnType = (id: number) => {
    switch (id) {
      case 1: return "Text";
      case 2: return "Email";
      case 3: return "Textarea";
      case 4: return "Password";
      case 5: return "Radio";
      case 6: return "Select";
      case 7: return "Checkbox";
      case 8: return "Integer";
      case 9: return "Float";
      case 10: return "Money";
      case 11: return "Date Picker";
      case 12: return "Date\/Time Picker";
      case 13: return "Time Picker";
      case 14: return "File";
      case 15: return "Photo";
      case 16: return "BelongsTo Relationship";
      case 17: return "BelongsToMany Relationship";
      default: return "Text";
    }
  };
  React.useEffect(() => {
    if (mode === "edit" && moduleDetails) {
      // ✅ 1. Form values set
      form.reset({
        menuName: moduleDetails.main_model_name || "",
        menuTitle: moduleDetails.menu_title || "",
        parentMenu: moduleDetails.parent_menu || "no-parent",
        status: moduleDetails.status ? "active" : "inactive",
        orderNumber: moduleDetails.order_number || 0,
        userType: moduleDetails.user_type || "",
        adminType: moduleDetails.assigned_admins?.map((a: any) => String(a.id)) || [],
        customerType: moduleDetails.assigned_agencies?.map((c: any) => String(c.id)) || [],
      });

      // ✅ 2. Dynamic Fields set
      const mappedFields = moduleDetails.fields?.map((f: any) => ({
        id: f.id,
        column_type_id: f.column_type_id,
        db_column: f.db_column,
        label: f.label,
        validation: f.validation,
        status: f.status,
        tooltip_text: f.tooltip_text,
        visible: f.visibility, // 👈 IMPORTANT
        type: mapColumnType(f.column_type_id), // helper banaenge niche
        default_value: f.default_value,
        options: f.options || [],
        is_ckeditor: f.is_ckeditor,
        is_multiple: f.is_multiple,
        max_file_size: f.max_file_size,
      })) || [];

      setDynamicFields(mappedFields);

      // ✅ 3. Permissions set
      const permissionIds = moduleDetails.permissions?.map((p: any) => {
        if (p.permission_name.includes("access")) return 1;
        if (p.permission_name.includes("create")) return 2;
        if (p.permission_name.includes("edit")) return 3;
        if (p.permission_name.includes("show")) return 4;
        if (p.permission_name.includes("delete")) return 5;
        return null;
      }).filter(Boolean);

      setSelectedPermissions(permissionIds);

      // ✅ 4. Actions set (from visibility of fields OR custom logic)
      const actionSet = new Set<number>();

      moduleDetails.fields?.forEach((f: any) => {
        f.visibility?.forEach((v: number) => {
          actionSet.add(v);
        });
      });

      setSelectedAction(moduleDetails.actions);
    }
  }, [moduleDetails, mode]);

  const onSubmit = (values: MenuSchemaType) => {
    const payload = {
      module: {
        id: mode === "edit" ? id : null,
        main_model_name: values.menuName?.trim() || "",
        slug: values.menuName
          ? values.menuName.toLowerCase().trim().replace(/\s+/g, "-")
          : "",
        menu_title: values.menuTitle,
        parent_menu: values.parentMenu === "no-parent" ? null : values.parentMenu,
        status: values.status === "active",
        icon: "fa fa-briefcase",
        user_type: values.userType,
        order_number: values.orderNumber,
        tenant_id: user?.tenant_id ?? null,

        assigned_admins:
          values.userType === "admin" || values.userType === "all"
            ? values.adminType?.map((id) => ({ id: Number(id) })) || []
            : [],

        assigned_agencies:
          values.userType === "customer" || values.userType === "all"
            ? values.customerType?.map((id) => ({ id: Number(id) })) || []
            : [],
        actions: selectedAction,
        permissions: selectedPermissions,
      },

      fields: dynamicFields.map((f: any) => {
        const field: any = {
          ...(f.id && { id: f.id }),
          column_type_id: f.column_type_id,
          db_column: f.db_column,
          label: f.label,
          validation: mapValidation(f.validation),
          status: f.status,
          tooltip_text: f.tooltip_text,
          visibility: f.visible, //aray of strings like [1,2,3,4] like action
        };

        const type = f.type;

        // Condition for default_value (Text, Radio, Select, Integer, Money, Float, Checkbox)
        if (["Text", "Radio", "Select", "Integer", "Money", "Float", "Checkbox"].includes(type)) {
          field.default_value = f.default_value;
        }

        // Condition for options (Radio, Select)
        if (["Radio", "Select"].includes(type)) {
          field.options = f.options || [];
        }

        // Condition for Textarea (is_ckeditor)
        if (type === "Textarea") {
          field.is_ckeditor = f.is_ckeditor;
        }

        // Condition for Files / Photos
        if (["File", "Photo"].includes(type)) {
          field.max_file_size = f.max_file_size;
          field.is_multiple = f.is_multiple;
          field.cropImage = f.cropImage;
        }

        // Condition for Numeric/Money (currency, precision)
        if (["Money", "Float"].includes(type)) {
          field.currency = f.currency;
          field.precision = f.precision;
        }

        // Condition for Relationships
        if (["BelongsTo Relationship", "BelongsToMany Relationship"].includes(type)) {
          field.relationModel = f.relationModel;
        }
        // Extra model info if present
        if (f.main_model_name) {
          field.main_model_name = f.main_model_name;
          field.model_field_name = f.model_field_name;
        }

        return field;
      }),
    };

    if (mode === "edit" && id) {
      dispatch(updateModule({ id, payload }));
    } else {
      dispatch(createModule(payload));
    }
  };

  const { createModuleResponse: resp, loading: load } = useSelector((s: any) => s.masterModule);

  React.useEffect(() => {
    if (!resp) return;

    if (resp.success) {
      router.push("/masterModule");
      toast.success(resp.message || (mode === "edit" ? "Module updated successfully!" : "Module created successfully!"));
      dispatch(removeCreateModuleMessage({}));
    } else {
      if (resp.errors) {
        // Handle nested errors like "module.slug"
        Object.entries(resp.errors).forEach(([key, messages]: any) => {
          const fieldMessage = Array.isArray(messages) ? messages[0] : messages;

          // Map backend keys to form fields if possible
          if (key === "module.slug" || key === "module.main_model_name") {
            form.setError("menuName", { type: "manual", message: fieldMessage });
          } else if (key === "module.menu_title") {
            form.setError("menuTitle", { type: "manual", message: fieldMessage });
          } else {
            toast.error(fieldMessage, {
              description: `Field: ${key.split('.').pop()}`,
            });
          }
        });
      } else {
        toast.error(resp.message || "An unexpected error occurred.");
      }
    }
  }, [resp, form, router, mode, dispatch]);
  const selectedUserType = form.watch("userType");
  const table = useReactTable({
    data: dynamicFields, // ✅ CHANGE
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
                    "font-normal w-full justify-between h-9",
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
  const renderMultiDropdown = (
    name: "adminType" | "customerType",
    label: string,
    options: { label: string; value: string }[]
  ) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        const selectedValues: string[] = field.value || [];

        return (
          <FormItem className="space-y-1">
            <FormLabel>
              {label} <span className="text-red-500">*</span>
            </FormLabel>

            <Popover>
              {/* 🔥 CLICK AREA (INPUT STYLE) */}
              <PopoverTrigger asChild>
                <div className="flex flex-wrap gap-2 border border-input rounded-md px-3 py-2 min-h-[40px] cursor-pointer">
                  {selectedValues.length > 0 ? (
                    selectedValues.map((val) => {
                      const item = options.find(o => o.value === val);
                      if (!item) return null;

                      return (
                        <span
                          key={val}
                          className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-sm"
                        >
                          {item.label}
                          <X
                            size={14}
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation(); // 🔥 important
                              const newValues = selectedValues.filter(v => v !== val);
                              form.setValue(name, newValues, { shouldValidate: true });
                            }}
                          />
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      Select {label}
                    </span>
                  )}
                </div>
              </PopoverTrigger>

              {/* 🔥 DROPDOWN */}
              <PopoverContent className="w-[250px] p-0">
                <Command>
                  <CommandList>
                    <CommandGroup>
                      <ScrollArea className="h-[200px]">
                        {options?.map((item) => {
                          const isSelected = selectedValues.includes(item.value);

                          return (
                            <CommandItem
                              key={item.value}
                              onSelect={() => {
                                let newValues;

                                if (isSelected) {
                                  newValues = selectedValues.filter(v => v !== item.value);
                                } else {
                                  newValues = [...selectedValues, item.value];
                                }

                                form.setValue(name, newValues, {
                                  shouldValidate: true,
                                });
                              }}
                            >
                              <span className="flex-1">{item.label}</span>

                              <Check
                                className={
                                  isSelected ? "opacity-100" : "opacity-0"
                                }
                              />
                            </CommandItem>
                          );
                        })}
                      </ScrollArea>
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
  const [iconSearch, setIconSearch] = React.useState("");
  const { adminList, customerList } = useSelector((s: any) => s.masterModule);
  const { user } = useSelector((s: any) => s.auth);

  const adminOptionsFormatted = adminList?.map((item: any) => ({
    label: item.name,
    value: item.id.toString(), // unique hona chahiye
  }));
  const customerOptionsFormatted = customerList?.map((item: any) => ({
    label: item.agency_name,
    value: item.id.toString(), // unique hona chahiye
  }));
  const permissionList = [
    { id: 1, label: "Module Access" },
    { id: 2, label: "Module Create" },
    { id: 3, label: "Module Edit" },
    { id: 4, label: "Module Show" },
    { id: 5, label: "Module Delete" },
  ];
  const actionList = [
    { id: 1, label: "Create form" },
    { id: 2, label: "Edit form" },
    { id: 3, label: "Show page" },
    { id: 4, label: "Delete action" },
  ];
  // console.log(adminList)
  React.useEffect(() => {
    if (selectedUserType !== "admin") {
      form.setValue("adminType", []);
    }
    if (selectedUserType !== "customer") {
      form.setValue("customerType", []);
    }
    if (selectedUserType == "customer") {
      dispatch(childUserTypeCustomer());
    }
    if (selectedUserType == "admin") {
      dispatch(childUserTypeAdmin());
    }
  }, [selectedUserType]);
  const onError = (errors: any) => {
    console.log("❌ VALIDATION ERRORS 👉", errors);
  };
  const [selectedIcon, setSelectedIcon] = React.useState("Box");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{mode === "edit" ? "Edit" : "Create"} Child Module</CardTitle>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-8">

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
                        disabled={mode === "edit"}
                        className={cn(
                          "h-9 w-full disabled:bg-gray-200 disabled:cursor-not-allowed ",
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
                  ];


                  const SelectedIcon =
                    icons.find(i => i.name === selectedIcon)?.icon || Box;

                  return (
                    <FormItem className="space-y-1">
                      <FormLabel>
                        Menu Title and Icon <span className="text-red-500">*</span>
                      </FormLabel>

                      <div
                        className={cn(
                          "flex items-center border rounded-md overflow-hidden h-9 w-full",
                          fieldState.error && "border-red-500"
                        )}
                      >
                        {/* ✅ LEFT ICON CLICK ONLY */}
                        <Popover>
                          <PopoverTrigger asChild>
                            <div className="bg-gray-100 px-3 cursor-pointer py-2 flex items-center justify-center border-r">
                              <SelectedIcon className="h-5 w-5 text-gray-600" />
                            </div>
                          </PopoverTrigger>

                          <PopoverContent align="start">
                            <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto">
                              {icons.map((item, idx) => {
                                const IconComp = item.icon;

                                return (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setSelectedIcon(item.name); // ✅ icon update
                                    }}
                                    className="p-2 hover:bg-gray-100 rounded"
                                  >
                                    <IconComp className="h-5 w-5" />
                                  </button>
                                );
                              })}
                            </div>
                          </PopoverContent>
                        </Popover>

                        {/* ✅ RIGHT SIDE INPUT (typing only) */}
                        <input
                          placeholder="Enter Menu Title"
                          className="flex-1 px-3 py-2 text-sm outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                          value={field.value || ""}
                          onChange={field.onChange}
                          disabled={mode === "edit"}
                        />

                      </div>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {renderDropdown("parentMenu", "Parent Menu", parentOptions)}
              {renderDropdown("status", "Status", statusOptions)}
              {renderDropdown("userType", "User Type", userTypeOptions)}
              {selectedUserType === "admin" &&
                renderMultiDropdown("adminType", "Admin", adminOptionsFormatted)}
              {selectedUserType === "customer" &&
                renderMultiDropdown("customerType", "Customer", customerOptionsFormatted)}

              <FormField
                control={form.control}
                name="orderNumber"
                render={({ field, fieldState }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-medium text-gray-800">
                      Order Number <span className="text-red-500">*</span>
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number" // ✅ IMPORTANT
                        placeholder="Enter Order Number"
                        {...field}
                        className={cn(
                          "h-9 w-full",
                          fieldState.error && "border-red-500 focus-visible:ring-red-500"
                        )}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="col-span-1  ">
              <FormLabel className="font-medium text-gray-800">Action</FormLabel>
              <div className="flex grid-cols-3  gap-6 mt-3  items-center">
                {actionList.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedAction?.includes(item.id)} // ✅ state binding
                      onCheckedChange={() => toggleAction(item.id)} // ✅ toggle call
                    />
                    <label className="text-sm cursor-pointer">
                      {item.label}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <FormLabel className="font-medium  text-gray-800">Permissions</FormLabel>
              <div className="flex gap-6 mt-2 flex-wrap">
                {permissionList.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <Checkbox
                      checked={selectedPermissions?.includes(item.id)} // ✅ state binding
                      onCheckedChange={() => togglePermission(item.id)} // ✅ toggle call
                    />
                    <label className="text-sm cursor-pointer">
                      {item.label}
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

              <DataGrid table={table} recordCount={dynamicFields.length} isLoading={false}>
                <ScrollArea className="max-h-[400px]">
                  <DataGridTable />
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </DataGrid>
            </div>

            {/* SUBMIT */}
            <div className="flex justify-end gap-3 mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/masterModule")}
                disabled={loading}
              >
                Cancel
              </Button>

              {/* <Button
                type="button"
                variant="secondary"
                onClick={() => form.reset()}
                disabled={!loading}
              >
                Reset
              </Button> */}

              <Button
                type="submit"
                className="px-8"
              // disabled={!loading}
              >
                {/* {!loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : ( */}
                {mode === "edit" ? "Update" : "Submit"}
                {/* )} */}
              </Button>
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
        mode={mode}
        onClose={() => {
          setOpenModal(false);
          setIsEdit(false);
          setEditIndex(null);
          setSelectedRow(null);
        }}
        setFields={setDynamicFields}
        editData={selectedRow}
        editIndex={editIndex}
      />
    </Card>
  );
}