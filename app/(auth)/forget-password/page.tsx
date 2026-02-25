'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AlertCircle, LoaderCircle, ArrowLeft, Check } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { forgetPassword } from '@/store/thunk/auth.thunk';
import { AppDispatch } from '@/store';
import CheckEmailModal from "../modal/CheckEmailModal";
export default function ForgetPassword() {
    const dispatch = useDispatch<AppDispatch>();
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [emailSent, setEmailSent] = useState("");
    const EmailSchema = Yup.object().shape({
        email: Yup.string()
            .email('Please enter a valid email address.')
            .required('Email is required.'),
    }); 

    return (
        <div className="flex items-center justify-center grow bg-center bg-no-repeat page-bg min-h-screen">
            <div className="kt-card max-w-[370px] w-full">

                <Formik
                    initialValues={{ email: '' }}
                    validationSchema={EmailSchema}
                    onSubmit={async (values, { resetForm }) => {

                        setLoading(true);
                        setError(null);

                        const resultAction = await dispatch(forgetPassword(values));

                        setLoading(false);

                        if (forgetPassword.fulfilled.match(resultAction)) {
                            setEmailSent(values.email);
                            setShowModal(true);
                            resetForm();
                        } else {
                            setError(resultAction.payload as string);
                        }
                    }}
                >
                    {() => (
                        <Form
                            noValidate
                            className="kt-card-content flex flex-col gap-5 p-10"
                        >

                            <div className="text-center">
                                <h3 className="text-lg font-medium text-mono">
                                    Your Email
                                </h3>
                                <span className="text-sm text-secondary-foreground">
                                    Enter your email to reset password
                                </span>
                            </div>

                            {error && (
                                <div className="flex items-center gap-2 text-red-500 text-sm">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            {/* {success && (
                                <div className="flex items-center gap-2 text-green-600 text-sm">
                                    <Check size={16} />
                                    {success}
                                </div>
                            )} */}

                            <div className="flex flex-col gap-1">
                                <label className="kt-form-label font-normal text-mono">
                                    Email
                                </label>

                                <Field
                                    name="email"
                                    type="email"
                                    placeholder="email@email.com"
                                    disabled={loading}
                                    className="kt-input"
                                />

                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-xs"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="kt-btn kt-btn-primary flex justify-center grow"
                            >
                                {loading && (
                                    <LoaderCircle className="animate-spin mr-2" size={16} />
                                )}
                                Continue
                            </button>

                            <Link
                                href="/signin"
                                className="kt-btn kt-btn-outline flex justify-center items-center gap-2"
                            >
                                <ArrowLeft size={16} />
                                Back to Sign In
                            </Link>

                        </Form>
                    )}
                </Formik>
                <CheckEmailModal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    email={emailSent}
                />
            </div>
        </div>
    );
}