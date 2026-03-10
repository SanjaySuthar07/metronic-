'use client';

import { ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoaderCircleIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';

import { Container } from '@/components/common/container';

const LoginSchema = z.object({
  key: z.string().min(3, "key is required"),
  value: z.string().min(3, "Value is required"),
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
    console.log("Form Data", values);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent
        side="right"
        className="
  p-0 gap-0
  sm:w-[400px] h-[290px]
  sm:max-w-none
  top-1/2
  right-1/2
  translate-x-1/2
  -translate-y-1/2
  h-auto
  rounded-lg
data-[state=open]:animate-out
data-[state=closed]:animate-out
data-[state=open]:slide-out-from-right 
data-[state=closed]:slide-out-to-right">
        <SheetHeader className="mb-0">
          <SheetTitle className="p-3">
            Settings
          </SheetTitle>
        </SheetHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6 p-5"
          >
            <FormField
              control={form.control}
              name="key"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Key<span className='text-red-500'>*</span></FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter Key"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Value<span className='text-red-500'>*</span> </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter Value"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className=" grid grid-cols-2 gap-2.5">
              <Button variant="outline">Cancel</Button>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </SheetFooter>
          </form>
        </Form>

      </SheetContent>

    </Sheet>
  );
}