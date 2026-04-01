'use client';

import { useSelector, useDispatch } from 'react-redux';
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
import { getProfile, updateProfile } from '@/store/thunk/auth.thunk';

export default function AccountDetails() {
  const dispatch = useDispatch<AppDispatch>();

  const { user, loading } = useSelector((state: RootState) => state.auth);

  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(getProfileSchema()),
    defaultValues: {
      firstName: user?.first_name || '',
      lastName: user?.last_name || '',
    },
  });

  async function onSubmit(values: ProfileSchemaType) {
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
      };
      const resultAction = await dispatch(updateProfile(payload));
      if (updateProfile.fulfilled.match(resultAction)) {
        toast.success('Profile updated successfully');
        const resultActions = await dispatch(getProfile());
        if (getProfile.fulfilled.match(resultActions)) {
          form.reset(values);
        }
      }
      if (updateProfile.rejected.match(resultAction)) {
        toast.error(resultAction.payload as string);
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
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
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    First Name <span className="text-red-500">*</span>
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

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Last Name <span className="text-red-500">*</span>
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

            <div>
              <FormLabel>Email</FormLabel>

              <Input
                value={user?.email || ''}
                placeholder="Email"
                disabled
              />
            </div>

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