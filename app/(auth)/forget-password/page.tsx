'use client';

import { Suspense, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, Check, LoaderCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
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
import { useDispatch } from 'react-redux';
import { forgetPassword } from '@/store/thunk/auth.thunk';
import { AppDispatch } from '@/store';
import CheckEmailModal from '../modal/CheckEmailModal';

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const formSchema = z.object({
    email: z
      .string()
      .min(1, 'Email is required')
      .email('Please enter a valid email address.'),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onSubmit',
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);

    const resultAction = await dispatch(forgetPassword(values));

    if (forgetPassword.fulfilled.match(resultAction)) {
      setEmailSent(values.email);
      setShowModal(true);
      form.reset();
    } else {
      setError(resultAction.payload as string);
    }

    setLoading(false);
  };

  return (
    <Suspense>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="block w-full space-y-5">
          <div className="text-center space-y-1 pb-3">
            <h1 className="text-2xl font-semibold tracking-tight">
              Forget Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link.
            </p>
          </div>

          {error && (
            <Alert variant="destructive" onClose={() => setError(null)}>
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email <span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input placeholder="Your email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading && <LoaderCircle className="animate-spin mr-2 h-4 w-4" />}
            Send
          </Button>

          <Button type="button" variant="outline" className="w-full" asChild>
            <Link href="/signin">
              <ArrowLeft className="size-3.5 mr-1" />
              Back
            </Link>
          </Button>
        </form>
      </Form>

      <CheckEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        email={emailSent}
      />
    </Suspense>
  );
}