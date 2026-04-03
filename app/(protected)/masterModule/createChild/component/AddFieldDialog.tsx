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

import { fieldSchema, FieldSchemaType } from "../forms/addFieldSchema";
import { getColumnTypes, getAllModels } from "../../../../../store/thunk/masterModule.thunk";
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
    setFields,
    editData,
    mode,
    editIndex
}: {
    open: boolean;
    onClose: () => void;
    setFields: React.Dispatch<React.SetStateAction<any[]>>;
    editData?: any;
    mode: string;
    editIndex?: number | null;
}) {

    const dispatch = useDispatch() as any;
    const { inputTypes, loading, inputModel } = useSelector((s: any) => s.masterModule);

    const form = useForm<FieldSchemaType>({
        resolver: zodResolver(fieldSchema),
        mode: "onChange",
        defaultValues: {
            type: "",
            dbColumn: "",
            label: "",
            validation: "",
            tooltip_text: "",
            default_value: "",
            max_file_size: "",
            is_multiple: false,
            cropImage: false,
            currency: "",
            precision: "",
            options: [],
            relationModel: "",
            is_ckeditor: false,
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "options",
    });
    const [status, setStatus] = React.useState(true);

    React.useEffect(() => {
        if (open) {
            if (editData) {
                // Populate visArray from editData.visible (preferred) or legacy flags
                let visArray: number[] = editData.visible || [];

                if (visArray.length === 0) {
                    if (editData.inCreate) visArray.push(1);
                    if (editData.inEdit) visArray.push(2);
                    if (editData.inShow) visArray.push(3);
                    if (editData.inDelete) visArray.push(4);
                }

                form.reset({
                    type: editData.type || "",
                    dbColumn: editData.db_column || "",
                    label: editData.label || "",
                    validation: editData.validation || "",
                    tooltip_text: editData.tooltip_text || "",
                    default_value: editData.default_value || "",
                    max_file_size: editData.max_file_size || "",
                    is_multiple: editData.is_multiple || false,
                    cropImage: editData.cropImage || false,
                    currency: editData.currency || "",
                    precision: editData.precision || "",
                    relationModel: editData.relationModel || "",
                    is_ckeditor: editData.is_ckeditor || false,
                    options: (editData.options || []).map((opt: any) => ({
                        option_value: opt.option_value || "",
                        option_label: opt.option_label || "",
                    })),
                    visibility: visArray,
                });

                setStatus(editData.status ?? true);
            } else {
                form.reset({
                    type: inputTypes?.length ? inputTypes.find((item: any) => item.input_type === "text")?.name || "" : "",
                    dbColumn: "",
                    label: "",
                    validation: "",
                    tooltip_text: "",
                    default_value: "",
                    max_file_size: "",
                    is_multiple: false,
                    cropImage: false,
                    currency: "",
                    precision: "",
                    options: [],
                    relationModel: "",
                    is_ckeditor: false,
                    visibility: [],
                });
                setStatus(false);
            }
        }
    }, [open, editData, inputTypes, form]);

    /* FETCH TYPES */
    React.useEffect(() => {
        if (!inputTypes?.length) {
            dispatch(getColumnTypes());
        }
    }, [dispatch, inputTypes, open]);

    const selectedType = form.watch("type");

    React.useEffect(() => {
        if (
            selectedType === "BelongsTo Relationship" ||
            selectedType === "BelongsToMany Relationship"
        ) {
            dispatch(getAllModels());
        }
    }, [selectedType, dispatch]);

    const onSubmit = (data: FieldSchemaType) => {
        const selectedTypeObj = inputTypes.find((t: any) => t.name === data.type);
        const newField = {
            ...(editData?.column_type_id && mode === "edit" && { id: editData.column_type_id }),
            column_type_id: selectedTypeObj?.id,
            type: data.type,
            db_column: data.dbColumn,
            label: data.label,
            validation: data.validation,
            status: status,
            is_multiple:
                data.type === "BelongsToMany Relationship"
                    ? true
                    : data.is_multiple || false,
            tooltip_text: data.tooltip_text,
            default_value: data.default_value,
            max_file_size: data.max_file_size,
            cropImage: data.cropImage,
            currency: data.currency,
            precision: data.precision,
            relationModel: data.relationModel,
            is_ckeditor: data.is_ckeditor,

            visible: data.visibility || [],

            options: (data.options || []).map((opt: any) => ({
                option_value: opt.option_value,
                option_label: opt.option_label,
            })),
        };

        setFields((prev) => {
            if (editIndex !== null && editIndex !== undefined) {
                const updated = [...prev];
                updated[editIndex] = newField;
                return updated;
            }
            return [...prev, newField];
        });

        console.log("data ->", newField)
        onClose();
    };

    const onError = (errors: any) => {
        console.log("❌ VALIDATION ERRORS 👉", errors);
    };
    const visibilityList = [
        { id: 1, label: "Create form" },
        { id: 2, label: "Edit form" },
        { id: 3, label: "Show page" },
        { id: 4, label: "List page" },
    ];

    return (
        <Dialog open={open} onOpenChange={(val) => !val && onClose()}>
            <DialogContent className="max-w-5xl ">
                <DialogHeader>
                    <DialogTitle>{editData ? "Edit Field" : "Add Field"}</DialogTitle>
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
                                disabled={mode === "edit" && editData}
                            />

                            {/* DATABASE COLUMN */}
                            <FormField
                                control={form.control}
                                name="dbColumn"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Database Column <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="e.g. user_name"
                                                {...field}
                                                onChange={(e) => {
                                                    const val = e.target.value.toLowerCase();
                                                    field.onChange(val);
                                                }}
                                                disabled={mode === "edit" && editData}
                                                className={cn("h-9 w-full disabled:bg-gray-200 disabled:cursor-not-allowed", fieldState.error && "border-red-500 focus-visible:ring-red-500")}
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
                                        <FormLabel>Label <span className="text-red-500">*</span></FormLabel>
                                        <FormControl>
                                            <Input placeholder="Label Name" {...field}
                                                disabled={mode === "edit" && editData}
                                                className={cn("h-9 w-full disabled:bg-gray-200 disabled:cursor-not-allowed", fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
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
                                name="tooltip_text"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Tooltip </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Tooltip Text" {...field}
                                                className={cn("h-9 w-full", fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="flex items-center gap-2 mt-7 ">
                                <Checkbox
                                    id="field-status"
                                    checked={status}
                                    onCheckedChange={(val) => setStatus(!!val)}
                                />
                                <label htmlFor="field-status" className=" text-sm font-medium cursor-pointer">
                                    Active Status
                                </label>
                            </div>
                            {/* STATUS TOGGLE */}

                        </div>
                        {/* VISIBILITY */}
                        <FormField
                            control={form.control}
                            name="visibility"
                            render={({ field }) => {
                                const selectedVis: number[] = field.value || [];

                                const toggle = (id: number) => {
                                    if (selectedVis.includes(id)) {
                                        field.onChange(selectedVis.filter((v) => v !== id));
                                    } else {
                                        field.onChange([...selectedVis, id]);
                                    }
                                };

                                return (
                                    <FormItem>
                                        <FormLabel>Visibility</FormLabel>

                                        <div className="flex gap-6 mt-2 flex-wrap">
                                            {visibilityList.map((item) => (
                                                <div key={item.id} className="flex items-center gap-2">
                                                    <Checkbox
                                                        checked={selectedVis.includes(item.id)}
                                                        onCheckedChange={() => toggle(item.id)}
                                                    />
                                                    <label className="text-sm cursor-pointer">
                                                        {item.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </FormItem>
                                );
                            }}
                        />

                        {/* ====================== CONDITIONAL FIELDS ====================== */}

                        {/* Text / Numeric / Select */}
                        {(selectedType === "Text" || selectedType === "Radio" || selectedType === "Select" || selectedType === "Integer" || selectedType === "Money" || selectedType === "Float") && (
                            <FormField
                                control={form.control}
                                name="default_value"
                                render={({ field, fieldState }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Default value </FormLabel>
                                        <FormControl>
                                            <Input placeholder="Default value"  {...field}
                                                className={cn("h-9 w-full md:w-80", fieldState.error && "border-red-500 focus-visible:ring-red-500")} />
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
                                    checked={form.watch("is_ckeditor")}
                                    onCheckedChange={(val) => form.setValue("is_ckeditor", val as boolean)}
                                />
                                <span>Use CKEditor</span>
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
                                name="default_value"
                                render={({ field }) => (
                                    <FormItem className="space-y-1">
                                        <FormLabel>Default Value *</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <SelectTrigger className="h-9 w-full md:w-80">
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
                                    name={"max_file_size"}
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Max {selectedType === "Photo" ? "photo" : "file"} file size (MB) <span className="text-red-500">*</span></FormLabel>
                                            <FormControl>
                                                <div className="relative flex">
                                                    <Input {...field} placeholder="2" className={cn("h-9 w-full md:w-80", fieldState.error && "border-red-500")} />
                                                    <span className="absolute right-0 top-0 bottom-0 px-3 flex items-center bg-gray-200 rounded-r-md">MB</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center gap-2 mt-8">
                                    <Checkbox
                                        checked={form.watch("is_multiple")}
                                        onCheckedChange={(val) => form.setValue("is_multiple", !!val)}
                                    />
                                    <span>Multiple files</span>
                                </div>
                            </div>
                        )}

                        {/* Date Picker */}
                        {/* {selectedType === "Date Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>Allow past dates</span></div>
                                <div className="flex items-center gap-2"><Checkbox /> <span>Allow future dates</span></div>
                            </div>
                        )} */}

                        {/* Date/Time Picker */}
                        {/* {selectedType === "Date/Time Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>Enable Time</span></div>
                                <div className="flex items-center gap-2"><Checkbox /> <span>24 Hour Format</span></div>
                            </div>
                        )} */}

                        {/* Time Picker */}
                        {/* {selectedType === "Time Picker" && (
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2"><Checkbox /> <span>24 Hour Format</span></div>
                            </div>
                        )} */}

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
                                {editData ? "Update Field" : "Add Field"}
                            </Button>
                        </div>

                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
