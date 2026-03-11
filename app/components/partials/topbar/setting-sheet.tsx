'use client';

import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
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

const LoginSchema = z.object({
  key: z.string().min(3, 'Key is required'),
  value: z.string().min(3, 'Value is required'),
});

type LoginSchemaType = z.infer<typeof LoginSchema>;

export function SettingSheet({ trigger }: { trigger: ReactNode }) {

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      key: '',
      value: '',
    },
  });

  const {
    formState: { isSubmitting },
  } = form;

  const handleSubmit = async (values: LoginSchemaType) => {
    console.log('Form Data', values);
  };

  return (
    <Sheet
      onOpenChange={(open) => {
        if (!open) {
          form.reset({
            key: '',
            value: '',
          });
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
                  <FormField
                    control={form.control}
                    name="key"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>
                          Key <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Key" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="value"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>
                          Value <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

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