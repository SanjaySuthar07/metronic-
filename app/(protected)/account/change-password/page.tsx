'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { changePassword } from '@/store/thunk/auth.thunk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import {
  getChangePasswordSchema,
  ChangePasswordSchemaType,
} from '../forms/change-password-schema';
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

export default function ChangePassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(getChangePasswordSchema()),
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  async function onSubmit(values: ChangePasswordSchemaType) {
    const resultAction = await dispatch(changePassword(values));

    if (changePassword.fulfilled.match(resultAction)) {
      toast.success('Password changed successfully');
      form.reset();
    } else {
      toast.error(resultAction.payload as string);
    }
  }

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-[520px]"
          >
            {/* Current Password */}
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Current Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showCurrent ? 'text' : 'password'}
                        placeholder='Enter your current password'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      size="sm"
                      onClick={() => setShowCurrent(!showCurrent)}
                      className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    >
                      {showCurrent ? (
                        <Eye className="text-muted-foreground" />
                      ) : (
                        <EyeOff className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* New Password */}
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New Password <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showNew ? 'text' : 'password'}
                        placeholder='Enter your new password'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      size="sm"
                      onClick={() => setShowNew(!showNew)}
                      className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    >
                      {showNew ? (
                        <Eye className="text-muted-foreground" />
                      ) : (
                        <EyeOff className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Confirm Password */}
            <FormField
              control={form.control}
              name="new_password_confirmation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm New Password{' '}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <div className="relative">
                    <FormControl>
                      <Input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder='Enter your confirm password'
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      size="sm"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    >
                      {showConfirm ? (
                        <Eye className="text-muted-foreground" />
                      ) : (
                        <EyeOff className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={loading}
              >
                {loading && (
                  <LoaderCircleIcon
                    className="animate-spin mr-2"
                    size={16}
                  />
                )}
                Update Password
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}