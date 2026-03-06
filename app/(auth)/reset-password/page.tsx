'use client';
import { useEffect, useState } from 'react';
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
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';

export default function Page() {

  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { executeRecaptcha } = useGoogleReCaptcha();

  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || null;
  const email = searchParams?.get('email') || null;

  const [verifyingToken, setVerifyingToken] = useState(false);
  const [isValidToken, setIsValidToken] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
    useState(false);

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

  async function onSubmit(values: ChangePasswordSchemaType) {

    if (!token || !email) {
      setError('Invalid reset token.');
      return;
    }

    if (!executeRecaptcha) {
      setError("Recaptcha not ready. Please try again.");
      return;
    }

    try {

      setIsProcessing(true);
      setError(null);

      const recaptchaToken = await executeRecaptcha("reset_password");

      if (!recaptchaToken) {
        setError("Captcha token missing");
        setIsProcessing(false);
        return;
      }

      const resultAction = await dispatch(
        resetPassword({
          email,
          token,
          password: values.newPassword,
          recaptcha_token: recaptchaToken,
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
              <Link href="/signin" className="text-primary">
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
                    New Password<span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="relative">

                    <FormControl>
                      <Input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Enter new password"
                        {...field}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    >
                      {passwordVisible ? (
                        <EyeOff className="text-muted-foreground" />
                      ) : (
                        <Eye className="text-muted-foreground" />
                      )}
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
                    Confirm New Password<span className="text-red-500">*</span>
                  </FormLabel>

                  <div className="relative">

                    <FormControl>
                      <Input
                        type={passwordConfirmationVisible ? 'text' : 'password'}
                        placeholder="Confirm new password"
                        {...field}
                      />
                    </FormControl>

                    <Button
                      type="button"
                      variant="ghost"
                      mode="icon"
                      onClick={() =>
                        setPasswordConfirmationVisible(
                          !passwordConfirmationVisible,
                        )
                      }
                      className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                    >
                      {passwordConfirmationVisible ? (
                        <EyeOff className="text-muted-foreground" />
                      ) : (
                        <Eye className="text-muted-foreground" />
                      )}
                    </Button>

                  </div>

                  <FormMessage />

                </FormItem>
              )}
            />

            <Button type="submit" disabled={isProcessing} className="w-full">

              {isProcessing && (
                <LoaderCircleIcon className="size-4 animate-spin" />
              )}

              Reset Password

            </Button>

          </>
        )}

      </form>
    </Form>
  );
}