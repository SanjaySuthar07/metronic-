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
      expiredLinkDuration: user?.expired_link_duration || '',
      accessTokenExpires: user?.accessTokenExpires || '',
      refreshTokenExpires: user?.refreshTokenExpires || '',
      loginAttemptSeconds: user?.loginAttemptSeconds || '',
      loginAttemptMinute: user?.loginAttemptMinute || '',
      loginAttemptHour: user?.loginAttemptHour || '',
    },
  });

  async function onSubmit(values: ProfileSchemaType) {
    try {
      const payload = {
        first_name: values.firstName,
        last_name: values.lastName,
        expired_link_duration: values.expiredLinkDuration,
        access_token_expires: values.accessTokenExpires,
        refresh_token_expires: values.refreshTokenExpires,
        login_attempt_seconds: values.loginAttemptSeconds,
        login_attempt_minute: values.loginAttemptMinute,
        login_attempt_hour: values.loginAttemptHour,

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
          <CardTitle>General</CardTitle>
          <CardDescription>
            Manage profile information
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent className="py-8 ">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="max-w-[520px] grid md:grid-cols-2 gap-6"
          >
            <FormField
              control={form.control}
              name="expiredLinkDuration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Expired Link Duration <span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter expired link duration" type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div>
              <FormLabel>Support Email</FormLabel>

              <Input
                value={user?.email || ''}
                placeholder="Email"
                disabled
              />
            </div>

            <FormField
              control={form.control}
              name="accessTokenExpires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Access Token Expires In Minutes<span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter aceess Token Expires" type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="refreshTokenExpires"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Refresh Token Expires In Minutes<span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter refresh token expires" type='number'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loginAttemptSeconds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Login Attempt Seconds<span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter login attempt in seconds" type="number"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loginAttemptMinute"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Login Attempr Minute<span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter login attempt in Minute" type='number'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="loginAttemptHour"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Login Attempt Hour<span className="text-red-500">*</span>
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="Enter login attempt in hour" type='number'
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <div className=" grid col-span-1 md:col-span-2 flex justify-end gap-3">

              <Button
                type="submit"
                disabled={loading || !form.formState.isDirty}
              >
                {loading && (
                  <LoaderCircleIcon
                    className="animate-spin mr-2 "
                    size={16}
                  />
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
