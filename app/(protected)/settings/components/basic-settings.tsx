'use client';

import React, { useEffect } from 'react';
import { AvatarInput } from '../../../components/partials/common/avatar-input';
import { format } from 'date-fns';
import { CalendarDays, CalendarIcon, Clock3, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DateInput, TimeField } from '@/components/ui/datefield';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm, useFieldArray } from "react-hook-form";
import { Form, FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form";

import { useDispatch, useSelector } from "react-redux";
import { fetchSettings, updateSettings } from "@/store/thunk/setting.thunk";

import { FilesUpload } from './files-upload';

interface IGeneralSettingsProps {
  title: string;
}

const schema = z.object({
  settings: z.array(
    z.object({
      origId: z.number(),
      key: z.string(),
      value: z.string().min(1, "Value required"),
    })
  ),
});

const BasicSettings = ({ title }: IGeneralSettingsProps) => {
  const dispatch = useDispatch<any>();
  const { setting, loading } = useSelector((s: any) => s.settings);
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      settings: []
    }
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: "settings",
  });

  // fetch
  useEffect(() => {
    dispatch(fetchSettings());
  }, []);

  // set data
  useEffect(() => {
    if (setting?.length) {
      form.reset({
        settings: setting.map((item: any) => ({
          origId: item.id,
          key: item.key,
          value: item.value || ""
        }))
      });
    }
  }, [setting]);

  // helper (IMPORTANT 🔥)
  const getFieldValue = (key: string) => {
    const index = form.getValues("settings").findIndex((f: any) => f.key === key);
    return index !== -1 ? form.getValues(`settings.${index}.value`) : "";
  };

  const setFieldValue = (key: string, value: string) => {
    const settings = form.getValues("settings");
    const index = settings.findIndex((f: any) => f.key === key);

    if (index !== -1) {
      form.setValue(`settings.${index}.value`, value);
    } else {
      form.setValue("settings", [
        ...settings,
        {
          origId: Date.now(),
          key,
          value,
        },
      ]);
    }
  };

  // submit
  const onSubmit = async (data: any) => {
    const payload = {
      settings: data.settings.map((item: any) => ({
        id: item.origId,
        key: item.key,
        value: item.value,
      })),
    };
    console.log("Submitting payload:", payload);

    try {
      const result = await dispatch(updateSettings(payload)).unwrap();
      toast.success(result.message || "Settings updated successfully");
      dispatch(fetchSettings());
    } catch (error: any) {
      toast.error(error || "Failed to update settings");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="pb-2.5">
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">

            {form.watch("settings")?.map((item: any, index: number) => {
              const isFileField = item.key === 'logo' || item.key === 'favicon_icon' || item.key === 'default_logo_dark' || item.key === 'mini_logo_dark' || item.key === "mini_logo";
              const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "") : "");

              const val = String(item.value || "");
              const initialFiles = val ? [
                {
                  id: item.key,
                  name: item.key,
                  size: 0,
                  type: "image/png",
                  url: (() => {
                    if (val.startsWith("data:") || val.startsWith("http") || val.startsWith("blob:")) {
                      return val;
                    }
                    const baseUrl = NEXT_PUBLIC_BACKEND_URL || "";
                    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
                    const cleanPath = val.startsWith("/") ? val.substring(1) : val;
                    return `${cleanBase}/${cleanPath}`;
                  })(),
                }
              ] : [];

              return (
                <FormItem key={item.key} className={cn("space-y-1", isFileField && "md:col-span-1")}>
                  <Label className="font-medium text-gray-800">
                    {item.key
                      .replaceAll("_", " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </Label>
                  <FormControl>
                    <div className="w-full">
                      {isFileField ? (
                        <FilesUpload
                          showCard={false}
                          maxFiles={1}
                          initialFiles={initialFiles}
                          onFilesChange={async (files) => {
                            if (files.length > 0) {
                              const f = files[0];
                              let finalValue = "";

                              // 1. Handle Base64 previews (already converted by cropper or already in state)
                              if (f.preview?.startsWith("data:")) {
                                finalValue = f.preview;
                              }
                              // 2. Handle new Files (e.g. SVGs that skipped cropping)
                              else if (f.file instanceof File) {
                                finalValue = await new Promise((resolve) => {
                                  const reader = new FileReader();
                                  reader.onloadend = () => resolve(reader.result as string);
                                  reader.readAsDataURL(f.file as File);
                                });
                              }
                              // 3. Handle existing files (extract relative path)
                              else if (f.preview) {
                                const url = f.preview;
                                // Extract relative path by removing the backend base URL
                                const baseUrl = NEXT_PUBLIC_BACKEND_URL || "";
                                const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
                                finalValue = url.replace(cleanBase, "").replace(/^\//, "");
                              }

                              form.setValue(`settings.${index}.value`, finalValue);
                            } else {
                              form.setValue(`settings.${index}.value`, "");
                            }
                          }}
                        />
                      ) : (
                        <Input
                          className="h-9"
                          value={form.watch(`settings.${index}.value`) || ""}
                          onChange={(e) =>
                            form.setValue(`settings.${index}.value`, e.target.value)
                          }
                        />
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            })}


          </CardContent>
          <div className="flex justify-end p-6 pt-0">
            <Button type="submit" disabled={loading} className="min-w-[120px]">
              {loading && <Loader2 className="animate-spin size-4 mr-2" />}
              Update
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  );
};

export { BasicSettings, type IGeneralSettingsProps };