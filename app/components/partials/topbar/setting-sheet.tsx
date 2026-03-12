'use client';

import { ReactNode, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetBody,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import { ScrollArea } from '@/components/ui/scroll-area';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSettings, updateSettings } from '@/store/thunk/setting.thunk';
import { AppDispatch } from '@/store';
import { toast } from 'sonner';

const SettingsSchema = z.object({
  settings: z.array(
    z.object({
      origId: z.number().optional(),
      key: z.string(),
      value: z.string().min(1, 'Value is required'),
    })
  ),
});

type SettingsSchemaType = z.infer<typeof SettingsSchema>;

export function SettingSheet({ trigger }: { trigger: ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const { setting } = useSelector((s: any) => s.settings);

  const form = useForm<SettingsSchemaType>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      settings: [],
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'settings',
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (values: SettingsSchemaType) => {
    const payload = {
      settings: values.settings.map((s) => ({
        id: s.origId,
        key: s.key,
        value: s.value,
      })),
    };
    const res = await dispatch(updateSettings(payload));
    // show toast from response or generic message
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payloadRes: any = (res as any)?.payload;
    if (payloadRes?.message) {
      toast.success(payloadRes.message);
    } else {
      toast.success('Settings updated');
    }
    // refresh list
    dispatch(fetchSettings());
  };

  useEffect(() => {
    dispatch(fetchSettings());
  }, [dispatch]);

  useEffect(() => {
    if (setting && Array.isArray(setting)) {
      form.reset({
        settings: setting.map((s: any) => ({
          origId: s.id,
          key: s.key,
          value: s.value,
        })),
      });
    }
  }, [setting]);

  const humanizeKey = (k?: string) => {
    if (!k) return '';
    return k
      .toString()
      .replace(/_/g, ' ')
      .split(' ')
      .map((w) => (w.length ? w[0].toUpperCase() + w.slice(1) : w))
      .join(' ');
  };
  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          form.reset({ settings: setting?.map((s: any) => ({ origId: s.id, key: s.key, value: s.value })) ?? [] });
        }
      }}
    >
      <SheetTrigger asChild>
        {trigger}
      </SheetTrigger>

      <SheetContent className="p-0 gap-0 sm:w-[500px] sm:max-w-none inset-5 start-auto h-auto rounded-lg [&_[data-slot=sheet-close]]:top-4.5 [&_[data-slot=sheet-close]]:end-5">

        <SheetHeader>
          <SheetTitle className="p-4">
            Settings
          </SheetTitle>
        </SheetHeader>

        <SheetBody className="p-0">

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
        <ScrollArea className="h-[calc(100vh-10.5rem)] p-6">

                <div className="space-y-6">
                  {fields.map((field, index) => (
                    <div key={field.id}>
                      <input
                        type="hidden"
                        {...form.register(`settings.${index}.origId` as const)}
                        value={field.origId}
                      />
                      <FormField
                        control={form.control}
                        name={`settings.${index}.value` as const}
                        render={({ field: f }) => (
                          <FormItem>
                            <FormLabel>
                              {humanizeKey(field.key)} <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Enter Value" {...f} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}

                </div>

                <div className="flex justify-end gap-3 pt-8">

                  <SheetClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                  </SheetClose>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting && (
                      <LoaderCircleIcon className="animate-spin mr-2" />
                    )}
                    Submit
                  </Button>

                </div>

              </ScrollArea>

            </form>
          </Form>

        </SheetBody>

      </SheetContent>
    </Sheet>
  );
}