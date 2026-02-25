'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';

export default function Page() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
        useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const SignupSchema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
            .email('Invalid email')
            .required('Email is required'),
        password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Password is required'),
        passwordConfirmation: Yup.string()
            .oneOf([Yup.ref('password')], 'Passwords must match')
            .required('Confirm your password'),
        accept: Yup.boolean().oneOf(
            [true],
            'You must accept the Privacy Policy'
        ),
    });

    return (
        <div className="max-w-md mx-auto mt-10 space-y-5">
            <h1 className="text-2xl font-semibold text-center">
                Sign Up
            </h1>

            <button className="w-full border p-2 rounded">
                Sign up with Google
            </button>

            {error && (
                <div className="text-red-500 text-sm text-center">
                    {error}
                </div>
            )}
            <Formik
                initialValues={{
                    name: '',
                    email: '',
                    password: '',
                    passwordConfirmation: '',
                    accept: false,
                }}
                validationSchema={SignupSchema}
                onSubmit={async (values) => {
                    console.log(values)
                }}
            >
                {() => (
                    <Form className="space-y-4">
                        <div>
                            <Field
                                name="name"
                                placeholder="Name"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage
                                name="name"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <Field
                                name="email"
                                placeholder="Email"
                                className="w-full border p-2 rounded"
                            />
                            <ErrorMessage
                                name="email"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div className="relative">
                            <Field
                                name="password"
                                type={passwordVisible ? 'text' : 'password'}
                                placeholder="Password"
                                className="w-full border p-2 rounded"
                            />
                            <button
                                type="button"
                                onClick={() => setPasswordVisible(!passwordVisible)}
                                className="absolute right-2 top-2"
                            >
                                {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                            <ErrorMessage
                                name="password"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div className="relative">
                            <Field
                                name="passwordConfirmation"
                                type={passwordConfirmationVisible ? 'text' : 'password'}
                                placeholder="Confirm Password"
                                className="w-full border p-2 rounded"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setPasswordConfirmationVisible(!passwordConfirmationVisible)
                                }
                                className="absolute right-2 top-2"
                            >
                                {passwordConfirmationVisible ? (
                                    <EyeOff size={18} />
                                ) : (
                                    <Eye size={18} />
                                )}
                            </button>
                            <ErrorMessage
                                name="passwordConfirmation"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="flex items-center gap-2">
                                <Field type="checkbox" name="accept" />
                                I agree to the Privacy Policy
                            </label>
                            <ErrorMessage
                                name="accept"
                                component="p"
                                className="text-red-500 text-sm"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isProcessing}
                            className="w-full bg-black text-white p-2 rounded"
                        >
                            {isProcessing ? 'Processing...' : 'Continue'}
                        </button>
                    </Form>
                )}
            </Formik>

            <p className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/signin" className="underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
}