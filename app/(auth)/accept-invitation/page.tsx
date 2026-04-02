'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import dynamic from "next/dynamic";
const ReCAPTCHA = dynamic(
  () => import("react-google-recaptcha"),
  { ssr: false }
);

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
import { loginUser } from '@/store/thunk/auth.thunk';
import { acceptInvitation } from '@/store/thunk/invite.thunk';
import { decryptLaravelData } from '@/lib/laravelDecrypt';
import { toast } from 'sonner';
import { getPasswordSchema } from '../forms/password-schema';
import VerifyOtpPage from '../modal/VerifyOtpPage';

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
  const recaptchaRef = useRef<any>(null);


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [oppenQR, setOppenQR] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [userId, setUserId] = useState<number | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [userType, setUserType] = useState<string | null>(null);
  const [type, setType] = useState<string | null>(null);
  const [tenant_id, setTenant_id] = useState<string | null>(null);

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

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
      name: decrypted.first_name + ' ' + decrypted.last_name || '',
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

      const res: any = await dispatch(acceptInvitation(payload));

      if (acceptInvitation.fulfilled.match(res)) {
        toast.success(res.payload.message || 'Account created successfully');

        let token;
        if (recaptchaRef.current) {
          try {
            token = await recaptchaRef.current.executeAsync();
          } catch (e) {
            console.error("Captcha failed", e);
          }
        }

        const loginPayload = {
          email: userInfo.email,
          password: values.password,
          recaptcha_token: token,
        }

        const result: any = await dispatch(loginUser(loginPayload));

        if (loginUser.fulfilled.match(result)) {
          const data = result.payload;

          if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("refresh_token", data.refresh_token);
            router.push("/");
          } else {
            setQrCode(data.qr_code);
            setUserId(data.user_id);
            setOppenQR(true);
            setMessage(data?.message);
            setUserType(data?.user_type);
            setType(data?.type);
            setTenant_id(data?.tenant_id)
          }
        } else {
          toast.error(result.payload as string || "Login failed after registration");
        }
      } else {
        toast.error(res.payload || 'Failed to accept invitation');
      }

    } catch (err: any) {
      toast.error(err || 'Something went wrong');
    } finally {
      setLoading(false);
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
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

      {mounted && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
        <ReCAPTCHA
          ref={recaptchaRef}
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
          size="invisible"
        />
      )}

      <VerifyOtpPage
        oppenQR={oppenQR}
        onClose={() => setOppenQR(false)}
        qrCode={qrCode}
        userId={userId}
        tenant_id={tenant_id}
        message={message}
        userType={userType}
        type={type}
      />

    </Suspense>
  );
}
