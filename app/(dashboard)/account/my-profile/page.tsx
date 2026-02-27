'use client';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useDispatch, useSelector } from 'react-redux';
import { Suspense, useState } from 'react';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { changePassword } from '@/store/thunk/auth.thunk';
import { Alert, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { RiCloseFill } from '@remixicon/react';
const BasicSettings = () => {
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const dispatch = useDispatch()
    const { user } = useSelector((s) => s.auth)
    const [message, setMessage] = useState<string | null>(null);
    const [isError, setIsError] = useState(false);
    const personalSchema = Yup.object({
        name: Yup.string()
            .min(2, 'Name must be at least 2 characters')
            .required('Name is required'),

        email: Yup.string()
            .email('Enter valid email')
            .required('Email is required'),
    });

    const passwordSchema = Yup.object({
        current_password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('Current Password is required'),
        new_password: Yup.string()
            .min(6, 'Password must be at least 6 characters')
            .required('New Password is required'),
        new_password_confirmation: Yup.string()
            .oneOf([Yup.ref('new_password')], 'Passwords must match')
            .required('Confirm password is required'),
    });

    const personalForm = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user?.name || "",
        },
        validationSchema: personalSchema,
        onSubmit: (values) => {
            console.log('Personal Info:', values);
        },
    });

    const passwordForm = useFormik({
        initialValues: {
            current_password: '',
            new_password: '',
            new_password_confirmation: '',
        },
        validationSchema: passwordSchema,
        onSubmit: async (values, { resetForm }) => {
            try {
                const result = await dispatch(changePassword(values)).unwrap();
                setIsError(false);
                setMessage(result.message);
                resetForm();
            } catch (error: any) {
                setIsError(true);
                setMessage(error);
            }
        },
    });

    return (
        <Suspense>
            <Card className="pb-2.5">
                <CardHeader>
                    <CardTitle>My Profile</CardTitle>

                </CardHeader>

                <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        <form onSubmit={personalForm.handleSubmit} className="space-y-5">
                            <h3 className="text-lg font-semibold">
                                Personal Information

                            </h3>

                            <div className="space-y-4">

                                <div>
                                    <Label>Name</Label>
                                    <Input
                                        type="text"
                                        name="name"
                                        value={personalForm.values.name}
                                        onChange={personalForm.handleChange}
                                        onBlur={personalForm.handleBlur}
                                    />
                                    {personalForm.touched.name && personalForm.errors.name && (
                                        <p className="text-sm text-red-500 mt-1">
                                            {personalForm.errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        name="email"
                                        disabled
                                        value={user?.email || ""}
                                    />
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" disabled={!personalForm.dirty}>
                                        Save Changes
                                    </Button>
                                </div>

                            </div>
                        </form>

                        <form onSubmit={passwordForm.handleSubmit} className="space-y-5">
                            <h3 className="text-lg font-semibold">
                                Change Password
                            </h3>
                            {message && (
                                <Alert variant={isError ? "destructive" : "success"} className="mb-4">
                                    <AlertIcon>
                                        <AlertCircle />
                                    </AlertIcon>
                                    <AlertTitle>{message}</AlertTitle>
                                    <span className='cursor-pointer' onClick={() => setMessage(null)}><RiCloseFill /></span>
                                </Alert>
                            )}
                            <div className="space-y-4">

                                <div>
                                    <Label>
                                        Current Password <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            type={showCurrent ? "text" : "password"}
                                            name="current_password"
                                            value={passwordForm.values.current_password}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowCurrent(!showCurrent)}
                                            className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5"
                                        >
                                            {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>

                                    {passwordForm.touched.current_password &&
                                        passwordForm.errors.current_password && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {passwordForm.errors.current_password}
                                            </p>
                                        )}
                                </div>
                                <div>
                                    <Label>
                                        New Password <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            type={showNew ? "text" : "password"}
                                            name="new_password"
                                            value={passwordForm.values.new_password}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowNew(!showNew)}
                                            className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5"
                                        >
                                            {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>

                                    {passwordForm.touched.new_password &&
                                        passwordForm.errors.new_password && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {passwordForm.errors.new_password}
                                            </p>
                                        )}
                                </div>

                                <div>
                                    <Label>
                                        Confirm Password <span className="text-red-500">*</span>
                                    </Label>

                                    <div className="relative">
                                        <Input
                                            type={showConfirm ? "text" : "password"}
                                            name="new_password_confirmation"
                                            value={passwordForm.values.new_password_confirmation}
                                            onChange={passwordForm.handleChange}
                                            onBlur={passwordForm.handleBlur}
                                        />

                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setShowConfirm(!showConfirm)}
                                            className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5"
                                        >
                                            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                        </Button>
                                    </div>

                                    {passwordForm.touched.new_password_confirmation &&
                                        passwordForm.errors.new_password_confirmation && (
                                            <p className="text-sm text-red-500 mt-1">
                                                {passwordForm.errors.new_password_confirmation}
                                            </p>
                                        )}
                                </div>

                                <div className="pt-2">
                                    <Button type="submit" variant="secondary">
                                        Update Password
                                    </Button>
                                </div>

                            </div>
                        </form>

                    </div>
                </CardContent>
            </Card>
        </Suspense>
    );
};

export default BasicSettings;