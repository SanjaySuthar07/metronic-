"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from "@/components/ui/card";
import { Globe, Share2, MapPin, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import {
  fetchGeneralSettings,
  updateGeneralSettings,
} from "@/store/thunk/settings.thunk";
import { useEffect, useState } from "react";
import { FilesUpload } from "../../settings/components";
/* ================= CONFIG ================= */
export const siteSettingConfig = [
  {
    title: "General Settings",
    icon: Globe,
    fields: [
      { label: "Site Name", name: "site_name", type: "text" },
      { label: "Site Description", name: "site_description", type: "text" },
      { label: "Site Logo", name: "logo", type: "file" },
      { label: "Site Favicon", name: "favicon_icon", type: "file" },
      { label: "Site Email", name: "site_email", type: "email" },
      { label: "Site Phone", name: "site_phone", type: "text" },
      { label: "Primary Color", name: "primary_color", type: "color" },
      { label: "Secondary Color", name: "secondary_color", type: "color" },
    ],
  },
  {
    title: "Social Media",
    icon: Share2,
    fields: [
      { label: "Facebook", name: "facebook", type: "text" },
      { label: "Instagram", name: "instagram", type: "text" },
      { label: "Twitter", name: "twitter", type: "text" },
      { label: "LinkedIn", name: "linkedin", type: "text" },
      { label: "YouTube", name: "youtube", type: "text" },
    ],
  },
  {
    title: "Contact Info",
    icon: MapPin,
    fields: [
      { label: "Address", name: "address", type: "text" },
      { label: "Google Map Link", name: "google_map_link", type: "text" },
      { label: "Support Email", name: "support_email", type: "email" },
      { label: "Support Phone", name: "support_phone", type: "text" },
    ],
  },
  {
    title: "SEO Settings",
    icon: BarChart3,
    fields: [
      { label: "Meta Title", name: "meta_title", type: "text" },
      { label: "Meta Description", name: "meta_description", type: "text" },
      { label: "Meta Keywords", name: "meta_keywords", type: "text" },
    ],
  },
];

/* ================= COMPONENT ================= */
export default function GeneralSetting() {
  const dispatch = useDispatch<AppDispatch>();
  const { generalSetting } = useSelector((state: RootState) => state.setting);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ===== FLATTEN ALL FIELDS ===== */
  const allFields = siteSettingConfig.flatMap((s) => s.fields);

  const form = useForm({
    defaultValues: Object.fromEntries(allFields.map((f) => [f.name, ""])),
  });

  /* ===== FETCH ===== */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchGeneralSettings());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  /* ===== SET DEFAULT VALUES FROM API ===== */
  function normalizeHexColor(color: string) {
    if (!color) return "#000000";

    // #RRGGBB valid
    if (/^#([0-9A-Fa-f]{6})$/.test(color)) {
      return color;
    }

    // #RGB → #RRGGBB
    if (/^#([0-9A-Fa-f]{3})$/.test(color)) {
      return (
        "#" +
        color
          .substring(1)
          .split("")
          .map((c) => c + c)
          .join("")
      );
    }

    // #RGBA → convert first 3 digits
    if (/^#([0-9A-Fa-f]{4})$/.test(color)) {
      return (
        "#" +
        color
          .substring(1, 4)
          .split("")
          .map((c) => c + c)
          .join("")
      );
    }

    // fallback
    return "#000000";
  }
  useEffect(() => {
    if (!generalSetting) return;

    const apiData =
      generalSetting?.data?.data || generalSetting?.data || generalSetting;

    if (!apiData) return;

    const formatted: any = {};

    Object.keys(apiData).forEach((sectionKey) => {
      const section = apiData[sectionKey];

      if (!section) return;

      Object.keys(section).forEach((fieldKey) => {
        let value = section[fieldKey]?.value ?? "";

        /* 🎨 Fix color */

        if (fieldKey === "primary_color" || fieldKey === "secondary_color") {
          const fixed = normalizeHexColor(value);


          value = fixed;
        }

        formatted[fieldKey] = value;
      });
    });


    form.reset(formatted);
  }, [generalSetting]);
  /* ===== SUBMIT ===== */
  async function onSubmit(values: any) {
    try {
      const apiData = generalSetting?.data || generalSetting;
      const settingsPayload: any = {};

      // Loop all sections
      Object.keys(apiData).forEach((sectionKey) => {
        const section = apiData[sectionKey];
        if (!section) return;
        // Loop all fields inside section
        Object.keys(section).forEach((fieldKey) => {
          const field = section[fieldKey];
          let value = values[fieldKey];

          /* Handle File */
          if (field?.type === "file") {
            if (value && typeof value !== "string" && value instanceof File) {
              // Convert File to base64
              value = value;
            } else if (typeof value === "string" && value.startsWith("data:")) {
              // Already base64
              // do nothing
            } else {
              // keep old file if not changed
              value = field?.value;
            }
          }

          /* Handle Toggle */
          if (field?.type === "toggle") {
            value = value ? 1 : 0;
          }

          settingsPayload[fieldKey] = {
            value: value ?? "",
            type: field?.type || "text",
          };
        });
      });

      // Convert any File objects in settingsPayload to base64
      const fileFieldKeys = Object.keys(settingsPayload).filter(
        (key) =>
          settingsPayload[key].type === "file" &&
          settingsPayload[key].value instanceof File,
      );
      for (const key of fileFieldKeys) {
        const file = settingsPayload[key].value;
        settingsPayload[key].value = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      }

      const payload = {
        settings: settingsPayload,
      };

      const res = await dispatch(updateGeneralSettings(payload));
      if (updateGeneralSettings.fulfilled.match(res)) {
        toast.success("Settings updated");
        dispatch(fetchGeneralSettings());
        // Reset file fields after successful update
        const resetValues = { ...values };
        fileFieldKeys.forEach((key) => {
          resetValues[key] = "";
        });
        form.reset(resetValues);
      } else {
        toast.error("Error updating settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_API_URL
    ? process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/?$/, "")
    : "";

  /* ================= UI ================= */
  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>Manage your website configuration</CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* ===== LOADING ===== */}
            {loading ? (
              <>
                {siteSettingConfig.map((section, sectionIndex) => (
                  <div key={sectionIndex} className="mb-10">
                    {/* 🔥 Section Header Skeleton */}
                    <div className="flex items-center gap-3 mb-4 p-2 bg-muted rounded-lg">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>

                    {/* 🔥 Fields Skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((_, i) => (
                        <div key={i} className="space-y-2">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <>
                {/* ===== SECTIONS ===== */}
                {siteSettingConfig.map((section) => (
                  <div key={section.title} className="mb-10">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-muted rounded-lg">
                      <section.icon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">{section.title}</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {section.fields.map((field) => (
                        <FormField
                          key={field.name}
                          control={form.control}
                          name={field.name}
                          render={({ field: inputField }) => (
                            <FormItem>
                              <FormLabel>{field.label}</FormLabel>

                              <FormControl>
                                {field.type === "color" ? (
                                  <div className="flex items-center ">
                                    {/* Preview */}
                                    {/* <div
                                      className="w-10 h-10 rounded border"
                                      style={{
                                        backgroundColor: inputField.value || "#000000",
                                      }}
                                    /> */}

                                    {/* Color Picker */}
                                    <Input
                                      type="color"
                                      value={normalizeHexColor(
                                        inputField.value,
                                      )}
                                      onChange={(e) =>
                                        inputField.onChange(e.target.value)
                                      }
                                      className="w-16 h-10 p-1 cursor-pointer rounded-none rounded-l-md"
                                    />

                                    {/* HEX Input */}
                                    <Input
                                      type="text"
                                      value={inputField.value || ""}
                                      onChange={(e) =>
                                        inputField.onChange(e.target.value)
                                      }
                                      placeholder="#000000"
                                      className=" h-10 p-1 rounded-none  rounded-r-md"
                                    />
                                  </div>
                                ) : field.type === "file" ? (
                                  <FilesUpload
                                    showCard={false}
                                    maxFiles={1}
                                    initialFiles={
                                      inputField.value
                                        ? [
                                            {
                                              id: field.name,
                                              name: field.name,
                                              size: 0,
                                              type: "image/png",
                                              url: inputField.value.startsWith(
                                                "data:",
                                              )
                                                ? inputField.value
                                                : `${NEXT_PUBLIC_BACKEND_URL}/${inputField.value}`,
                                            },
                                          ]
                                        : []
                                    }
                                    onFilesChange={async (files) => {
                                      if (files.length > 0) {
                                        const f = files[0];
                                        let finalValue = "";
                                        if (f.preview?.startsWith("data:")) {
                                          finalValue = f.preview;
                                        } else if (f.file instanceof File) {
                                          finalValue = await new Promise(
                                            (resolve) => {
                                              const reader = new FileReader();
                                              reader.onloadend = () =>
                                                resolve(
                                                  reader.result as string,
                                                );
                                              reader.readAsDataURL(
                                                f.file as File,
                                              );
                                            },
                                          );
                                        } else if (f.preview) {
                                         
                                          const url = f.preview;
                                          const cleanBase =
                                            NEXT_PUBLIC_BACKEND_URL.endsWith(
                                              "/",
                                            )
                                              ? NEXT_PUBLIC_BACKEND_URL.slice(
                                                  0,
                                                  -1,
                                                )
                                              : NEXT_PUBLIC_BACKEND_URL;
                                          finalValue = url
                                            .replace(cleanBase, "")
                                            .replace(/^\//, "");
                                        }
                                        inputField.onChange(finalValue);
                                      } else {
                                        inputField.onChange(); // reset to existing value if no files
                                      }
                                    }}
                                  />
                                ) : (
                                  <Input
                                    type={field.type}
                                    value={inputField.value || ""}
                                    onChange={(e) =>
                                      inputField.onChange(e.target.value)
                                    }
                                  />
                                )}
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* ===== SUBMIT ===== */}
            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={submitting}>
                {submitting && (
                  <LoaderCircleIcon className="animate-spin mr-2" />
                )}
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
