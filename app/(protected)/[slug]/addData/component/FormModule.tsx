'use client';

import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardHeading,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { ListChecks } from 'lucide-react';

import { useDispatch, useSelector } from "react-redux";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from 'react-tooltip';
import { Info, X, Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

import { addDataApi, getDetailApi, moduleDetailsApi, putFormApi } from '@/store/thunk/dynamicModule.thunk';
import { FormFilesUpload } from './form-files-upload';
// Dynamic import for CKEditor
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

type Props = {
  mode: "create" | "edit";
  id?: any;
};

function FormModule({ slug, id, mode }: { slug: string; id: string; mode: string }) {
  const dispatch = useDispatch();
  const { moduleList, getModuleDetailTableData, moduleListLoading } = useSelector(
    (state: any) => state.dynamicModule
  );

  const form = useForm<any>({ defaultValues: {} });
  const [loading, setLoading] = useState(false);

  // Visibility IDs: 1 = Create form, 2 = Edit form, 3 = Show page, 4 = Delete action
  const getVisibilityId = (): number => {
    return mode === "create" ? 1 : 2; // 1 for create, 2 for edit
  };

  // Check if a field should be visible based on status and visibility array
  const isFieldVisible = (field: any): boolean => {
    if (field.status === false) return false;
    const visibilityId = getVisibilityId();
    return Array.isArray(field.visibility) && field.visibility.includes(visibilityId);
  };

  // Fetch module structure
  useEffect(() => {
    (dispatch as any)(moduleDetailsApi(slug));
  }, [slug, dispatch]);


  // Fetch data for edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      (dispatch as any)(getDetailApi({ slug, id }));
    }
  }, [mode, id, slug, dispatch]);


  // Set default values
  useEffect(() => {
    if (moduleList?.fields) {
      const defaultValues: any = {};

      moduleList.fields.filter((f: any) => isFieldVisible(f)).forEach((f: any) => {
        let value: any = "";

        if (id && getModuleDetailTableData?.data) {
          const apiValue = getModuleDetailTableData.data[f.name];

          if (["file", "photo"].includes(f.type)) {
            if (Array.isArray(apiValue)) {
              value = apiValue.map((v: any) => typeof v === 'string' ? v : (v.file_path || v.file_name || ""));
            } else if (apiValue && typeof apiValue === 'object') {
              value = apiValue.file_path || apiValue.file_name || "";
            } else {
              value = apiValue ?? "";
            }
          } else if (apiValue && typeof apiValue === "object" && apiValue.selected !== undefined) {
            value = apiValue.selected;
          } else if (f.type === "checkbox") {
            value = apiValue === "1" || apiValue === true;
          } else {
            value = apiValue ?? "";
          }

        } else {
          if (f.type === "checkbox") {
            value = f.is_checked ?? false;
          } else if (f.is_multiple) {
            value = [];
          } else {
            value = f.default_value ?? "";
          }
        }
        defaultValues[f.name] = value;
      });

      form.reset(defaultValues);
    }
  }, [moduleList, getModuleDetailTableData, id, form]);

  const router = useRouter()
  const onSubmit = async (values: any) => {
    const formattedData: any = {};

    moduleList?.fields?.filter((field: any) => isFieldVisible(field)).forEach((field: any) => {
      let value = values[field.name];

      if (value === "" || value === undefined) {
        formattedData[field.name] = null;
        return;
      }

      if (field.type === "checkbox") {
        formattedData[field.name] = Boolean(value);
        return;
      }
      if (["file", "photo"].includes(field.type)) {
        formattedData[field.name] = value;
        return;
      }
      if (field.is_multiple) {
        formattedData[field.name] = value || [];
        return;
      }
      formattedData[field.name] = value;
    });

    console.log("formattedData", formattedData)
    try {
      setLoading(true);
      // Filter out files that haven't changed if in edit mode
      const finalPayload = { ...formattedData };
      if (mode === "edit") {
        moduleList?.fields?.forEach((field: any) => {
          if (["file", "photo"].includes(field.type)) {
            const apiValue = getModuleDetailTableData?.data?.[field.name];
            let initializedValue: any = "";
            if (Array.isArray(apiValue)) {
              initializedValue = apiValue.map((v: any) => typeof v === 'string' ? v : (v.file_path || v.file_name || ""));
            } else if (apiValue && typeof apiValue === 'object') {
              initializedValue = apiValue.file_path || apiValue.file_name || "";
            } else {
              initializedValue = apiValue ?? "";
            }

            if (JSON.stringify(formattedData[field.name]) === JSON.stringify(initializedValue)) {
              delete finalPayload[field.name];
            }
          }
        });
      }

      if (mode === "edit" && id) {
        await (dispatch(putFormApi({ slug, id, data: finalPayload })) as any).unwrap();
        toast.success("Updated " + slug + " successfully");
        router.back()
      } else {
        await (dispatch(addDataApi({ slug, data: formattedData })) as any).unwrap();
        toast.success("Created " + slug + " successfully");
        router.back()
      }

    } catch (err: any) {
      toast.error(err?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };


  const onerror = (errors: any) => {
    console.log("❌ FORM ERRORS 👉", errors);
  };

  // Custom Base64 Upload Adapter Plugin (No direct import to avoid duplication)
  function Base64UploadAdapterPlugin(editor: any) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return {
        upload: () => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              resolve({ default: reader.result as string });
            };
            reader.onerror = (error) => reject(error);
            loader.file.then((file: File) => reader.readAsDataURL(file));
          });
        },
        abort: () => { }
      };
    };
  }

  return (
    <Card>
      <CardHeader className="py-3">
        <CardHeading>
          <CardTitle>{mode === "edit" ? "Edit" : "Add"} Form</CardTitle>
        </CardHeading>
      </CardHeader>

      <CardContent className="p-6">
        {moduleListLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-md" />
              </div>
            ))}
            <div className="col-span-full pt-4">
              <Skeleton className="h-10 w-24 rounded-md" />
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit, onerror)}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[...(moduleList?.fields || [])]
                  .sort((a: any, b: any) => (Number(a.order_number) || 0) - (Number(b.order_number) || 0))
                  .filter((field: any) => isFieldVisible(field))
                  .map((field: any, ind: number) => {

                    const inputType = field.type;
                    const name = field.name;
                    const isRequired = field.validation === "required" || field.validation === "required|string";

                    const renderLabel = () => (
                      <FormLabel className="flex capitalize items-center gap-1.5">
                        {field.label}
                        {isRequired && <span className="text-red-500">*</span>}
                        {field.tooltip_text && (
                          <>
                            <Info
                              className="size-3.5 text-muted-foreground"
                              data-tooltip-id={`tooltip-${name}`}
                              data-tooltip-content={field.tooltip_text}
                            />
                            <Tooltip id={`tooltip-${name}`} />
                          </>
                        )}
                      </FormLabel>
                    );

                    // TEXT fields
                    if (["text", "email", "password", "integer", "float", "money"].includes(inputType)) {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem>
                              {renderLabel()}
                              <FormControl>
                                <Input
                                  placeholder={"Enter Your " + field.label}
                                  type={
                                    inputType === "password" ? "password" :
                                      inputType === "email" ? "email" :
                                        ["integer", "float", "money"].includes(inputType) ? "number" : "text"
                                  }
                                  {...formField}
                                  value={formField.value ?? ""}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }


                    // CKEditor with Image Upload (Base64)
                    // TEXTAREA + CKEditor with Image Upload + Resize Feature
                    if (inputType === "textarea") {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem className="col-span-full">
                              {renderLabel()}
                              <FormControl>
                                {field.is_ckeditor ? (
                                  <div className="bg-white w-full border rounded-md overflow-hidden [&_.ck-editor__editable]:min-h-[300px]">
                                    <CKEditor
                                      editor={ClassicEditor}
                                      data={formField.value ?? ""}
                                      onChange={(_, editor) => {
                                        const data = editor.getData();
                                        formField.onChange(data);
                                      }}
                                      config={{
                                        extraPlugins: [Base64UploadAdapterPlugin],

                                        toolbar: [
                                          "heading", "|",
                                          "bold", "italic", "underline",
                                          "link",
                                          "bulletedList", "numberedList", "|",
                                          "outdent", "indent", "|",
                                          "imageUpload",
                                          "blockQuote",
                                          "insertTable",
                                          "mediaEmbed",
                                          "undo", "redo"
                                        ],

                                        // ✅ Image Configuration for Resizing
                                        image: {
                                          toolbar: [
                                            "imageStyle:inline",
                                            "imageStyle:block",
                                            "imageStyle:side",
                                            "|",
                                            "toggleImageCaption",
                                            "imageTextAlternative",
                                            "|",
                                            "resizeImage:25",     // 25% 
                                            "resizeImage:50",     // 50%
                                            "resizeImage:75",     // 75%
                                            "resizeImage:original", // Original size
                                          ],
                                          resizeOptions: [
                                            {
                                              name: 'resizeImage:original',
                                              value: null,
                                              label: 'Original'
                                            },
                                            {
                                              name: 'resizeImage:25',
                                              value: '25',
                                              label: '25%'
                                            },
                                            {
                                              name: 'resizeImage:50',
                                              value: '50',
                                              label: '50%'
                                            },
                                            {
                                              name: 'resizeImage:75',
                                              value: '75',
                                              label: '75%'
                                            }
                                          ],
                                          // Enable resize handles (drag corners to resize freely)
                                          resizeUnit: '%',           // You can use 'px' or '%'
                                          // allow resizing with mouse drag
                                        },

                                        // Optional: Make images responsive by default
                                        htmlSupport: {
                                          allow: [
                                            {
                                              name: /^(figure|img)$/,
                                              attributes: true,
                                              classes: true,
                                              styles: true
                                            }
                                          ]
                                        }
                                      }}
                                    />
                                  </div>
                                ) : (
                                  <textarea
                                    placeholder={"Enter Your " + field.label}
                                    className="border rounded-md p-2 w-full min-h-[150px]"
                                    {...formField}
                                    value={formField.value ?? ""}
                                  />
                                )}
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }

                    // SELECT
                    // SELECT
                    if (["select", "select-multiple", "BelongsToMany Relationship"].includes(inputType)) {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          render={({ field: formField }) => {
                            const isMultiple = field.is_multiple || inputType === "select-multiple" || inputType === "BelongsToMany Relationship";
                            const fieldValue = formField.value as any;

                            const options = (field.options || []).map((opt: any) => ({
                              value: String(opt.id ?? opt.option_value ?? opt.value ?? ""),
                              label: String(opt.name ?? opt.option_label ?? opt.label ?? opt.option_value ?? ""),
                            }));

                            if (isMultiple) {
                              const selectedValues = Array.isArray(fieldValue)
                                ? fieldValue.map((v: any) =>
                                  typeof v === "object" && v !== null ? String(v.id ?? v.value ?? v.option_value ?? "") : String(v)
                                )
                                : [];

                              return (
                                <FormItem className="">
                                  {renderLabel()}
                                  <Popover>
                                    <PopoverTrigger asChild>
                                      <div className="flex w-full flex-wrap rounded-md border border-input bg-background px-3 py-1.5 text-sm shadow-sm cursor-pointer items-center justify-between gap-2">

                                        {/* LEFT SIDE (Selected items / placeholder) */}
                                        <div className="flex flex-wrap gap-1 flex-1">
                                          {selectedValues.length > 0 ? (
                                            selectedValues.map((val: string) => {
                                              const item = options.find((o: any) => o.value === val);
                                              if (!item) return null;

                                              return (
                                                <span
                                                  key={val}
                                                  className="bg-muted px-2 py-0.5 rounded-sm flex items-center gap-1 text-xs font-medium"
                                                >
                                                  {item.label}
                                                  <X
                                                    size={14}
                                                    className="cursor-pointer hover:text-destructive"
                                                    onClick={(e) => {
                                                      e.stopPropagation();
                                                      const newValues = selectedValues.filter((v: string) => v !== val);
                                                      formField.onChange(newValues);
                                                    }}
                                                  />
                                                </span>
                                              );
                                            })
                                          ) : (
                                            <span className="text-sm text-muted-foreground">
                                              Select {field.label}
                                            </span>
                                          )}
                                        </div>

                                        <ListChecks className="h-4 w-4 opacity-60 shrink-0" />
                                      </div>
                                    </PopoverTrigger>

                                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                                      <Command>
                                        <CommandList>
                                          <CommandGroup>
                                            <ScrollArea className="h-[200px]">
                                              {options.length > 0 ? (
                                                options.map((item: any) => {
                                                  const isSelected = selectedValues.includes(item.value);

                                                  return (
                                                    <CommandItem
                                                      key={item.value}
                                                      onSelect={() => {
                                                        let newValues;
                                                        if (isSelected) {
                                                          newValues = selectedValues.filter((v: string) => v !== item.value);
                                                        } else {
                                                          newValues = [...selectedValues, item.value];
                                                        }
                                                        formField.onChange(newValues);
                                                      }}
                                                      className="cursor-pointer"
                                                    >
                                                      <span className="flex-1">{item.label}</span>
                                                      <Check
                                                        className={cn(
                                                          "h-4 w-4",
                                                          isSelected ? "opacity-100" : "opacity-0"
                                                        )}
                                                      />
                                                    </CommandItem>
                                                  );
                                                })
                                              ) : (
                                                <div className="p-4 text-sm text-center text-muted-foreground">No options available</div>
                                              )}
                                            </ScrollArea>
                                          </CommandGroup>
                                        </CommandList>
                                      </Command>
                                    </PopoverContent>
                                  </Popover>
                                  <FormMessage />
                                </FormItem>
                              );
                            }

                            // SINGLE SELECT
                            const singleValue = typeof fieldValue === "object" && fieldValue !== null
                              ? String(fieldValue.id ?? fieldValue.value ?? fieldValue.option_value ?? "")
                              : String(fieldValue || "");

                            return (
                              <FormItem className="space-y-1">
                                {renderLabel()}
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant="outline"
                                        className={cn(
                                          "font-normal w-full justify-between h-10 px-3 py-2 text-sm shadow-sm ring-offset-background",
                                          !fieldValue && "text-muted-foreground"
                                        )}
                                      >
                                        <span className="truncate">
                                          {singleValue
                                            ? options.find((o) => o.value === singleValue)?.label || `Select ${field.label}`
                                            : `Select ${field.label}`}
                                        </span>
                                        <ChevronDown className="h-4 w-4 opacity-50 shrink-0" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                                    <Command>
                                      <CommandList>
                                        <CommandGroup>
                                          <ScrollArea className="h-[200px]">
                                            {options.length > 0 ? (
                                              options.map((item) => (
                                                <CommandItem
                                                  key={item.value}
                                                  onSelect={() => {
                                                    formField.onChange(item.value);
                                                  }}
                                                  className="cursor-pointer"
                                                >
                                                  {item.label}
                                                  <Check
                                                    className={cn(
                                                      "ml-auto h-4 w-4",
                                                      singleValue === item.value ? "opacity-100" : "opacity-0"
                                                    )}
                                                  />
                                                </CommandItem>
                                              ))
                                            ) : (
                                              <div className="p-4 text-sm text-center text-muted-foreground">No options available</div>
                                            )}
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
                    }

                    // RADIO
                    if (inputType === "radio") {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem>
                              {renderLabel()}
                              <div className="flex gap-4 flex-wrap">
                                {field.options?.map((opt: any, i: number) => (
                                  <label key={i} className="flex items-center gap-2">
                                    <input
                                      type="radio"
                                      value={opt.option_value}
                                      checked={formField.value === opt.option_value}
                                      onChange={() => formField.onChange(opt.option_value)}
                                    />
                                    {opt.option_label}
                                  </label>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }

                    // CHECKBOX
                    if (inputType === "checkbox") {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                              <FormControl>
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                  checked={!!formField.value}
                                  onChange={(e) => formField.onChange(e.target.checked)}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                {renderLabel()}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }

                    // DATE / TIME
                    if (["datetime-local", "date", "time"].includes(inputType)) {
                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem>
                              {renderLabel()}
                              <FormControl>
                                <Input type={inputType} {...formField} value={formField.value ?? ""} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }

                    // FILE / PHOTO (your existing code)
                    if (["file", "photo"].includes(inputType)) {
                      const isMultiple = field.is_multiple;
                      const maxFiles = isMultiple ? 10 : 1;
                      const accept = inputType === "photo" ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar";
                      const NEXT_PUBLIC_BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, '') + "/storage";

                      if (inputType === "file") {
                        return (
                          <FormField
                            key={ind}
                            control={form.control}
                            name={name}
                            rules={{ required: isRequired ? `${field.label} is required` : false }}
                            render={({ field: formField }) => (
                              <FormItem>
                                {renderLabel()}
                                <FormControl>
                                  <div className="flex flex-col gap-2">
                                    <Input
                                      type="file"
                                      accept={accept}
                                      multiple={isMultiple}
                                      onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                          const fileArray = Array.from(files);

                                          // Validation: No images for 'file' type
                                          const hasImage = fileArray.some(f => f.type.startsWith('image/'));
                                          if (hasImage) {
                                            form.setError(name, { type: "manual", message: "Image not upload! Only documents allowed." });
                                            e.target.value = '';
                                            return;
                                          }
                                          form.clearErrors(name);

                                          Promise.all(fileArray.map(f => {
                                            return new Promise((resolve) => {
                                              const reader = new FileReader();
                                              reader.onloadend = () => resolve(reader.result);
                                              reader.readAsDataURL(f);
                                            });
                                          })).then(results => {
                                            formField.onChange(isMultiple ? results : (results[0] || null));
                                          });
                                        }
                                      }}
                                    />
                                  </div>
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        );
                      }


                      const apiValue = getModuleDetailTableData?.data?.[name];
                      let initialFiles: any[] = [];

                      if (mode === "edit" && apiValue) {
                        const filesArray = Array.isArray(apiValue)
                          ? apiValue
                          : typeof apiValue === 'string' ? [apiValue] : [];
                        initialFiles = filesArray
                          .map((val: any, i: number) => {
                            if (typeof val === 'string') {
                              return {
                                id: `${name}_${i}`,
                                name: val.split('/').pop() || name,
                                size: 0,
                                type: val.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                                url: val.startsWith('http') ? val : `${NEXT_PUBLIC_BACKEND_URL}/${val}`,
                                originalPath: val,
                              };
                            }
                            return {
                              id: val.id ? String(val.id) : `${name}_${i}`,
                              name: val.file_name || val.file_path?.split('/').pop() || name,
                              size: val.file_size || 0,
                              type: val.mime_type || (val.file_path?.toLowerCase().endsWith('.pdf') ? 'application/pdf' : 'image/jpeg'),
                              url: val.file_url || (val.file_path ? (val.file_path.startsWith('http') ? val.file_path : `${NEXT_PUBLIC_BACKEND_URL}/${val.file_path}`) : ""),
                              originalPath: val.file_path || val.file_url,
                            };
                          })

                          .filter((f: any) => f.url && !f.url.includes('undefined') && !f.url.includes('null'));

                      }

                      return (
                        <FormField
                          key={ind}
                          control={form.control}
                          name={name}
                          rules={{ required: isRequired ? `${field.label} is required` : false }}
                          render={({ field: formField }) => (
                            <FormItem>
                              {renderLabel()}
                              <FormControl>
                                <FormFilesUpload
                                  showCard={false}
                                  maxFiles={maxFiles}
                                  multiple={isMultiple}
                                  accept={accept}
                                  initialFiles={initialFiles}
                                  onFilesChange={async (files) => {
                                    const results = await Promise.all(
                                      files.map(async (f) => {
                                        if (f.file && !(f.file instanceof File)) {
                                          // Existing file - try to get the original relative path
                                          const originalPath = (f.file as any).originalPath;
                                          if (originalPath) return originalPath;

                                          const url = f.preview || (f.file as any).url || "";
                                          // Fallback path extraction logic

                                          if (url.startsWith('http')) {
                                            const backendUrl = NEXT_PUBLIC_BACKEND_URL.replace(/\/$/, '');
                                            let path = url.replace(backendUrl, '');
                                            // Handle /storage/ prefix common in Laravel
                                            path = path.replace(/^\/?storage\//, '');
                                            // Handle leading slash
                                            path = path.replace(/^\//, '');
                                            return path;
                                          }
                                          return url;
                                        }

                                        if (f.preview && f.preview.startsWith('data:')) {
                                          return f.preview;
                                        }
                                        if (f.file instanceof File) {
                                          return new Promise((resolve) => {
                                            const reader = new FileReader();
                                            reader.onloadend = () => resolve(reader.result);
                                            reader.readAsDataURL(f.file as File);
                                          });
                                        }
                                        return null;
                                      })
                                    );
                                    const filteredResults = results.filter(r => r !== null);
                                    formField.onChange(isMultiple ? filteredResults : (filteredResults[0] || null));
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      );
                    }


                    return null;
                  })}
              </div>

              <div className="mt-8">
                <Button type="submit" disabled={loading} className="min-w-[120px]">
                  {loading ? "Saving..." : mode === "edit" ? "Update" : "Submit"}
                </Button>
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

export default FormModule;

