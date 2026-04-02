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
import {
  Globe,
  Share2,
  MapPin,
  BarChart3,
} from "lucide-react";
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

/* ================= CONFIG ================= */
export const siteSettingConfig = [
  {
    title: "General Settings",
    icon: Globe,
    fields: [
      { label: "Site Name", name: "site_name", type: "text" },
      { label: "Site Description", name: "site_description", type: "text" },
      { label: "Site Logo", name: "site_logo", type: "file" },
      { label: "Site Favicon", name: "site_favicon", type: "file" },
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
  useEffect(() => {
    if (Array.isArray(generalSetting)) {
      const formatted = Object.fromEntries(
        allFields.map((field) => {
          const item = generalSetting.find(
            (s: any) => s.key === field.name
          );
          return [field.name, item?.value || ""];
        })
      );
      form.reset(formatted);
    }
  }, [generalSetting]);

  /* ===== SUBMIT ===== */
  async function onSubmit(values: any) {
    try {
      setSubmitting(true);

      const payload = {
        settings: allFields.map((field) => {
          const existing = generalSetting?.find(
            (s: any) => s.key === field.name
          );

          return {
            id: existing?.id,
            key: field.name,
            value:
              field.type === "file"
                ? values[field.name] // handle file separately if needed
                : String(values[field.name] || ""),
          };
        }),
      };

      console.log("payload", payload);

      const res = await dispatch(updateGeneralSettings(payload));

      if (updateGeneralSettings.fulfilled.match(res)) {
        toast.success("Settings updated");
        dispatch(fetchGeneralSettings());
      } else {
        toast.error("Error updating settings");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  /* ================= UI ================= */
  return (
    <Card>
      <CardHeader>
        <CardHeading>
          <CardTitle>Site Settings</CardTitle>
          <CardDescription>
            Manage your website configuration
          </CardDescription>
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
                ))}</>
            ) : (
              <>
                {/* ===== SECTIONS ===== */}
                {siteSettingConfig.map((section) => (
                  <div key={section.title} className="mb-10">

                    <div className="flex items-center gap-3 mb-4 p-2 bg-muted rounded-lg">
                      <section.icon className="h-5 w-5 text-primary" />
                      <h2 className="text-lg font-semibold">
                        {section.title}
                      </h2>
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
                                      value={inputField.value || "#000000"}
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
                                  <Input
                                    type="file"
                                    onChange={(e) =>
                                      inputField.onChange(e.target.files?.[0])
                                    }
                                  />
                                ) : (
                                  <Input
                                    type={field.type}
                                    {...inputField}
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
              <Button
                type="submit"
                disabled={submitting}
              >
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