'use client';

import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, LoaderCircle } from 'lucide-react';

export default function ChangePassword() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const ResetSchema = Yup.object().shape({
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('New password is required'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm password is required'),
  });

  return (
    <div className="flex items-center justify-center grow bg-center bg-no-repeat page-bg min-h-screen">
      <div className="kt-card max-w-[370px] w-full">

        <Formik
          initialValues={{
            password: '',
            confirmPassword: '',
          }}
          validationSchema={ResetSchema}
          onSubmit={async (values) => {
            setLoading(true);

            console.log(values);


            setLoading(false);
          }}
        >
          {() => (
            <Form
              noValidate
              className="kt-card-content flex flex-col gap-5 p-10"
            >

              <div className="text-center">
                <h3 className="text-lg font-medium text-mono">
                  Reset Password
                </h3>
                <span className="text-sm text-secondary-foreground">
                  Enter your new password
                </span>
              </div>

              <div className="flex flex-col gap-1">
                <label className="kt-form-label font-normal text-mono">
                  New Password
                </label>

                <div className="kt-input flex items-center">
                  <Field
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter a new password"
                    className="flex-1 bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="kt-btn kt-btn-sm kt-btn-ghost kt-btn-icon bg-transparent! -me-1.5"
                  >
                    {showPassword ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="kt-form-label font-normal text-mono">
                  Confirm New Password
                </label>

                <div className="kt-input flex items-center">
                  <Field
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Re-enter a new Password"
                    className="flex-1 bg-transparent outline-none"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="kt-btn kt-btn-sm kt-btn-ghost kt-btn-icon bg-transparent! -me-1.5"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} className="text-muted-foreground" />
                    ) : (
                      <Eye size={18} className="text-muted-foreground" />
                    )}
                  </button>
                </div>

                <ErrorMessage
                  name="confirmPassword"
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
                  <LoaderCircle
                    size={16}
                    className="animate-spin mr-2"
                  />
                )}
                Submit
              </button>

            </Form>
          )}
        </Formik>

      </div>
    </div>
  );
}