'use client';
import { Suspense, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
        useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean | null>(false);
    const [showRecaptcha, setShowRecaptcha] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.auth);
    const [showSuccess, setShowSuccess] = useState(false);
    const [message, setMessage] = useState('');
    useState(false);
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
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const isValid = await form.trigger();
        if (!isValid) return;

        setIsProcessing(true);
        setError(null);

        const values = form.getValues();

        const payload = {
            name: values.name,
            email: values.email,
            password: values.password,
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

        setIsProcessing(false);
    };


    if (success) {
        return (
            <Alert onClose={() => setSuccess(false)}>
                <AlertIcon>
                    <Check />
                </AlertIcon>
                <AlertTitle>
                    You have successfully signed up! Please check your email to verify
                    your account and then{' '}
                    <Link
                        href="/signin/"
                        className="text-primary hover:text-primary-darker"
                    >
                        Log in
                    </Link>
                    .
                </AlertTitle>
            </Alert>
        );
    }

    return (
        <Suspense>
            <Form {...form}>
                <form onSubmit={handleSubmit} className="block w-full space-y-5">
                    <div className="space-y-1.5 pb-3">
                        <h1 className="text-2xl font-semibold tracking-tight text-center">
                            Sign Up
                        </h1>
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Your Name" {...field} />
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
                                <FormLabel>Email<span className="text-red-500">*</span></FormLabel>
                                <FormControl>
                                    <Input placeholder="Your email" {...field} />
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
                                <FormLabel>Password<span className="text-red-500">*</span></FormLabel>
                                <div className="relative">
                                    <Input
                                        placeholder="Your password"
                                        type={passwordVisible ? 'text' : 'password'}
                                        {...field}
                                    />
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

                    <FormField
                        control={form.control}
                        name="passwordConfirmation"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password<span className="text-red-500">*</span></FormLabel>
                                <div className="relative">
                                    <Input
                                        type={passwordConfirmationVisible ? 'text' : 'password'}
                                        {...field}
                                        placeholder="Confirm your password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        mode="icon"
                                        size="sm"
                                        onClick={() =>
                                            setPasswordConfirmationVisible(
                                                !passwordConfirmationVisible,
                                            )
                                        }
                                        className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
                                        aria-label={
                                            passwordConfirmationVisible
                                                ? 'Hide password confirmation'
                                                : 'Show password confirmation'
                                        }
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

                    <div className="flex items-center space-x-2">
                        <FormField
                            control={form.control}
                            name="accept"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center gap-2.5">
                                            <Checkbox
                                                id="accept"
                                                checked={field.value}
                                                onCheckedChange={(checked) => field.onChange(!!checked)}
                                            />
                                            <label
                                                htmlFor="accept"
                                                className="text-sm leading-none text-muted-foreground"
                                            >
                                                I agree to the
                                            </label>
                                            <Link
                                                href="/privacy-policy"
                                                target="_blank"
                                                className="-ms-0.5 text-sm font-semibold text-foreground hover:text-primary"
                                            >
                                                Privacy Policy<span className="text-red-500">*</span>
                                            </Link>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex flex-col gap-2.5">
                        <Button type="submit" disabled={isProcessing || loading}>
                            {(isProcessing || loading) ? (
                                <LoaderCircleIcon className="size-4 animate-spin" />
                            ) : null}
                            Sign Up
                        </Button>
                    </div>

                    <div className="text-sm text-muted-foreground text-center">
                        Already have an account?{' '}
                        <Link
                            href="/signin"
                            className="text-sm text-sm font-semibold kt-link hover:text-primary"
                        >
                            Sign In
                        </Link>
                    </div>
                </form>
            </Form>
            <VerifyEmailModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                message={message}
            />
        </Suspense>
    );
}
