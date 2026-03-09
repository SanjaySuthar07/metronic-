'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff, LoaderCircleIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import ReCAPTCHA from "react-google-recaptcha";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

import { Input } from '@/components/ui/input';
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';

import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/thunk/auth.thunk';
import { AppDispatch, RootState } from '@/store';
import { remember } from '@/store/slice/auth.slice';

import VerifyOtpPage from '../modal/VerifyOtpPage';

export default function Page() {

  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { loading, rememberUser } = useSelector((state: RootState) => state.auth);

  const [oppenQR, setOppenQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);

  const form = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    if (rememberUser) {
      form.setValue('email', rememberUser.email || '');
      form.setValue('password', rememberUser.password || '');
      form.setValue('rememberMe', rememberUser.rememberMe || false);
    }
  }, [rememberUser, form]);

  const resetCaptcha = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.reset();
    }
  };

  async function onSubmit(values: SigninSchemaType) {

    setError(null);

    if (!recaptchaRef.current) return;

    let token;

    try {
      token = await recaptchaRef.current.executeAsync();
    } catch {
      setError("Captcha failed");
      resetCaptcha();
      return;
    }

    if (!token) {
      setError("Captcha token missing");
      resetCaptcha();
      return;
    }

    const payload = {
      email: values.email,
      password: values.password,
      recaptcha_token: token,
    };

    const result = await dispatch(loginUser(payload));

    if (loginUser.fulfilled.match(result)) {

      const data = result.payload;

      setQrCode(data.qr_code);
      setUserId(data.user_id);
      setOppenQR(true);
      setMessage(data?.message);
      setUserType(data?.user_type);

    } else {

      setError(result.payload as string);

    }

    resetCaptcha();

    if (values.rememberMe) {
      dispatch(remember(values));
    } else {
      dispatch(remember(null));
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="block w-full space-y-5"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-center ">
            Sign In
          </h1>

          <div className="text-sm text-muted-foreground text-center">
            Already have an account?{' '}
            <Link
              href="/signup"
              className="text-primary font-semibold"
            >
              Sign Up
            </Link>
          </div>
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
                <Input placeholder="Enter your email address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                    type={passwordVisible ? 'text' : 'password'}
                    placeholder="Enter your password"
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
              <Link
                href="/forget-password"
                className="text-sm text-blue-600 text-right"
              >
                Forgot password?
              </Link>
            </FormItem>

          )}

        />

        <div className="flex items-center gap-2">

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label className="text-sm">Remember me</label>
              </>
            )}
          />

        </div>

        <Button type="submit" disabled={loading} className="w-full">

          {loading && <LoaderCircleIcon className="animate-spin mr-2" />}

          Continue

        </Button>

      </form>

      {/* Invisible captcha */}

      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
        size="invisible"
      />

      {/* OTP Modal */}

      <VerifyOtpPage
        oppenQR={oppenQR}
        onClose={() => setOppenQR(false)}
        qrCode={qrCode}
        userId={userId}
        message={message}
        userType={userType}
      />

    </Form>
  );
}