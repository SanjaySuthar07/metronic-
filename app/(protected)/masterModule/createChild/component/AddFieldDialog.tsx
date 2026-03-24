'use client';

import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from 'react-redux';
import { zodResolver } from "@hookform/resolvers/zod";

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

import { fieldSchema, FieldSchemaType } from "../forms/addFieldSchema.ts";
import { getColumnTypes, getAllModels } from "../../../../../store/thunk/masterModule.thunk.ts";
import { OptionsTable } from "./common/OptionsTable"
import { FormDropdown } from "./common/FormDropdown";
/* =========================
   OPTIONS
========================= */

const validationOptions = [
    "Optional",
    "Required",
    "Required/Unique"
];

/* =========================
   DROPDOWN COMPONENT
========================= */


/* =========================
   MAIN COMPONENT - UPDATED
========================= */

export default function AddFieldDialog({
    open,
    onClose,
}: {
    open: boolean;
    onClose: () => void;
}) {

    const dispatch = useDispatch();
    const { inputTypes, loading, inputModel } = useSelector((s: any) => s.masterModule);

    const form = useForm<FieldSchemaType>({
        resolver: zodResolver(fieldSchema),
        mode: "onChange",
        defaultValues: {
            type: "",
            dbColumn: "",
            label: "",
            validation: "",
            tooltip: "",
            defaultValue: "",
            maxFileSize: "",
            multipleFiles: false,
            maxPhotoSize: "",
            cropImage: false,
            currency: "",
            precision: "",
            options: [],   // ← yahan ek empty option daal diya taaki Radio/Select mein turant dikhe
            relationModel: "",
            useCKEditor: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });

    React.useEffect(() => {
        if (open) {
            form.reset({
                type: "",
                dbColumn: "",
                label: "",
                validation: "",
                tooltip: "",
                defaultValue: "",
                maxFileSize: "",
                multipleFiles: false,
                maxPhotoSize: "",
                cropImage: false,
                currency: "",
                precision: "",
                options: [],
                relationModel: "",
                useCKEditor: false,
            });
        }
    }, [open]);

    const modelOptions = ["User", "Category", "Product"];

    /* FETCH TYPES */
    React.useEffect(() => {
        if (!inputTypes?.length) {
            dispatch(getColumnTypes());
        }
    }, [dispatch, inputTypes, open]);


    /* SET DEFAULT TYPE = TEXT */
    React.useEffect(() => {
        if (inputTypes?.length && !form.getValues("type")) {
            const textType = inputTypes.find((item: any) => item.input_type === "text");
            if (textType) {
                form.setValue("type", textType.name, { shouldValidate: true });
            }
        }
    }, [inputTypes, form]);

    const selectedType = form.watch("type");

    React.useEffect(() => {
        if (!selectedType) return;
        form.reset({
            ...form.getValues(), // keep existing base values if needed
            defaultValue: "",
            maxFileSize: "",
            multipleFiles: false,
            maxPhotoSize: "",
            cropImage: false,
            currency: "",
            precision: "",
            options: [],
            relationModel: "",
            useCKEditor: false,
        });
    }, [selectedType]);
    React.useEffect(() => {
        if (
            selectedType === "BelongsTo Relationship" ||
            selectedType === "BelongsToMany Relationship"
        ) {
            dispatch(getAllModels());
        }
    }, [selectedType]);
    React.useEffect(() => {
        if (
            selectedType !== "BelongsTo Relationship" &&
            selectedType !== "BelongsToMany Relationship"
        ) {
            form.setValue("relationModel", "", { shouldValidate: true });
        }
    }, [selectedType, form]);

    const onSubmit = (data: FieldSchemaType) => {
        console.log("✅ FORM SUBMITTED SUCCESSFULLY 👉", data);
    };

    const onError = (errors: any) => {
        console.log("❌ VALIDATION ERRORS 👉", errors);
    };

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-5xl ">
                <DialogHeader>
                    <DialogTitle>Add Field</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit, onError)} className="space-y-6">

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* TYPE */}
                            <FormDropdown
                                form={form}
                                name="type"
                                label="Type"
                                inputTypes={inputTypes}
                                loading={loading}
                            />

                            {/* DATABASE COLUMN */}
                            <FormField
                                control={form.control}
                                name="dbColumn"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Database Column <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. user_name" {...field}
                                                className={cn(fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
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
                                        <FormLabel>Label <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Label Name" {...field}
                                                className={cn(fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VALIDATION */}
                            <FormDropdown
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
                                        <FormLabel>Tooltip <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tooltip Text" {...field}
                                                className={cn(fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* VISIBILITY */}
                            <div className="space-y-1">
                                <FormLabel>Visibility</FormLabel>
                                <div className="flex gap-4 mt-2 flex-wrap">
                                    {["Create form", "Edit form", "Show page", "Delete action"].map((item) => (
                                        <div key={item} className="flex items-center gap-2">
                                            <Checkbox id={item} />
                                            <label htmlFor={item} className="text-sm cursor-pointer">{item}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* ====================== CONDITIONAL FIELDS ====================== */}

                        {/* Text */}
                        {(selectedType === "Text" || selectedType === "Radio" || selectedType === "Select" || selectedType === "Integer" || selectedType === "Money" || selectedType === "Float") && (
                            <FormField
                                control={form.control}
                                name="defaultValue"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Default value <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Default value"  {...field}
                                                className={cn(fieldState.error && "w-80 border-red-500 focus-visible:ring-red-500" || "w-80")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* Textarea */}
                        {selectedType === "Textarea" && (
                            <div className="flex gap-2 items-center">
                                <Checkbox
                                    checked={form.watch("useCKEditor")}
                                    onCheckedChange={(val) => form.setValue("useCKEditor", val as boolean)}
                                />
                                <span>Use  Ckeditor</span>
                            </div>
                        )}

                        {/* ===== RADIO & SELECT - SAME UI ===== */}
                        {(selectedType === "Select" || selectedType === "Radio") && (
                            <OptionsTable
                                form={form}
                                fields={fields}
                                append={append}
                                remove={remove}
                            />
                        )}

                        {/* Checkbox */}
                        {selectedType === "Checkbox" && (
                            <FormField
                                control={form.control}
                                name="defaultValue"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Default Value *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="w-80">
                                                <SelectValue placeholder="Select default" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {["Checked", "UnChecked"].map((role) => (
                                                    <SelectItem key={role} value={role}>
                                                        {role}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}

                        {/* File */}
                        {(selectedType === "File" || selectedType === "Photo") && (
                            <div className="flex items-center gap-6">
                                <FormField
                                    control={form.control}
                                    name={selectedType === "File" ? "maxFileSize" : selectedType === "Photo" ? "maxPhotoSize" : "maxPhotoSize"}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Max {selectedType === "Photo" ? "photo" : "file"} file size (MB) <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative flex">
                                                    <Input {...field} placeholder="2" className={cn("w-80", fieldState.error && "border-red-500")} />
                                                    <span className="absolute right-0 top-0 bottom-0 px-3 flex items-center bg-gray-200 rounded-r-md">MB</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2 mt-8">
                                    <Checkbox
                                        checked={form.watch("multipleFiles")}
                                        onCheckedChange={(val) => form.setValue("multipleFiles", !!val)}
                                    />
                                    <span>Multiple files</span>
                                </div>
                            </div>
                        )}

                        {/* Date Picker */}
                        {selectedType === "Date Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>Allow past dates</span></div>
                                <div className="flex items-center gap-2"><Checkbox /> <span>Allow future dates</span></div>
                            </div>
                        )}

                        {/* Date/Time Picker */}
                        {selectedType === "Date/Time Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>Enable Time</span></div>
                                <div className="flex items-center gap-2"><Checkbox /> <span>24 Hour Format</span></div>
                            </div>
                        )}

                        {/* Time Picker */}
                        {selectedType === "Time Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>24 Hour Format</span></div>
                            </div>
                        )}

                        {/* Relationship */}
                        {(selectedType === "BelongsTo Relationship" || selectedType === "BelongsToMany Relationship") && (
                            <FormDropdown
                                form={form}
                                name="relationModel"
                                label="Model"
                                options={inputModel}
                            />
                        )}

                        {/* ACTION BUTTONS */}
                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Add Field
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}