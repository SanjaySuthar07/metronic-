'use client';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardHeading,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoaderCircleIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function AccountDetails() {
    const dispatch = useDispatch<AppDispatch>();
    const { user, loading } = useSelector((state: RootState) => state.auth);

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            name: user?.name || '',
        },
        validationSchema,
        onSubmit: async (values) => {
            toast.success('Profile updated (UI only)');
            console.log(values);
        },
    });

    return (
        <Card>
            <CardHeader className="py-4">
                <CardHeading>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>
                        Manage profile information
                    </CardDescription>
                </CardHeading>
            </CardHeader>

            <CardContent className="py-8">
                <form
                    onSubmit={formik.handleSubmit}
                    className="space-y-6 max-w-[520px]"
                >
                    {/* Name */}
                    <div>
                        <Label>
                            Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                            name="name"
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            placeholder="Enter your name"
                        />
                        {formik.touched.name && formik.errors.name && (
                            <p className="text-red-500 text-sm mt-1">
                                {formik.errors.name}
                            </p>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <Label>Email</Label>
                        <Input
                            name="email"
                            value={user?.email || ''}
                            disabled
                        />
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => formik.resetForm()}
                        >
                            Reset
                        </Button>

                        <Button type="submit" disabled={loading || !formik?.dirty}>
                            {loading && (
                                <LoaderCircleIcon
                                    className="animate-spin mr-2"
                                    size={16}
                                />
                            )}
                            Save Profile
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}