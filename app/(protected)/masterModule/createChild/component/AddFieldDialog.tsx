'use client';

import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash } from "lucide-react";
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
import { getColumnTypes } from "../../../../../store/thunk/masterModule.thunk.ts";
import { useFieldArray } from "react-hook-form";
/* =========================
   OPTIONS
========================= */

const validationOptions = [
    "Optional",
    "Required",
    "Required/Unique"
];


/* =========================
   DROPDOWN COMPONENT ✅ (FIXED)
========================= */

const DropdownField = ({
    form,
    name,
    label,
    options,
    inputTypes,
    loading
}: any) => {

    const [open, setOpen] = React.useState(false);
    const data = options || inputTypes;

    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className="space-y-1">

                    <FormLabel>
                        {label} <span className="text-red-500">*</span>
                    </FormLabel>

                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <FormControl>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className={cn(
                                        "w-full justify-between font-normal capitalize",
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

                                        {loading && (
                                            <div className="p-2 text-sm text-gray-400">
                                                Loading...
                                            </div>
                                        )}

                                        {data?.map((item: any, index: number) => {
                                            const value = options ? item : item.name;

                                            return (
                                                <CommandItem
                                                    key={index}
                                                    onSelect={() => {
                                                        form.setValue(name, value, {
                                                            shouldValidate: true,
                                                        });
                                                        setOpen(false);
                                                    }}
                                                >
                                                    {value}
                                                    <Check
                                                        className={cn(
                                                            "ml-auto",
                                                            field.value === value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            );
                                        })}

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
};


/* =========================
   MAIN COMPONENT
========================= */

export default function AddFieldDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {

    const dispatch = useDispatch();
    const { inputTypes, loading } = useSelector((s: any) => s.masterModule);

    const form = useForm<FieldSchemaType>({
        resolver: zodResolver(fieldSchema),
        defaultValues: {
            type: "",
            dbColumn: "",
            label: "",
            validation: "",
            tooltip: "",
            defaultValue: "",
            options: [{ value: "", label: "" }], // ✅ IMPORTANT
        },
    });
    /* FETCH TYPES */
    React.useEffect(() => {
        if (!inputTypes?.length) {
            dispatch(getColumnTypes());
        }
    }, [dispatch, inputTypes]);
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });
    /* SET DEFAULT TYPE = TEXT */
    React.useEffect(() => {
        if (inputTypes?.length) {
            const textType = inputTypes.find(
                (item: any) => item.input_type === "text"
            );

            if (textType) {
                form.setValue("type", textType.name);
            }
        }
    }, [inputTypes]);

    const selectedType = form.watch("type");

    const onSubmit = (data: FieldSchemaType) => {
        console.log("FORM DATA 👉", data);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-5xl">

                <DialogHeader>
                    <DialogTitle>Add Field</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                            {/* TYPE */}
                            <DropdownField
                                form={form}
                                name="type"
                                label="Type"
                                inputTypes={inputTypes}
                                loading={loading}
                            />

                            {/* DEFAULT VALUE */}
                            <FormField
                                control={form.control}
                                name="dbColumn"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1 w-70px">
                                        <FormLabel>
                                            Database Column <span className="text-red-500">*</span>
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
                                        <FormLabel>Label *</FormLabel>
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
                            <DropdownField
                                form={form}
                                name="validation"
                                label="Validation"
                                options={validationOptions}
                            />

                            {/* TOOLTIP */}
                            <FormField
                                control={form.control}
                                name="tooltip"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Tooltip *</FormLabel>
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
                                <FormLabel>Visibility</FormLabel>
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
                        {selectedType === "Text" && (
                            <FormField
                                control={form.control}
                                name="defaultValue"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1 w-70">
                                        <FormLabel>
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
                        )}

                        {selectedType === "Textarea" && (
                            <div>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                    {["Use CKEDITOR"].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <Checkbox />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}


                        {selectedType === "Select" && (
                            <div className="space-y-4">

                                {/* 🔥 TOP LABEL ONLY ONCE */}
                                {
                                    fields.length > 0 ?
                                        (<div className="flex items-center gap-4 mb-2">
                                            <div style={{ width: "46%" }}>
                                                <FormLabel>Database Value *</FormLabel>
                                            </div>
                                            <div style={{ width: "46%" }}>
                                                <FormLabel>Label Text *</FormLabel>
                                            </div>
                                            <div >
                                                <FormLabel></FormLabel>
                                            </div>
                                        </div>) : ""
                                }

                                <div className="max-h-[260px] overflow-y-auto pr-2">

                                    {fields.map((item, index) => (
                                        <div key={item.id} className="flex items-center gap-4 mb-2">

                                            {/* VALUE INPUT */}
                                            <div className="flex-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`options.${index}.value`}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Database value"
                                                                    {...field}
                                                                    className={cn(
                                                                        "w-full",
                                                                        fieldState.error &&
                                                                        "border-red-500 focus-visible:ring-red-500"
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* LABEL INPUT */}
                                            <div className="flex-1">
                                                <FormField
                                                    control={form.control}
                                                    name={`options.${index}.label`}
                                                    render={({ field, fieldState }) => (
                                                        <FormItem>
                                                            <FormControl>
                                                                <Input
                                                                    placeholder="Label text"
                                                                    {...field}
                                                                    className={cn(
                                                                        "w-full",
                                                                        fieldState.error &&
                                                                        "border-red-500 focus-visible:ring-red-500"
                                                                    )}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <Button
                                                type="button"
                                                variant="destructive"
                                                onClick={() => remove(index)}
                                                className="px-3 shrink-0"
                                            >
                                                <Trash className="w-4 h-4" />
                                            </Button>

                                        </div>
                                    ))}

                                </div>
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => append({ value: "", label: "" })}
                                    >
                                        Add New Key
                                    </Button>
                                </div>

                            </div>
                        )}

                        {
                            selectedType === "Checkbox" &&
                            (
                                <>
                                    <FormLabel>Default Value *</FormLabel>
                                    <Select>
                                        <SelectTrigger className=" w-80">
                                            <SelectValue placeholder="All types" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Type</SelectItem>
                                            {["Checked", "UnChecked"].map((role: any) => {
                                                return (
                                                    <div key={role}>
                                                        <SelectItem
                                                            value={role}
                                                            className="capitalize"
                                                        >
                                                            {role}
                                                        </SelectItem>
                                                    </div>
                                                );
                                            })}
                                        </SelectContent>
                                    </Select>
                                </>
                            )
                        }

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3">
                            <Button type="button" variant="outline" onClick={onClose}>
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