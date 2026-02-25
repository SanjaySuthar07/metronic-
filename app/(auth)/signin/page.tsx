'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Eye, EyeOff, AlertCircle, LoaderCircle } from 'lucide-react';
import { signIn } from 'next-auth/react';

export default function Page() {
  const router = useRouter();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="block w-full max-w-md mx-auto space-y-5">
      <h1 className="text-2xl font-semibold tracking-tight text-center">
        Sign in
      </h1>

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
        }}
      >
        {() => (
          <Form className="space-y-4">

            <div>
              <Field
                name="email"
                placeholder="Your email"
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
                placeholder="Your password"
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
            <div className="flex justify-end">
              <Link
                href="/resetPassword"
                className="text-sm text-gray-600 hover:underline"
              >Forget Password?</Link>
            </div>
            <div className="flex items-center gap-2">
              <Field type="checkbox" name="rememberMe" />
              <label className="text-sm text-gray-600">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={isProcessing}
              className="w-full bg-black text-white p-2 rounded flex justify-center items-center gap-2"
            >
              {isProcessing && (
                <LoaderCircle className="animate-spin" size={16} />
              )}
              Continue
            </button>
          </Form>
        )}
      </Formik>

      <p className="text-sm text-gray-500 text-center">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-black">
          Sign Up
        </Link>
      </p>
    </div>
  );
}