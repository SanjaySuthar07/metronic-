'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { AppDispatch, RootState } from '@/store';
import { changePassword } from '@/store/thunk/auth.thunk';
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

export default function ChangePassword() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const validationSchema = Yup.object({
    current_password: Yup.string().required('Current password is required'),
    new_password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    new_password_confirmation: Yup.string()
      .oneOf([Yup.ref('new_password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  const formik = useFormik({
    initialValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
    validationSchema,
    onSubmit: async (values, { resetForm }) => {
      const resultAction = await dispatch(changePassword(values));

      if (changePassword.fulfilled.match(resultAction)) {
        toast.success('Password changed successfully');
        resetForm();
      } else {
        toast.error(resultAction.payload as string);
      }
    },
  });

  return (
    <Card>
      <CardHeader className="py-4">
        <CardHeading>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>
            Update your account password
          </CardDescription>
        </CardHeading>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={formik.handleSubmit}
          className="space-y-6 max-w-[520px]"
        >
          {/* Current Password */}
          <div>
            <Label>
              Current Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showCurrent ? 'text' : 'password'}
                name="current_password"
                value={formik.values.current_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                size="sm"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
              >
                {showCurrent ? (
                  <EyeOff className="text-muted-foreground" />
                ) : (
                  <Eye className="text-muted-foreground" />
                )}
              </Button>
            </div>
            {formik.touched.current_password &&
              formik.errors.current_password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.current_password}
                </p>
              )}
          </div>

          {/* New Password */}
          <div>
            <Label>
              New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showNew ? 'text' : 'password'}
                name="new_password"
                value={formik.values.new_password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                size="sm"
                onClick={() => setShowNew(!showNew)}
                className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
              >
                {showNew ? (
                  <EyeOff className="text-muted-foreground" />
                ) : (
                  <Eye className="text-muted-foreground" />
                )}
              </Button>
            </div>
            {formik.touched.new_password &&
              formik.errors.new_password && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.new_password}
                </p>
              )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label>
              Confirm New Password <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                type={showConfirm ? 'text' : 'password'}
                name="new_password_confirmation"
                value={formik.values.new_password_confirmation}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <Button
                type="button"
                variant="ghost"
                mode="icon"
                size="sm"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute end-0 top-1/2 -translate-y-1/2 h-7 w-7 me-1.5 bg-transparent!"
              >
                {showConfirm ? (
                  <EyeOff className="text-muted-foreground" />
                ) : (
                  <Eye className="text-muted-foreground" />
                )}
              </Button>
            </div>
            {formik.touched.new_password_confirmation &&
              formik.errors.new_password_confirmation && (
                <p className="text-red-500 text-sm mt-1">
                  {formik.errors.new_password_confirmation}
                </p>
              )}
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

            <Button type="submit" disabled={loading}>
              {loading && (
                <LoaderCircleIcon
                  className="animate-spin mr-2"
                  size={16}
                />
              )}
              Update Password
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}