'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { generateSchemaFromConfig } from '../forms/email-schema';
import { Button } from '@/components/ui/button';
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';
import { fetchReceptchSettings, updateReceptchSettings } from "@/store/thunk/settings.thunk";
import { useEffect, useState } from 'react';

export const recaptchaSettings = [
  {
    label: "Recaptcha Site",
    name: "RECAPTCHA_SITE",
    type: "text",
    validation: { required: true },
    message: "Recaptcha Site Key"
  },
  {
    label: "Recaptcha Secret",
    name: "RECAPTCHA_SECRET",
    type: "text",
    validation: { required: true },
    message: "Recaptcha Secret Key"
  },
];
export default function RecaptchaSetting() {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});


  const { recaptchaSetting } = useSelector((state: RootState) => state.setting);
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchReceptchSettings());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const schema = generateSchemaFromConfig(recaptchaSettings);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (recaptchaSetting && Object.keys(recaptchaSetting).length > 0) {
      const formatted = Object.fromEntries(
        recaptchaSettings.map((field) => [
          field.name,
          recaptchaSetting[field.name]?.toString() ?? "",
        ])
      );

      form.reset(formatted);
    }
  }, [recaptchaSetting]);

  async function onSubmit(values: any) {
    try {
      setSubmitting(true);

      const payload = Object.fromEntries(
        recaptchaSettings.map((field) => [
          field.name,
          field.type === "number"
            ? Number(values[field.name])
            : values[field.name],
        ])
      );


      const resultAction = await dispatch(updateReceptchSettings(payload));
      if (updateReceptchSettings.fulfilled.match(resultAction)) {
        toast.success(resultAction?.payload?.message);
        await dispatch(fetchReceptchSettings());
      }

      if (updateReceptchSettings.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string);
      }
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Captcha Settings</CardTitle>
          <CardDescription>
            Manage Captcha configurations
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent className="py-8 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[800px]"
          >
            {loading ? (
              Array.from({ length: recaptchaSettings.length }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              recaptchaSettings.map((field) => (
                <div key={field.name} className="mb-6">

                  <FormField
                    control={form.control}
                    name={field.name}
                    render={({ field: inputField }) => (
                      <FormItem>

                        <FormLabel>
                          {field.label}
                          {field.validation?.required && (
                            <span className="text-red-500">*</span>
                          )}
                        </FormLabel>

                        <FormControl>
                          <div className="relative">

                            <Input
                              type={
                                field.type === "password"
                                  ? showPassword[field.name] ? "text" : "password"
                                  : field.type
                              }
                              placeholder={`Enter ${field.label}`}
                              className={field.type === "password" ? "pr-10" : ""}
                              {...inputField}
                            />

                            {field.type === "password" && (
                              <button
                                type="button"
                                onClick={() =>
                                  setShowPassword((prev) => ({
                                    ...prev,
                                    [field.name]: !prev[field.name],
                                  }))
                                }
                                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                              >
                                {showPassword[field.name] ? (
                                  <EyeOff size={18} />
                                ) : (
                                  <Eye size={18} />
                                )}
                              </button>
                            )}

                          </div>
                        </FormControl>

                        <FormMessage />

                      </FormItem>
                    )}
                  />

                  <span className="text-xs text-muted-foreground">
                    {field.message}
                  </span>

                </div>
              ))
            )}

            <div className="grid col-span-1 md:col-span-2 flex justify-end gap-3 mt-4">
              <Button
                type="submit"
                disabled={submitting || !form.formState.isDirty}
              >
                {submitting && (
                  <LoaderCircleIcon className="animate-spin mr-2" size={16} />
                )}
                Save Captcha
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
