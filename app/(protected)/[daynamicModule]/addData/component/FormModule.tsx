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

  // const onSubmit = (values: MenuSchemaType) => {
  //   console.log(values);
  // };

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

  const onSubmit = (values: any) => {
    console.log("FORM DATA 👉", values);
  };

  return (
    <Card>
      <CardHeader className="py-3">
        <CardHeading>
          <CardTitle>Dynamic Form</CardTitle>
        </CardHeading>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* TEXT */}
              <FormField
                control={form.control}
                name="text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Text</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter text" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* EMAIL */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Enter email" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* PASSWORD */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* TEXTAREA */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <textarea
                        className="border rounded-md p-2 w-full"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* DROPDOWN */}
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <select
                      className="border rounded-md h-9 px-2"
                      {...field}
                    >
                      <option value="">Select</option>
                      <option value="1">Option 1</option>
                      <option value="2">Option 2</option>
                    </select>
                  </FormItem>
                )}
              />

              {/* RADIO */}
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <div className="flex gap-4">
                      <label>
                        <input
                          type="radio"
                          value="male"
                          checked={field.value === "male"}
                          onChange={field.onChange}
                        /> Male
                      </label>
                      <label>
                        <input
                          type="radio"
                          value="female"
                          checked={field.value === "female"}
                          onChange={field.onChange}
                        /> Female
                      </label>
                    </div>
                  </FormItem>
                )}
              />

              {/* CHECKBOX */}
              <FormField
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <FormItem>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={field.value || false}
                        onChange={(e) => field.onChange(e.target.checked)}
                      />
                      Agree Terms
                    </label>
                  </FormItem>
                )}
              />

              {/* FILE */}
              <FormField
                control={form.control}
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload File</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* IMAGE */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Upload Image</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => field.onChange(e.target.files?.[0])}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-6">
              <Button type="submit">Submit</Button>
            </div>

          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default FormModule;