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

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { useDispatch, useSelector } from "react-redux";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip } from 'react-tooltip';
import { Info } from 'lucide-react';

import { addDataApi, getDetailApi, moduleDetailsApi, putFormApi } from '@/store/thunk/dynamicModule.thunk';
import { FilesUpload } from '@/app/(protected)/settings-plain/components/files-upload';

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

  const form = useForm({ defaultValues: {} });
  const [loading, setLoading] = useState(false);

  // Fetch module structure
  useEffect(() => {
    dispatch(moduleDetailsApi(slug));
  }, [slug, dispatch]);

  // Fetch data for edit mode
  useEffect(() => {
    if (mode === "edit" && id) {
      dispatch(getDetailApi({ slug, id }));
    }
  }, [mode, id, slug, dispatch]);

  // Set default values
  useEffect(() => {
    if (moduleList?.fields) {
      const defaultValues: any = {};

      moduleList.fields.forEach((f: any) => {
        let value: any = "";

        if (id && getModuleDetailTableData?.data) {
          const apiValue = getModuleDetailTableData.data[f.name];

          if (apiValue && typeof apiValue === "object" && apiValue.selected !== undefined) {
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

  const onSubmit = async (values: any) => {
    const formattedData: any = {};

    moduleList?.fields?.forEach((field: any) => {
      if (field.status === false) return;
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

    try {
      setLoading(true);
      if (mode === "edit" && id) {
        await (dispatch(putFormApi({ slug, id, data: formattedData })) as any).unwrap();
        toast.success("Updated " + slug + " successfully");
      } else {
        await dispatch(addDataApi({ slug, data: formattedData })).unwrap();
        toast.success("Created " + slug + " successfully");
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
                  .map((field: any, ind: number) => {
                    if (field.status === false) return null;

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
                    if (["select", "select-multiple", "BelongsToMany Relationship"].includes(inputType)) {
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
                                <select className="border p-2 w-full rounded-md" {...formField} value={formField.value ?? ""}>
                                  <option value="">Select {field.label}</option>
                                  {field.options?.map((opt: any, i: number) => (
                                    <option key={i} value={opt.option_value}>
                                      {opt.option_label}
                                    </option>
                                  ))}
                                </select>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
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
                      const accept = inputType === "photo" ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,image/*";
                      const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "";

                      const apiValue = getModuleDetailTableData?.data?.[name];
                      let initialFiles: any[] = [];

                      if (mode === "edit" && apiValue) {
                        const filesArray = Array.isArray(apiValue)
                          ? apiValue
                          : typeof apiValue === 'string' ? [apiValue] : [];
                        initialFiles = filesArray
                          .map((val: string, i: number) => ({
                            id: `${name}_${i}`,
                            name: val.split('/').pop() || name,
                            size: 0,
                            type: val.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                            url: `${NEXT_PUBLIC_BACKEND_URL}/${val}`,
                          }))
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
                                <FilesUpload
                                  showCard={false}
                                  maxFiles={maxFiles}
                                  multiple={isMultiple}
                                  accept={accept}
                                  initialFiles={initialFiles}
                                  onFilesChange={async (files) => {
                                    const results = await Promise.all(
                                      files.map(async (f) => {
                                        if (f.file && !(f.file instanceof File)) {
                                          const url = (f.file as any).url;
                                          if (url) return url.replace(`${NEXT_PUBLIC_BACKEND_URL}/`, '');
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

// today update
// 1. all dynamic table and dynamic form add skaltone
// 2. in dynamic modue  img and file uplaod and other issue solve
// 3. implemet  ckeditor(bold , img ,heading  order table ) this type functionality add
// 4. add dynamic module validation 