'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardHeading,
} from "@/components/ui/card";
import {
  Home,
  LayoutDashboard,
  User,
  Users,
  Settings,
  Pencil,
  IdCard,
  Menu,
  Folder,
  FileText,
  Bell,
  LogOut
} from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useDispatch, useSelector } from "react-redux";
import { childUserTypeAdmin, childUserTypeCustomer, createModule } from "../../../../../store/thunk/masterModule.thunk"

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { X } from "lucide-react";

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

import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { menuSchema, MenuSchemaType } from "../forms/menuSchema.ts";
import { useRouter } from 'next/navigation';
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";


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

function FormModule() {
  const router = useRouter()
  const form = useForm<MenuSchemaType>({
    resolver: zodResolver(menuSchema),
    defaultValues: {
      menuName: "",
      menuTitle: "",
      parentMenu: "",
      status: "",
      userType: "",
      adminType: [],
      customerType: [],
    },
  });

  const onSubmit = (values: MenuSchemaType) => {
    console.log(values);
  };

  // reusable dropdown
  const renderDropdown = (name: any, label: string, options: any[]) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => (
        <FormItem className="space-y-1">

          {/* LABEL */}
          <FormLabel className="font-normal">
            {label} <span className="text-red-500">*</span>
          </FormLabel>

          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "font-normal w-full justify-between h-9 my-0",
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

            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
              <Command>
                <CommandList>
                  <CommandGroup>
                    {options.map((item) => (
                      <CommandItem
                        key={item.value}
                        onSelect={() => {
                          form.setValue(name, item.value, {
                            shouldValidate: true, // 🔥 IMPORTANT
                          });
                        }}
                      >
                        {item.label}
                        <Check
                          className={cn(
                            "ml-auto",
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

          {/* ERROR MESSAGE */}
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
            <FormLabel className="font-normal">
              {label} <span className="text-red-500">*</span>
            </FormLabel>

            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "font-normal w-full justify-between h-9 ",
                      selectedValues.length === 0 && "text-muted-foreground"
                    )}
                  >
                    {/* LEFT SIDE */}
                    <div className="flex flex-wrap gap-2 overflow-hidden">
                      {selectedValues.length > 0 ? (
                        selectedValues.map((val) => {
                          const item = options.find(o => o.value === val);
                          if (!item) return null;

                          return (
                            <span
                              key={val}
                              className="bg-gray-200 px-2 py-1 rounded flex items-center gap-1 text-xs"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {item.label}
                              <X
                                size={12}
                                className="cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const newValues = selectedValues.filter(v => v !== val);
                                  form.setValue(name, newValues, { shouldValidate: true });
                                }}
                              />
                            </span>
                          );
                        })
                      ) : (
                        <span>Select {label}</span>
                      )}
                    </div>

                    {/* RIGHT ICON */}
                    <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                  </Button>
                </FormControl>
              </PopoverTrigger>

              {/* 🔥 DROPDOWN */}
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
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
  const dispatch = useDispatch() as any;
  const { adminList, customerList } = useSelector((s: any) => s.masterModule);
  const { user } = useSelector((s: any) => s.auth);
  const selectedUserType = form.watch("userType");
  const [iconSearch, setIconSearch] = useState("");
  useEffect(() => {
    if (selectedUserType !== "admin") {
      form.setValue("adminType", [], { shouldValidate: true });
    }

    if (selectedUserType !== "customer") {
      form.setValue("customerType", [], { shouldValidate: true });
    }

    if (selectedUserType === "admin") {
      dispatch(childUserTypeAdmin());
    }

    if (selectedUserType === "customer") {
      dispatch(childUserTypeCustomer());
    }
  }, [selectedUserType]);

  const adminOptionsFormatted = adminList?.map((item: any) => ({
    label: item.name,
    value: item.id.toString(), // unique hona chahiye
  }));
  const customerOptionsFormatted = customerList?.map((item: any) => ({
    label: item.agency_name,
    value: item.id.toString(), // unique hona chahiye
  }));

  return (
    <Card>
      <CardHeader className="py-3">
        <CardHeading>
          <CardTitle>Users</CardTitle>
        </CardHeading>
      </CardHeader>
      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            {/* GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Menu Name */}
              <FormField
                control={form.control}
                name="menuName"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="font-normal">Menu Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Menu Name" {...field} className="h-9 w-full" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Menu Title */}
              <FormField
                control={form.control}
                name="menuTitle"
                render={({ field, fieldState }) => {
                  const icons = [
                    { name: "Home", icon: Home, fa: "fa fa-home" },
                    { name: "Dashboard", icon: LayoutDashboard, fa: "fa fa-tachometer-alt" },
                    { name: "User", icon: User, fa: "fa fa-user" },
                    { name: "Users", icon: Users, fa: "fa fa-users" },
                    { name: "Settings", icon: Settings, fa: "fa fa-cog" },
                    { name: "Edit", icon: Pencil, fa: "fa fa-edit" },
                    { name: "Profile", icon: IdCard, fa: "fa fa-id-card" },
                    { name: "Menu", icon: Menu, fa: "fa fa-bars" },
                    { name: "Folder", icon: Folder, fa: "fa fa-folder" },
                    { name: "File", icon: FileText, fa: "fa fa-file" },
                    { name: "Notification", icon: Bell, fa: "fa fa-bell" },
                    { name: "Logout", icon: LogOut, fa: "fa fa-sign-out-alt" },
                  ];

                  const SelectedIcon =
                    icons.find(i => i.name === field.value)?.icon || Menu;

                  return (
                    <FormItem className="space-y-1">
                      <FormLabel className="font-normal">
                        Menu Title and Icon <span className="text-red-500">*</span>
                      </FormLabel>

                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            className={cn(
                              "flex items-center relative border rounded-md overflow-hidden bg-white h-9 w-full",
                              fieldState.error &&
                              "border-red-500 focus-within:ring-2 focus-within:ring-red-500/30"
                            )}
                          >
                            {/* LEFT ICON */}
                            <div className="bg-gray-100 h-100 px-3 flex items-center justify-center border-r">
                              <SelectedIcon className="h-4 w-4 text-gray-500" />
                            </div>

                            {/* INPUT */}
                            <input
                              placeholder="Enter Menu Title"
                              className="flex-1 px-3 text-sm outline-none bg-transparent"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />

                            {/* DROPDOWN ICON */}
                            <div className="px-2">
                              <ChevronDown className="h-4 w-4 opacity-50" />
                            </div>
                          </div>
                        </PopoverTrigger>

                        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-2">
                          {/* SEARCH */}
                          <input
                            placeholder="Search Icon"
                            className="w-full border rounded-md px-3 py-1.5 text-sm mb-2"
                            value={iconSearch}
                            onChange={(e) => setIconSearch(e.target.value)}
                          />

                          {/* ICON GRID */}
                          <div className="grid grid-cols-3 gap-2 max-h-[180px] overflow-y-auto">
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
                                    onClick={() => field.onChange(item.name)}
                                    className={cn(
                                      "flex items-center justify-center p-2 rounded-md hover:bg-gray-100",
                                      isSelected && "bg-blue-50 border border-blue-400"
                                    )}
                                  >
                                    <IconComp className="h-4 w-4 text-gray-700" />
                                  </button>
                                );
                              })}
                          </div>
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Parent Menu */}
              {renderDropdown("parentMenu", "Parent Menu", parentOptions)}

              {/* Status */}
              {renderDropdown("status", "Status", statusOptions)}

              {/* User Type */}
              {renderDropdown("userType", "User Type", userTypeOptions)}


              {selectedUserType === "admin" && (
                renderMultiDropdown("adminType", "Admin", adminOptionsFormatted)
              )}

              {selectedUserType === "customer" && (
                renderMultiDropdown("customerType", "Customer", customerOptionsFormatted)
              )}
            </div>

            {/* BUTTONS */}
            <div className="flex justify-end gap-3 mt-6">
              <Button type="button" variant="outline" onClick={() => router.push("/masterModule")}>
                Cancel
              </Button>
              <Button type="submit">
                Submit
              </Button>
            </div>

          </form>
        </Form>

      </CardContent>
    </Card>
  );
}

export default FormModule;