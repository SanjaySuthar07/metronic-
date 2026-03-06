'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { getSigninSchema, SigninSchemaType } from '../forms/signin-schema';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/store/thunk/auth.thunk';
import { AppDispatch, RootState } from '@/store';
import { remember } from '@/store/slice/auth.slice';
import VerifyOtpPage from '../modal/VerifyOtpPage';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
export default function Page() {
  const { executeRecaptcha } = useGoogleReCaptcha();
  const [oppenQR, setOppenQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading, rememberUser } = useSelector((state: RootState) => state.auth);
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
  async function onSubmit(values: SigninSchemaType) {
    setError(null);
    if (!executeRecaptcha) {
      setError("Recaptcha not ready. Please try again.");
      return;
    }
    let recaptchaToken;
    try {
      recaptchaToken = await executeRecaptcha("login");
    } catch (err) {
      setError("Failed to generate captcha token");
      return;
    }
    if (!recaptchaToken) {
      setError("Captcha token missing");
      return;
    }
    const payload = {
      email: values.email,
      password: values.password,
      recaptcha_token: recaptchaToken,
    };
    const result = await dispatch(loginUser(payload));
    if (loginUser.fulfilled.match(result)) {
      const data = result.payload;
      setQrCode(data.qr_code);
      setUserId(data.user_id);
      setOppenQR(true);
      setMessage(data?.message);
      setUserType(data?.user_type);
    } else if (loginUser.rejected.match(result)) {
      setError(result.payload as string);
    }

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
            Need'an account?{' '}
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
            <FormItem id="email" >
              <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
              <FormControl>
                <Input
                  id='email'
                  placeholder="Your email"
                  autoComplete="email"
                  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem id="password">
              <div className="flex justify-between items-center gap-2.5">
                <FormLabel>Password<span className="text-red-500">*</span></FormLabel>
              </div>
              <div className="relative">
                <FormControl>
                  <Input
                    id='password'
                    placeholder="Your password"
                    type={passwordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  mode="icon"
                  size="sm"
                  onClick={() => setPasswordVisible(!passwordVisible)}
                  className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                  aria-label={
                    passwordVisible ? 'Hide password' : 'Show password'
                  }
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
        <div className="flex justify-end  m-0 p-0">
          <Link
            href="/forget-password"
            className="kt-link font-semibold  text-primary"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="flex items-center gap-2 space-x-2">
          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <>
                <Checkbox
                  id="remember-me"
                  checked={field.value}
                  onCheckedChange={(checked) => field.onChange(!!checked)}
                />
                <label
                  htmlFor="remember-me"
                  className="text-sm leading-none text-muted-foreground"
                >
                  Remember me
                </label>
              </>
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <Button type="submit" disabled={loading}>
            {loading ? (
              <LoaderCircleIcon className="size-4 animate-spin" />
            ) : null}
            Continue
          </Button>
        </div>
      </form>
      <VerifyOtpPage
        oppenQR={oppenQR}
        onClose={() => setOppenQR(false)}
        qrCode={qrCode}
        userId={userId}
        message={message}
        userType={userType}
      />
    </Form >
  );
}
