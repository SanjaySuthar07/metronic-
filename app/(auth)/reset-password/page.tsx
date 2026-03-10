'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
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
import { LoaderCircleIcon } from 'lucide-react';
import {
  ChangePasswordSchemaType,
  getChangePasswordSchema,
} from '../forms/change-password-schema';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { resetPassword } from '@/store/thunk/auth.thunk';
import dynamic from "next/dynamic";
const ReCAPTCHA = dynamic(
  () => import("react-google-recaptcha"),
  { ssr: false }
);


export default function Page() {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;
  const email = searchParams?.get('email') || null;

  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(getChangePasswordSchema()),
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token || !email) {
      setError('Invalid or missing reset token.');
      return;
    }
    setIsValidToken(true);
  }, [token, email]);

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  async function onSubmit(values: ChangePasswordSchemaType) {

    if (!token || !email) {
      setError('Invalid reset token.');
      return;
    }

    if (!recaptchaRef.current) {
      setError("Captcha not ready.");
      return;
    }

    try {

      setIsProcessing(true);
      setError(null);

      const captchaToken = await recaptchaRef.current.executeAsync();

      if (!captchaToken) {
        setError("Captcha token missing");
        setIsProcessing(false);
        resetCaptcha();
        return;
      }

      const resultAction = await dispatch(
        resetPassword({
          email,
          token,
          password: values.newPassword,
          recaptcha_token: captchaToken,
        })
      );

      if (resetPassword.fulfilled.match(resultAction)) {

        setSuccessMessage('Password successfully changed.');
        form.reset();

        setTimeout(() => {
          router.push('/signin');
        }, 2000);

      } else {

        setError(resultAction.payload as string);

      }

    } catch (err) {

      setError(
        err instanceof Error
          ? err.message
          : 'An unexpected error occurred.'
      );

    } finally {

      setIsProcessing(false);
      resetCaptcha();   // ← auto captcha reset

    }
  }

  return (
    <Form {...form}>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-4"
      >

        <div className="text-center space-y-1 pb-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below.
          </p>
        </div>

        {error && (
          <div className="text-center space-y-6">
            <Alert variant="destructive">
              <AlertIcon>
                <AlertCircle />
              </AlertIcon>
              <AlertTitle>{error}</AlertTitle>
            </Alert>
            <Button asChild>
              <Link href="/signin">
                Go back to Login
              </Link>
            </Button>
          </div>
        )}

        {successMessage && (
          <Alert>
            <AlertIcon>
              <Check />
            </AlertIcon>
            <AlertTitle>{successMessage}</AlertTitle>
          </Alert>
        )}

        {isValidToken && !successMessage && (
          <>

            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    New Password <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="relative">

                    <FormControl>
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter new password"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>

                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Confirm New Password <span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="relative">

                    <FormControl>
                      <Input
                        type={passwordConfirmationVisible ? 'text' : 'password'}
                        placeholder="Confirm your new password"
                        className="pr-10"
                        {...field}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setPasswordConfirmationVisible(!passwordConfirmationVisible)
                      }
                      className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
                    >
                      {passwordConfirmationVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </Button>

                  </div>

                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isProcessing} className="w-full">
              {isProcessing && (
                <LoaderCircleIcon className="animate-spin mr-2" />
              )}
              Reset Password
            </Button>
          </>
        )}

      </form>

      {/* invisible captcha */}

      {mounted && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}

    </Form>
  );
}