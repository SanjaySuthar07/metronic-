'use client';

import React from "react";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";

import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command";

import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { fieldSchema, FieldSchemaType } from "../forms/addFieldSchema.ts";
/* =========================
   OPTIONS
========================= */

const typeOptions = [
    "Text", "Email", "Textarea", "Password",
    "Radio", "Select", "Checkbox", "Integer",
    "Float", "Date Picker", "Time Picker"
];

const validationOptions = [
    "Optional", "Required", "Required/Unique"
];

export default function AddFieldDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {
    const onSubmit = (data: any) => {
        console.log("FORM DATA 👉", data);
    };
    const form = useForm<FieldSchemaType>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            type: "",
            dbColumn: "",
            label: "",
            validation: "",
            tooltip: "",
            defaultValue: "",
        },
    });

    /* =========================
       DROPDOWN (FIXED 🔥)
    ========================= */
    const renderDropdown = (name: any, label: string, options: string[]) => (
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
                                        "w-full justify-between font-normal",
                                        !field.value && "text-muted-foreground",
                                        fieldState.error &&
                                        "border-red-500 focus-visible:ring-red-500"
                                    )}
                                >
                                    {field.value || `Select ${label}`}
                                    <ChevronDown className="h-4 w-4 opacity-50" />

                                </Button>
                            </FormControl>
                        </PopoverTrigger>

                        <PopoverContent className="p-0">
                            <Command>
                                <CommandList>
                                    <CommandGroup>
                                        {options.map((item) => (
                                            <CommandItem
                                                key={item}
                                                onSelect={() =>
                                                    form.setValue(name, item, {
                                                        shouldValidate: true,
                                                    })
                                                }
                                            >
                                                {item}
                                                <Check
                                                    className={cn(
                                                        "ml-auto",
                                                        field.value === item
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

                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Add Field</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        {/* GRID */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* TYPE */}
                            {renderDropdown("type", "Type", typeOptions)}

                            {/* DB COLUMN */}
                            <FormField
                                control={form.control}
                                name="dbColumn"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="font-normal">
                                            Database column <span className="text-red-500">*</span>
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Database Column"
                                                {...field}
                                                className={cn(
                                                    fieldState.error &&
                                                    "border-red-500 focus-visible:ring-red-500"
                                                )}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* LABEL */}
                            <FormField
                                control={form.control}
                                name="label"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="font-normal">
                                            Label <span className="text-red-500">*</span>
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Label Name"
                                                {...field}
                                                className={cn(
                                                    fieldState.error &&
                                                    "border-red-500 focus-visible:ring-red-500"
                                                )}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VALIDATION */}
                            {renderDropdown("validation", "Validation", validationOptions)}

                            {/* TOOLTIP */}
                            <FormField
                                control={form.control}
                                name="tooltip"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel className="font-normal">
                                            Tooltip Text <span className="text-red-500">*</span>
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="Tooltip Text"
                                                {...field}
                                                className={cn(
                                                    fieldState.error &&
                                                    "border-red-500 focus-visible:ring-red-500"
                                                )}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VISIBILITY */}
                            <div>
                                <FormLabel className="font-normal">Visibility</FormLabel>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                    {["Create form", "Edit form", "Show page", "Delete action"].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <Checkbox />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                        </div>

                        {/* DEFAULT VALUE */}
                        <FormField
                            control={form.control}
                            name="defaultValue"
                            render={({ field, fieldState }) => (
                                <FormItem className="space-y-1">
                                    <FormLabel className="font-normal">
                                        Default value <span className="text-red-500">*</span>
                                    </FormLabel>

                                    <FormControl>
                                        <Input
                                            placeholder="Default value"
                                            {...field}
                                            className={cn(
                                                fieldState.error &&
                                                "border-red-500 focus-visible:ring-red-500"
                                            )}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* BUTTONS */}
                        <div className="flex justify-end gap-3">
                            <Button variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}