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
import { fetchSmtpSettings, updateSmtpSettings } from "@/store/thunk/settings.thunk";
import { useEffect, useState } from 'react';
import { Eye, EyeOff } from "lucide-react";
export const emailFields = [
  {
    label: "Port",
    name: "MAIL_PORT",
    type: "number",
    validation: { required: true },
    message: "The Port Use By Your Mail Server (common port are 25, 465, 587)"
  },
  {
    label: "Host",
    name: "MAIL_HOST",
    type: "text",
    validation: { required: true },
    message: "Smtp Host Address"
  },
  {
    label: "Username",
    name: "MAIL_USERNAME",
    type: "text",
    validation: { required: true },
    message: "Your Mail Server Login User Name"
  },
  {
    label: "Password",
    name: "MAIL_PASSWORD",
    type: "password",
    validation: { required: true },
    message: "Your Mail Server Login Password"

  },
  {
    label: "Mailer",
    name: "MAIL_MAILER",
    type: "text",
    validation: { required: true },
    message: "Your Mail Server Name"
  },
  {
    label: "Encryption",
    name: "MAIL_ENCRYPTION",
    type: "text",
    validation: { required: true },
    message: "Chpuse Encrypt Meathod For Secure Email Transiction"
  },
  {
    label: "From Name",
    name: "MAIL_FROM_NAME",
    type: "text",
    validation: { required: true },
    message: "The Name That Will Appear In The Form Field Of  Email Sent By The System"
  },
  {
    label: "From Address",
    name: "MAIL_FROM_ADDRESS",
    type: "text",
    validation: { required: true },
    message: "The Email Address That Will Be Used As The Sender For All Email Sent By The System"

  },

];
export default function EmailSettings() {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState<Record<string, boolean>>({});

  const { emailSetting } = useSelector((state: RootState) => state.setting);
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchSmtpSettings());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const schema = generateSchemaFromConfig(emailFields);
  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  useEffect(() => {
    if (emailSetting && Object.keys(emailSetting).length > 0) {
      const formatted = Object.fromEntries(
        emailFields.map((field) => [
          field.name,
          emailSetting[field.name]?.toString() ?? "",
        ])
      );

      form.reset(formatted);
    }
  }, [emailSetting]);

  async function onSubmit(values: any) {
    try {
      setSubmitting(true);

      const payload = Object.fromEntries(
        emailFields.map((field) => [
          field.name,
          field.type === "number"
            ? Number(values[field.name])
            : values[field.name],
        ])
      );


      const resultAction = await dispatch(updateSmtpSettings(payload));
      if (updateSmtpSettings.fulfilled.match(resultAction)) {
        toast.success(resultAction?.payload?.message);
        await dispatch(fetchSmtpSettings());
      }

      if (updateSmtpSettings.rejected.match(resultAction)) {
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
          <CardTitle>Email Settings</CardTitle>
          <CardDescription>
            Manage SMTP and Email configurations
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
              Array.from({ length: emailFields.length }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))
            ) : (
              emailFields.map((field) => (
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
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
