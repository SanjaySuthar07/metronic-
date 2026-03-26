'use client';

import { useForm } from 'react-hook-form';
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

import { menuSchema, MenuSchemaType } from "../forms/menuSchema.ts";
import { addDataApi, getDetailApi, moduleDetailsApi } from '@/store/thunk/dynamicModule.thunk';

function FormModule({ slug, id }: { slug: string, id: string }) {
  const dispatch = useDispatch();
  const { moduleList, getModuleDetailTableData } = useSelector((state: any) => state.dynamicModule);

  useEffect(() => {
    if (id) {
      dispatch(getDetailApi({ slug, id }));
    }
  }, [id]);

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

        if (id && getModuleDetailTableData) {
          const apiValue = getModuleDetailTableData[f.name];

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

  // 🔥 FILE HANDLER (MULTIPLE + SIZE VALIDATION)
  const handleFileChange = (e: any, field: any, config: any) => {
    const files = Array.from(e.target.files || []);

    let totalSize = 0;

    files.forEach((file: any) => {
      totalSize += file.size;
    });

    const totalMB = totalSize / (1024 * 1024);

    if (config.max_file_size && totalMB > config.max_file_size) {
      toast.error(`Max allowed ${config.max_file_size} MB only, you selected ${totalMB.toFixed(2)} MB`);
      return;
    }

    field.onChange(config.is_multiple ? files : files[0]);
  };

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

      if (id) {
        // 🔥 UPDATE
        res = await dispatch(
          putFormApi({
            slug,
            id,
            data: formattedData,
          })
        ).unwrap();

        toast.success("Updated Successfully");

      } else {
        // 🔥 CREATE
        res = await dispatch(
          addDataApi({
            slug,
            data: formattedData,
          })
        ).unwrap();

        toast.success("Created Successfully");
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

  return (
    <Card>
      <CardHeader className="py-3">
        <CardHeading>
          <CardTitle>Dynamic Form</CardTitle>
        </CardHeading>
      </CardHeader>

      <CardContent className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit, onerror)}>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {moduleList?.fields?.map((field: any, ind: number) => {

                // ❌ STATUS FALSE → HIDE
                if (field.status === false) return null;

                const inputType = field.type;
                const name = field.name;

                // 🔥 COMMON LABEL WITH TOOLTIP
                const Label = () => (
                  <FormLabel>
                    {field.label}
                    {field.tooltip_text && (
                      <span className="ml-2 text-gray-400 text-xs">
                        ({field.tooltip_text})
                      </span>
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
                          <Label />
                          <FormControl>
                            <Input
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
                          <Label />
                          <FormControl>
                            <textarea
                              className="border rounded-md p-2 w-full"
                              {...formField}
                              value={formField.value ?? ""}
                            />
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
                          <Label />
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
                          <Label />
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
                        <FormItem>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={!!formField.value}
                              onChange={(e) =>
                                formField.onChange(e.target.checked)
                              }
                            />
                            {field.label}
                          </label>
                        </FormItem>
                      )}
                    />
                  );
                }

                // DATE / TIME
                if (["date picker", "date/time picker", "time picker"].includes(inputType)) {
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <Label />
                          <FormControl>
                            <Input
                              type={
                                inputType === "time picker"
                                  ? "time"
                                  : inputType === "date/time picker"
                                    ? "datetime-local"
                                    : "date"
                              }
                              {...formField}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  );
                }



                // FILE / IMAGE
                if (["file", "photo"].includes(inputType)) {
                  return (
                    <FormField
                      key={ind}
                      control={form.control}
                      name={name}
                      render={({ field: formField }) => (
                        <FormItem>
                          <Label />
                          <FormControl>
                            <Input
                              type="file"
                              multiple={field.is_multiple}
                              accept={inputType === "photo" ? "image/*" : "*"}
                              onChange={(e) =>
                                handleFileChange(e, formField, field)
                              }
                            />
                          </FormControl>
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
      </CardContent>
    </Card>
  );
}

export default FormModule;