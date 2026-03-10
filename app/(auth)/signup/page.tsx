'use client';

import { Suspense, useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle, Check, Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import VerifyEmailModal from '../modal/VerifyEmailModal';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/store/thunk/auth.thunk';
import { AppDispatch, RootState } from '@/store';
import dynamic from "next/dynamic";
const ReCAPTCHA = dynamic(
    () => import("react-google-recaptcha"),
    { ssr: false }
);


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
import { getSignupSchema, SignupSchemaType } from '../forms/signup-schema';

export default function Page() {

    const recaptchaRef = useRef<ReCAPTCHA>(null);

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.auth);

    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const form = useForm<SignupSchemaType>({
        resolver: zodResolver(getSignupSchema()),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: '',
            accept: false,
        },
    });

    const resetCaptcha = () => {
        if (recaptchaRef.current) {
            recaptchaRef.current.reset();
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault();

        const isValid = await form.trigger();
        if (!isValid) return;

        setIsProcessing(true);
        setError(null);

        if (!recaptchaRef.current) {
            setError("Captcha not ready");
            setIsProcessing(false);
            return;
        }

        let token;

        try {
            token = await recaptchaRef.current.executeAsync();
        } catch {
            setError("Captcha failed");
            setIsProcessing(false);
            resetCaptcha();
            return;
        }

        if (!token) {
            setError("Captcha token missing");
            setIsProcessing(false);
            resetCaptcha();
            return;
        }

        const values = form.getValues();

        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
            recaptcha_token: token,
        };

        const resultAction = await dispatch(registerUser(payload));

        if (registerUser.fulfilled.match(resultAction)) {

            const data = resultAction.payload;

            if (data.status) {
                setMessage(data.message);
            }

            setShowSuccess(true);
            form.reset();

        } else {
            setError(resultAction.payload as string);
        }

        resetCaptcha();
        setIsProcessing(false);
    };

    return (
        <Suspense>

            <Form {...form}>

                <form onSubmit={handleSubmit} className="block w-full space-y-5">

                    <div>
                        <h1 className="text-2xl font-semibold tracking-tight text-center ">
                            Sign Up
                        </h1>

                        <div className="text-sm text-muted-foreground text-center">
                            Already have an account?{' '}
                            <Link
                                href="/signin"
                                className="text-primary font-semibold"
                            >
                                Sign In
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Name <span className="text-red-500">*</span>
                                </FormLabel>
                                <FormControl>
                                    <Input placeholder="Enter your name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

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
                                        {passwordVisible ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="passwordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Confirm Password <span className="text-red-500">*</span>
                                </FormLabel>

                                <div className="relative">
                                    <FormControl>
                                        <Input
                                            type={passwordConfirmationVisible ? 'text' : 'password'}
                                            placeholder="Confirm your password"
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
                                        {passwordConfirmationVisible ? <EyeOff /> : <Eye />}
                                    </Button>
                                </div>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex items-center gap-2">

                        <FormField
                            control={form.control}
                            name="accept"
                            render={({ field }) => (
                                <>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={(checked) => field.onChange(!!checked)}
                                    />
                                    <label className="text-sm">
                                        I agree to the Privacy Policy
                                    </label>
                                </>
                            )}
                        />
                    </div>
                    <Button type="submit" disabled={isProcessing || loading} className="w-full">
                        {(isProcessing || loading) && (
                            <LoaderCircleIcon className="animate-spin mr-2" />
                        )}
                        Sign Up
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

            <VerifyEmailModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                email={form.getValues('email')}
            />

        </Suspense>
    );
}