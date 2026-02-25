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
    const [showSuccess, setShowSuccess] = useState(false)
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
        <div className="flex items-center justify-center grow bg-center bg-no-repeat page-bg min-h-screen">
            <div className="kt-card max-w-[370px] w-full">
                <Formik
                    initialValues={{
                        name: '',
                        email: '',
                        password: '',
                        passwordConfirmation: '',
                        accept: false,
                    }}
                    validationSchema={SignupSchema}
                    onSubmit={async (values, { resetForm }) => {
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
                            setShowSuccess(true)
                            resetForm()
                        } else {
                            setIsSuccess(false);
                            setMessage(resultAction.payload as string);
                        }
                    }}
                >
                    {() => (
                        <Form className="kt-card-content flex flex-col gap-5 p-10">

                            {/* Heading */}
                            <div className="text-center mb-2.5">
                                <h3 className="text-lg font-medium text-mono leading-none mb-2.5">
                                    Sign up
                                </h3>
                                <div className="flex items-center justify-center">
                                    <span className="text-sm text-secondary-foreground me-1.5">
                                        Already have an Account ?
                                    </span>
                                    <Link href="/signin" className="text-sm link">
                                        Sign In
                                    </Link>
                                </div>
                            </div>

                            {/* Name */}
                            <div className="flex flex-col gap-1">
                                <label className="kt-form-label text-mono">Name</label>
                                <Field
                                    name="name"
                                    className="kt-input"
                                    placeholder="Enter Name"
                                />
                                <ErrorMessage
                                    name="name"
                                    component="p"
                                    className="text-red-500 text-xs"
                                />
                            </div>

                            {/* Email */}
                            <div className="flex flex-col gap-1">
                                <label className="kt-form-label text-mono">Email</label>
                                <Field
                                    name="email"
                                    type="email"
                                    className="kt-input"
                                    placeholder="email@email.com"
                                />
                                <ErrorMessage
                                    name="email"
                                    component="p"
                                    className="text-red-500 text-xs"
                                />
                            </div>

                            {/* Password */}
                            <div className="flex flex-col gap-1">
                                <label className="kt-form-label">Password</label>
                                <div className="kt-input flex items-center">
                                    <Field
                                        name="password"
                                        type={passwordVisible ? "text" : "password"}
                                        placeholder="Enter Password"
                                        className="flex-1 outline-none bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setPasswordVisible(!passwordVisible)}
                                    >
                                        {passwordVisible ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="password"
                                    component="p"
                                    className="text-red-500 text-xs"
                                />
                            </div>

                            {/* Confirm Password */}
                            <div className="flex flex-col gap-1">
                                <label className="kt-form-label">Confirm Password</label>
                                <div className="kt-input flex items-center">
                                    <Field
                                        name="passwordConfirmation"
                                        type={passwordConfirmationVisible ? "text" : "password"}
                                        placeholder="Re-enter Password"
                                        className="flex-1 outline-none bg-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setPasswordConfirmationVisible(
                                                !passwordConfirmationVisible
                                            )
                                        }
                                    >
                                        {passwordConfirmationVisible ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>
                                </div>
                                <ErrorMessage
                                    name="passwordConfirmation"
                                    component="p"
                                    className="text-red-500 text-xs"
                                />
                            </div>

                            {/* Checkbox */}
                            <label className="kt-checkbox-group">
                                <Field
                                    type="checkbox"
                                    name="accept"
                                    className="kt-checkbox kt-checkbox-sm"
                                />
                                <span className="kt-checkbox-label">
                                    I accept    {" "}
                                    <a className="text-sm link" href="#">
                                        Terms & Conditions
                                    </a>
                                </span>
                            </label>
                            <ErrorMessage
                                name="accept"
                                component="p"
                                className="text-red-500 text-xs"
                            />
                            <AuthSuccessModal
                                isOpen={showSuccess}
                                onClose={() => setShowSuccess(false)}
                                title="Registration Successful"
                                message={message} />
                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="kt-btn kt-btn-primary flex justify-center grow"
                            >
                                {loading ? "Processing..." : "Sign up"}
                            </button>
                        </Form>
                    )}
                </Formik>
            </div>
        </div>
    );
}