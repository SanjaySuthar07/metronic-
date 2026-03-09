'use client';

import { Suspense, useRef, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, ArrowLeft, LoaderCircle } from 'lucide-react';
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
import ReCAPTCHA from "react-google-recaptcha";

export default function Page() {

  const dispatch = useDispatch<AppDispatch>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

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

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    setLoading(true);
    setError(null);

    if (!recaptchaRef.current) {
      setError("Captcha not ready.");
      setLoading(false);
      return;
    }

    let token;

    try {

      token = await recaptchaRef.current.executeAsync();

    } catch {

      setError("Captcha failed");
      setLoading(false);
      resetCaptcha();
      return;

    }

    if (!token) {

      setError("Captcha token missing");
      setLoading(false);
      resetCaptcha();
      return;

    }

    const payload = {
      email: values.email,
      recaptcha_token: token,
    };

    const resultAction = await dispatch(forgetPassword(payload));

    if (forgetPassword.fulfilled.match(resultAction)) {

      setEmailSent(values.email);
      setShowModal(true);
      form.reset();

    } else {

      setError(resultAction.payload as string);

    }

    resetCaptcha();
    setLoading(false);

  };

  return (
    <Suspense>

      <Form {...form}>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="block w-full space-y-5"
        >

          <div className="text-center space-y-1 pb-3">

            <h1 className="text-2xl font-semibold tracking-tight">
              Forget Password
            </h1>

            <p className="text-sm text-muted-foreground">
              Enter your email to receive a password reset link.
            </p>

          </div>

          {error && (
            <Alert variant="destructive">
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

                <FormLabel>
                  Email <span className="text-red-500">*</span>
                </FormLabel>

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

            {loading && (
              <LoaderCircle className="animate-spin mr-2 h-4 w-4" />
            )}

            Send

          </Button>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            asChild
          >

            <Link href="/signin">
              <ArrowLeft className="size-3.5 mr-1" />
              Back
            </Link>

          </Button>

        </form>

      </Form>

      {/* invisible captcha */}

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        size="invisible"
      />

      <CheckEmailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        email={emailSent}
      />

    </Suspense>
  );
}