'use client';

import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { getProfileSchema, ProfileSchemaType } from '../forms/profile-schema';
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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(getProfileSchema()),
    defaultValues: {
      name: user?.name || '',
    },
  });

  async function onSubmit(values: ProfileSchemaType) {
    console.log(values);
    toast.success('Profile updated (UI only)');
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            Manage profile information
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent className="py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-[520px]"
          >
            {/* Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Name <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter your name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Email */}
            <div>
              <FormLabel>Email</FormLabel>
              <Input
                value={user?.email || ''}
                disabled
              />
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>

              <Button
                type="submit"
                disabled={loading || !form.formState.isDirty}
              >
                {loading && (
                  <LoaderCircleIcon
                    className="animate-spin mr-2"
                    size={16}
                  />
                )}
                Save Profile
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}