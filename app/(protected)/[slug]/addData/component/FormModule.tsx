'use client';

import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { zodResolver } from '@hookform/resolvers/zod';
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

// import { menuSchema, MenuSchemaType } from "../forms/menuSchema.ts";
import { addDataApi, getDetailApi, moduleDetailsApi, putFormApi } from '@/store/thunk/dynamicModule.thunk';
import { FilesUpload } from '@/app/(protected)/settings-plain/components/files-upload';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

type Props = {
  mode: "create" | "edit";
  id?: any;
};

function FormModule({ slug, id, mode }: { slug: string, id: string, mode: string }) {
  const dispatch = useDispatch();
  const { moduleList, getModuleDetailTableData, moduleListLoading } = useSelector((state: any) => state.dynamicModule);

  console.log("this is getModuleDetailTableData", moduleList, getModuleDetailTableData)

  useEffect(() => {
    if (mode === "edit" && id) {
      dispatch(getDetailApi({ slug, id }));
    }
  }, [mode, id, slug]);

  // 🔥 FETCH MODULE
  useEffect(() => {
    dispatch(moduleDetailsApi(slug));
  }, [slug]);

  // 🔥 DEFAULT VALUES HANDLE
  useEffect(() => {
    if (moduleList?.fields) {
      const defaultValues: any = {};

      moduleList.fields.forEach((f: any) => {
        let value: any = "";

        if (id && getModuleDetailTableData?.data) {
          const apiValue = getModuleDetailTableData.data[f.name];

          // ✅ OBJECT (radio/select)
          if (
            apiValue &&
            typeof apiValue === "object" &&
            apiValue.selected !== undefined
          ) {
            value = apiValue.selected;
          }

          // ✅ CHECKBOX (string "1" → true)
          else if (f.type === "checkbox") {
            value = apiValue === "1" || apiValue === true;
          }

          // ✅ NORMAL
          else {
            value = apiValue ?? "";
          }
        } else {
          // CREATE MODE
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
  }, [moduleList, getModuleDetailTableData, id]);


  const form = useForm({
    defaultValues: {},
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (values: any) => {
    const formattedData: any = {};

    moduleList?.fields?.forEach((field: any) => {
      let value = values[field.name];

      if (field.status === false) return;

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

      let res;

      if (mode === "edit" && id) {
        // 🔥 UPDATE
        console.log("this is formattedData", slug, id, formattedData)
        res = await (dispatch(
          putFormApi({
            slug,
            id,
            data: formattedData,
          })
        ) as any).unwrap();

        toast.success("Updated " + slug + " successfully");
      } else {
        // 🔥 CREATE
        res = await dispatch(
          addDataApi({
            slug,
            data: formattedData,
          })
        ).unwrap();

        toast.success("Created " + slug + " successfully");
      }
    } catch (err: any) {
      toast.error(err?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  const onerror = (errors: any) => {
    console.log("❌ FORM ERRORS 👉", errors);
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline"],
      ["link", "image"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["clean"]
    ]
  };

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

                {moduleList?.fields?.map((field: any, ind: number) => {

                  // ❌ STATUS FALSE → HIDE
                  if (field.status === false) return null;

                  const inputType = field.type;
                  const name = field.name;

                  // Label Helper
                  const renderLabel = () => (
                    <FormLabel className="flex items-center gap-1.5">
                      {field.label}
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


                  // TEXT
                  if (["text", "email", "password", "integer", "float", "money"].includes(inputType)) {
                    return (
                      <FormField
                        key={ind}
                        control={form.control}
                        name={name}

                        render={({ field: formField }) => (
                          <FormItem>
                            {renderLabel()}
                            <FormControl>
                              <Input
                                placeholder={"Enter Your " + field.label}
                                type={
                                  inputType === "password"
                                    ? "password"
                                    : inputType === "email"
                                      ? "email"
                                      : inputType === "integer" || inputType === "float" || inputType === "money"
                                        ? "number"
                                        : "text"
                                }
                                {...formField}
                                value={formField.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  }

                  // TEXTAREA
                  if (inputType === "textarea") {
                    return (
                      <FormField
                        key={ind}
                        control={form.control}
                        name={name}

                        render={({ field: formField }) => (
                          <FormItem>
                            {renderLabel()}
                            <FormControl>

                              {field.is_ckeditor ? (
                                <ReactQuill
                                  theme="snow"
                                  value={formField?.value ?? ""}
                                  onChange={formField?.onChange}
                                  className="bg-white w-120 min-h-[150px]"
                                  modules={modules}
                                />
                              ) : (
                                <textarea
                                  placeholder={"Enter Your " + field.label}
                                  className="border rounded-md p-2 w-full"
                                  {...formField}
                                  value={formField.value ?? ""}
                                />
                              )}
                            </FormControl>
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
                        render={({ field: formField }) => (
                          <FormItem>
                            {renderLabel()}
                            <FormControl>
                              <select className="border p-2 w-full" {...formField} value={formField.value ?? ""}>
                                <option value="">Select {field.label}</option>
                                {field.options?.map((opt: any, i: number) => (
                                  <option key={i} value={opt.option_value}>
                                    {opt.option_label}
                                  </option>
                                ))}
                              </select>
                            </FormControl>
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
                        render={({ field: formField }) => (
                          <FormItem>
                            {renderLabel()}
                            <div className="flex gap-4">
                              {field.options?.map((opt: any, i: number) => (
                                <label key={i} className="flex gap-2">
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
                        render={({ field: formField }) => (
                          <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                            <FormControl>
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                checked={!!formField.value}
                                onChange={(e) =>
                                  formField.onChange(e.target.checked)
                                }
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              {renderLabel()}
                            </div>
                          </FormItem>
                        )}
                      />
                    );
                  }

                  // DATE / TIME
                  if (["datetime-local", "date", "time",].includes(inputType)) {
                    return (
                      <FormField
                        key={ind}
                        control={form.control}
                        name={name}
                        render={({ field: formField }) => (
                          <FormItem>
                            {renderLabel()}
                            <FormControl>
                              <Input
                                type={inputType}
                                {...formField}
                                value={formField.value ?? ""}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    );
                  }

                  // FILE / IMAGE
                  if (["file", "photo"].includes(inputType)) {
                    const isMultiple = field.is_multiple;
                    const maxFiles = isMultiple ? 10 : 1;
                    const accept = inputType === "photo" ? "image/*" : ".pdf,.doc,.docx,.xls,.xlsx,.zip,.rar,image/*";
                    const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

                    // Compute initial files for edit mode
                    const apiValue = getModuleDetailTableData?.data?.[name];
                    let initialFiles: any[] = [];
                    if (mode === "edit" && apiValue) {
                      const filesArray = Array.isArray(apiValue) ? apiValue : (typeof apiValue === 'string' ? [apiValue] : []);
                      initialFiles = filesArray.map((val: string, i: number) => ({
                        id: `${name}_${i}`,
                        name: val.split('/').pop() || name,
                        size: 0,
                        type: val.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
                        url: `${NEXT_PUBLIC_BACKEND_URL}/${val}`,
                      })).filter((f: any) => f.url && !f.url.includes('undefined') && !f.url.includes('null'));
                    }

                    return (
                      <FormField
                        key={ind}
                        control={form.control}
                        name={name}
                        render={({ field: formField }) => (
                          <FormItem >
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
                                      // If it's an existing file from server, return the relative path (it's already in initialFiles)
                                      if (f.file && !(f.file instanceof File)) {
                                        const url = (f.file as any).url;
                                        if (url) {
                                          return url.replace(`${NEXT_PUBLIC_BACKEND_URL}/`, '');
                                        }
                                      }

                                      // If it's a base64 string (from cropper), return it
                                      if (f.preview && f.preview.startsWith('data:')) {
                                        return f.preview;
                                      }

                                      // If it's a new file, convert to base64
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

              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : id ? "Update" : "Submit"}
              </Button>

            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

export default FormModule;


// "visibility": [
//                     1,
//                     3,
//                     4
//                 ],