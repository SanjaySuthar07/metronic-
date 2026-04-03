'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardHeading,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';

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
import { fetchGeneralSettings, updateGeneralSettings } from "@/store/thunk/settings.thunk";
import { useEffect, useState } from 'react';

function formatLabel(key: string) {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export default function GeneralSetting() {
  const dispatch = useDispatch<AppDispatch>();

  const { generalSetting } = useSelector((state: RootState) => state.setting);
  const authSettings = generalSetting?.auth || {};

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await dispatch(fetchGeneralSettings());
      setLoading(false);
    };
    fetchData();
  }, [dispatch]);

  const form = useForm({
    defaultValues: {},
  });

  useEffect(() => {
    if (Object.keys(authSettings).length > 0) {
      const formatted = Object.fromEntries(
        Object.entries(authSettings).map(([key, data]: any) => [
          key,
          data.type === "toggle" ? !!data.value : data.value?.toString() ?? "",
        ])
      );
      form.reset(formatted);
    }
  }, [generalSetting, form]);

  const allSections = generalSetting;
  async function onSubmit(values: any) {
    try {
      setSubmitting(true);

      // Extract dynamically generated items into what backend expects
      const payload = {
        auth: Object.fromEntries(
          Object.entries(authSettings).map(([key, item]: any) => [
            key,
            {
              value:
                typeof values[key] === "boolean"
                  ? values[key] ? 1 : 0
                  : isNaN(values[key])
                    ? values[key]
                    : Number(values[key]),
              type: item.type,
            },
          ])
        )
      };
      console.log("Submit payload:", payload);

      const resultAction = await dispatch(updateGeneralSettings(payload));
      if (updateGeneralSettings.fulfilled.match(resultAction)) {
        toast.success(resultAction?.payload?.message || "Settings updated successfully.");
        await dispatch(fetchGeneralSettings());
      } else {
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
          <CardTitle>Auth Settings</CardTitle>
          <CardDescription>
            Manage Auth Configurations dynamically
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            ) : Object.keys(authSettings).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(authSettings).map(([key, item]: any) => (
                  <div key={key}>
                    <FormField
                      control={form.control}
                      name={key}
                      render={({ field }) => (
                        <FormItem className="flex flex-col justify-center h-full">
                          <FormLabel>{formatLabel(key)}</FormLabel>

                          <FormControl>
                            <div className="relative">
                              {item.type === "toggle" ? (
                                <div className="mt-2 block">
                                  <Switch
                                    checked={!!field.value}
                                    onCheckedChange={field.onChange}
                                  />
                                </div>
                              ) : item.type === "textarea" ? (
                                <textarea
                                  className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                  placeholder={`Enter ${formatLabel(key)}`}
                                  {...field}
                                />
                              ) : (
                                <Input
                                  type={item.type === "password" ? "password" : "text"}
                                  placeholder={`Enter ${formatLabel(key)}`}
                                  {...field}
                                />
                              )}
                            </div>
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-muted-foreground">No auth settings found.</div>
            )}

            <div className="grid col-span-1 md:col-span-2 flex justify-end gap-3 mt-8">
              <Button
                type="submit"
                disabled={submitting || (!form.formState.isDirty && Object.keys(authSettings).length > 0)}
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



