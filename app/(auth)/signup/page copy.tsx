'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/store/thunk/auth.thunk";
import { AppDispatch, RootState } from "@/store";
import AuthSuccessModal from "../modal/AuthSuccessModal";
import { measureMemory } from 'vm';
export default function Page() {
    const router = useRouter();
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [passwordConfirmationVisible, setPasswordConfirmationVisible] =
        useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const { loading } = useSelector((state: RootState) => state.auth);
    const [message, setMessage] = useState("")
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
            {message && (
                <div
                    className={`text-sm text-center ${isSuccess ? "text-green-600" : "text-red-500"
                        }`}
                >
                    {message}
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
                    const payload = {
                        name: values.name,
                        email: values.email,
                        password: values.password,
                    };

                    const resultAction = await dispatch(registerUser(payload));

                    if (registerUser.fulfilled.match(resultAction)) {
                        const data = resultAction.payload;

                        if (data.status) {
                            setIsSuccess(true);
                            setMessage(data.message);
                        }
                    } else {
                        setIsSuccess(false);
                        setMessage(resultAction.payload as string);
                    }
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
                            disabled={loading}
                            className="w-full bg-black text-white p-2 rounded"
                        >
                            {loading ? "Processing..." : "Continue"}
                        </button>
                    </Form>
                )}
            </Formik>
            {/* <AuthSuccessModal
                isOpen={true}
                onClose={() => setShowSuccess(false)}
                title="Registration Successful 🎉"
                message="Please check your email to verify your account."
            /> */}
            <p className="text-center text-sm">
                Already have an account?{' '}
                <Link href="/signin" className="underline">
                    Sign In
                </Link>
            </p>
        </div>
    );
}