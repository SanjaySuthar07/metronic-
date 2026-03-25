'use client';

import React, { useEffect } from 'react';
import { AvatarInput } from '../../../components/partials/common/avatar-input';
import { format } from 'date-fns';
import { CalendarDays, CalendarIcon, Clock3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent } from '@/components/ui/card';
import { DateInput, TimeField } from '@/components/ui/datefield';
import { Input, InputAddon, InputGroup } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  const dispatch = useDispatch();
  const { setting } = useSelector((s: any) => s.settings);
  console.log(setting, "setting")
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
  const onSubmit = (data: any) => {
    const payload = {
      settings: data.settings.map((item: any) => ({
        id: item.origId,
        key: item.key,
        value: item.value,
      })),
    };

    dispatch(updateSettings(payload));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="pb-2.5">
          <CardContent className="grid gap-5">

            {/* 🔥 DYNAMIC FIELDS */}
            {form.watch("settings")?.map((item: any, index: number) => {
              const isFileField = item.key === 'logo' || item.key === 'favicon_icon';

              return (
                <div
                  key={item.key}
                  className={cn(
                    "flex flex-wrap lg:flex-nowrap gap-2.5",
                    isFileField ? "items-start" : "items-baseline"
                  )}
                >
                  <Label className="flex w-full max-w-56 mt-2">
                    {item.key
                      .replaceAll("_", " ")
                      .replace(/\b\w/g, (c: string) => c.toUpperCase())}
                  </Label>

                  <div className="flex-1 w-full">
                    {isFileField ? (
                      <FilesUpload
                        showCard={false}
                        maxFiles={1}
                        initialFiles={
                          item.value
                            ? [
                              {
                                id: item.key,
                                name: item.key,
                                size: 0,
                                type: "image/png",
                                url: item.value,
                              },
                            ]
                            : []
                        }
                        onFilesChange={(files) => {
                          if (files.length > 0) {
                            form.setValue(
                              `settings.${index}.value`,
                              files[0].preview || files[0].file.name
                            );
                          }
                        }}
                      />
                    ) : (
                      <Input
                        value={form.watch(`settings.${index}.value`) || ""}
                        onChange={(e) =>
                          form.setValue(`settings.${index}.value`, e.target.value)
                        }
                      />
                    )}
                  </div>
                </div>
              );
            })}

            {/* Save */}
            <div className="flex justify-end">
              <Button type="submit">Update Changes</Button>
            </div>

          </CardContent>
        </Card>
      </form>
    </Form>
  );
};

export { BasicSettings, type IGeneralSettingsProps };