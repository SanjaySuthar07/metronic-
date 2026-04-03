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
import { Globe, Share2, MapPin, BarChart3, Settings } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

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
function formatLabel(key: string) {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSectionIcon(key: string) {
  switch (key) {
    case "general":
      return Globe;
    case "social_media":
      return Share2;
    case "contact_info":
      return MapPin;
    case "seo":
      return BarChart3;
    default:
      return Settings;
  }
}



/* ================= COMPONENT ================= */
export default function GeneralSetting() {
  const dispatch = useDispatch<AppDispatch>();
  const { generalSetting } = useSelector((state: RootState) => state.setting);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  /* ===== FLATTEN ALL FIELDS ===== */
  const form = useForm<any>({
    defaultValues: {},
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

    const apiData = generalSetting;


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

  console.log("generalSetting from store:", generalSetting);
  /* ===== SUBMIT ===== */
  async function onSubmit(values: any) {
    try {
      const apiData = generalSetting;


      const settingsPayload: any = {};

      // Loop all sections from API
      Object.keys(apiData).forEach((sectionKey) => {
        if (sectionKey === "auth") return; // Skip auth as requested

        const section = apiData[sectionKey];
        if (!section) return;


        // Create section object
        settingsPayload[sectionKey] = {};

        // Loop fields inside section
        Object.keys(section).forEach((fieldKey) => {
          const field = section[fieldKey];
          let value = values[fieldKey];

          /* Handle File */
          if (field?.type === "file") {
            if (value && value instanceof File) {
              value = value;
            }
            else if (
              typeof value === "string" &&
              value.startsWith("data:")
            ) {
              // already base64
            }
            else {
              // keep old file
              value = field?.value;
            }
          }

          /* Handle Toggle */
          if (field?.type === "toggle") {
            value = value ? 1 : 0;
          }

          // Save inside section. 
          // IMPORTANT: If value is undefined (not in form), we MUST keep the original API value
          const finalValue = value !== undefined ? value : field.value;

          settingsPayload[sectionKey][fieldKey] = {
            value: finalValue ?? "",
            type: field?.type || "text",
          };

        });
      });

      /* Convert File → base64 */
      for (const sectionKey of Object.keys(settingsPayload)) {
        const section = settingsPayload[sectionKey];

        for (const fieldKey of Object.keys(section)) {
          const field = section[fieldKey];

          if (
            field.type === "file" &&
            field.value instanceof File
          ) {
            const file = field.value;

            field.value = await new Promise((resolve) => {
              const reader = new FileReader();

              reader.onloadend = () =>
                resolve(reader.result as string);

              reader.readAsDataURL(file);
            });
          }
        }
      }

      const payload = settingsPayload;

      console.log("Final Payload:", payload);
      // return;

      const res = await dispatch(updateGeneralSettings(payload));
      if (updateGeneralSettings.fulfilled.match(res)) {
        toast.success(res?.payload?.message);
        setLoading(true);
        await dispatch(fetchGeneralSettings());
        setLoading(false);
        form.reset({ ...values });
      } else {

        toast.error("Error updating settings");
      }
    } catch (err) {
      console.error(err);
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
            {loading ? (
              <>
                {[1, 2, 3].map((sectionIndex) => (
                  <div key={sectionIndex} className="mb-10">
                    <div className="flex items-center gap-3 mb-4 p-2 bg-muted rounded-lg">
                      <Skeleton className="h-5 w-5 rounded-full" />
                      <Skeleton className="h-5 w-40" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {[1, 2, 3, 4].map((_, i) => (
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
                {/* ===== DYNAMIC SECTIONS ===== */}
                {Object.entries(generalSetting || {}).map(([sectionKey, sectionData]: [string, any]) => {

                  if (sectionKey === "auth") return null;

                  const Icon = getSectionIcon(sectionKey);
                  return (
                    <div key={sectionKey} className="mb-10">
                      <div className="flex items-center gap-3 mb-4 p-2 bg-muted rounded-lg">
                        <Icon className="h-5 w-5 text-primary" />
                        <h2 className="text-lg font-semibold">{formatLabel(sectionKey)}</h2>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(sectionData).map(([fieldKey, fieldData]: [string, any]) => (
                          <FormField
                            key={fieldKey}
                            control={form.control}
                            name={fieldKey}
                            render={({ field: inputField }) => (
                              <FormItem className={fieldData.type === "text" && sectionKey == "general" ? "col-span-1 md:col-span-2" : ""}>
                                <FormLabel>{formatLabel(fieldKey)}</FormLabel>

                                <FormControl>
                                  {fieldData.type === "color" ? (
                                    <div className="flex items-center ">
                                      <Input
                                        type="color"
                                        value={normalizeHexColor(inputField.value)}
                                        onChange={(e) => inputField.onChange(e.target.value)}
                                        className="w-16 h-10 p-1 cursor-pointer rounded-none rounded-l-md"
                                      />
                                      <Input
                                        type="text"
                                        value={inputField.value || ""}
                                        onChange={(e) => inputField.onChange(e.target.value)}
                                        placeholder="#000000"
                                        className=" h-10 p-1 rounded-none  rounded-r-md"
                                      />
                                    </div>
                                  ) : fieldData.type === "file" ? (
                                    <FilesUpload
                                      showCard={false}
                                      maxFiles={1}
                                      initialFiles={
                                        inputField.value
                                          ? [
                                            {
                                              id: fieldKey,
                                              name: fieldKey,
                                              size: 0,
                                              type: "image/png",
                                              url: (inputField.value as any)?.startsWith?.("data:")
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
                                            finalValue = await new Promise((resolve) => {
                                              const reader = new FileReader();
                                              reader.onloadend = () => resolve(reader.result as string);
                                              reader.readAsDataURL(f.file as File);
                                            });
                                          } else if (f.preview) {
                                            const url = f.preview;
                                            const cleanBase = NEXT_PUBLIC_BACKEND_URL.endsWith("/")
                                              ? NEXT_PUBLIC_BACKEND_URL.slice(0, -1)
                                              : NEXT_PUBLIC_BACKEND_URL;
                                            finalValue = url.replace(cleanBase, "").replace(/^\//, "");
                                          }
                                          inputField.onChange(finalValue);
                                        } else {
                                          inputField.onChange("");
                                        }
                                      }}
                                    />
                                  ) : fieldData.type === "toggle" ? (
                                    <Switch
                                      checked={!!inputField.value}
                                      onCheckedChange={inputField.onChange}
                                    />
                                  ) : fieldData.type === "textarea" || fieldData.type === "text" ? (
                                    <Textarea
                                      value={inputField.value || ""}
                                      onChange={(e) => inputField.onChange(e.target.value)}
                                      placeholder={formatLabel(fieldKey)}
                                    />
                                  ) : (
                                    <Input
                                      type={fieldData.type === "number" ? "number" : "text"}
                                      value={inputField.value || ""}
                                      onChange={(e) => inputField.onChange(e.target.value)}
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
                  );
                })}
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
