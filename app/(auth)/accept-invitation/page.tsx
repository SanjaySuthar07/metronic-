'use client';

import { Suspense, useState, useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';

import { AlertCircle, Eye, EyeOff, LoaderCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';

import { acceptInvitation } from '@/store/thunk/invite.thunk';
import { decryptLaravelData } from '@/lib/laravelDecrypt';
import { toast } from 'sonner';
import { getPasswordSchema } from '../forms/password-schema';

const formSchema = z
  .object({
    password: getPasswordSchema(),
    confirm_password: getPasswordSchema(),
  })
  .refine((data) => data.password === data.confirm_password, {
    path: ['confirm_password'],
    message: 'Passwords do not match',
  });

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const encryptedData = searchParams.get('data');
  const router = useRouter();
  const [password, setPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState(false);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirm_password: '',
    },
  });

  useEffect(() => {
    if (!encryptedData) return;

    const decrypted = decryptLaravelData(
      encryptedData,
      process.env.NEXT_PUBLIC_APP_KEY!
    );

    if (!decrypted) {
      setError('Invalid invitation link.');
      return;
    }

    setUserInfo({
      name: decrypted.name || '',
      email: decrypted.email || '',
    });
  }, [encryptedData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true);

      const payload = {
        data: encryptedData || '',
        password: values.password,
        password_confirmation: values.confirm_password,
      };
      const res = await dispatch(acceptInvitation(payload)).unwrap();
      toast.success(res.message || 'Account created successfully');
      form.reset();
      router.push('/signin');
    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-6"
        >
          {/* Header */}
          <div className="text-center space-y-1 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Accept Invitation
            </h1>

            <p className="text-sm text-muted-foreground">
              You have been invited to join the workspace
            </p>
          </div>

          {/* Error */}
          {error && (
            <Alert variant="destructive">
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}
          <div className="flex justify-between flex-wrap  rounded-md border bg-muted/60 p-4 space-y-3">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-xs ">{userInfo.name}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-xs ">{userInfo.email}</p>
            </div>
          </div>

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Password <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      type={password ? 'text' : 'password'}
                      placeholder="Enter your password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setPassword(!password)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {password ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirm_password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Confirm Password <span className="text-red-500">*</span>
                </FormLabel>
                <div className="relative">

                  <FormControl>
                    <Input
                      type={confirmPassword ? 'text' : 'password'}
                      placeholder="Enter confirm password"
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmPassword(!confirmPassword)}
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                  >
                    {confirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit */}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && (
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
            )}
            Accept Invitation
          </Button>
        </form>
      </Form>
    </Suspense>
  );
}