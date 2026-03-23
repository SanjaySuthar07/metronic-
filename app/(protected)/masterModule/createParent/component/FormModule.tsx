'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardHeading,
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

import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";

import { menuSchema, MenuSchemaType } from "../forms/menuSchema.ts";
import { useRouter } from 'next/navigation';

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

            <PopoverContent className="w-full p-0">
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
                  <FormItem>
                    <FormLabel className="font-normal">Menu Name<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Menu Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Menu Title */}
              <FormField
                control={form.control}
                name="menuTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-normal">Menu Title and Icon<span className="text-red-500">*</span></FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Menu Title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Parent Menu */}
              {renderDropdown("parentMenu", "Parent Menu", parentOptions)}

              {/* Status */}
              {renderDropdown("status", "Status", statusOptions)}

              {/* User Type */}
              {renderDropdown("userType", "User Type", userTypeOptions)}

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