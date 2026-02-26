'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, LoaderCircle, AlertCircle } from 'lucide-react';
import { loginUser } from "@/store/thunk/auth.thunk";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import { useTheme } from '@/hooks/theme/useTheam';
import BackgroundImg from '@/components/common/AuthBackground/AuthBackground';
export default function Page() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.auth);
  const { theme } = useTheme()
  const router = useRouter();
  const SigninSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long.')
      .required('Password is required.'),
    rememberMe: Yup.boolean(),
  });
  return (
    <div className="flex relative items-center justify-center grow bg-center bg-no-repeat page-bg min-h-screen">
      <BackgroundImg theme={theme} />
      <div className="kt-card max-w-[370px] w-full">
        <div className="kt-card-content flex flex-col gap-5 p-10">

          <div className="text-center mb-2.5">
            <h3 className="text-lg font-medium text-mono leading-none mb-2.5">
              Sign in
            </h3>
            <div className="flex items-center justify-center">
              <span className="text-sm text-secondary-foreground me-1.5">
                Need an account?
              </span>
              <Link href="/signup" className="text-sm kt-link">
                Sign up
              </Link>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-500 text-sm">
              <AlertCircle size={16} />
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              email: '',
              password: '',
              rememberMe: false,
            }}
            validationSchema={SigninSchema}
            onSubmit={async (values) => {
              console.log(values)
              const resultAction = await dispatch(
                loginUser({
                  email: values.email,
                  password: values.password,
                  remember_me: values.rememberMe,
                })
              );
              if (loginUser.fulfilled.match(resultAction)) {
                const data = resultAction.payload;

                if (data.status) {
                  router.push("/")
                }
              } else {
                setError(resultAction.payload as string);
              }
            }}
          >
            {() => (
              <Form
                noValidate
                className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <label className="kt-form-label font-normal text-mono">
                    Email
                  </label>

                  <Field
                    name="email"
                    type="email"
                    placeholder="email@email.com"
                    className="kt-input"
                  />

                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-500 text-xs"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-1">
                    <label className="kt-form-label font-normal text-mono">
                      Password
                    </label>

                    <Link
                      href="/forget-password"
                      className="text-sm kt-link shrink-0"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <div className="kt-input flex items-center justify-between">
                    <Field
                      name="password"
                      type={passwordVisible ? 'text' : 'password'}
                      placeholder="Enter Password"
                      className="w-full bg-transparent outline-none"
                    />

                    <button
                      type="button"
                      onClick={() => setPasswordVisible(!passwordVisible)}
                      className="kt-btn kt-btn-sm kt-btn-ghost kt-btn-icon bg-transparent! -me-1.5"
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

                <label className="flex items-center gap-2">
                  <Field
                    type="checkbox"
                    name="rememberMe"
                    className="kt-checkbox kt-checkbox-sm"
                  />
                  <span >
                    Remember me
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={loading}
                  className="kt-btn kt-btn-primary flex justify-center grow"
                >
                  {loading && (
                    <LoaderCircle className="animate-spin mr-2" size={16} />
                  )}
                  {loading ? "Processing..." : "Sign In"}
                </button>

              </Form>
            )}
          </Formik>

        </div>
      </div>
    </div>
  );
}