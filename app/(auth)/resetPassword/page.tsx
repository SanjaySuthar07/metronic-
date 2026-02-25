'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { AlertCircle, ArrowLeft, Check, LoaderCircle } from 'lucide-react';

export default function Page() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const ResetSchema = Yup.object().shape({
    email: Yup.string()
      .email('Please enter a valid email address.')
      .required('Email is required.'),
  });

  return (
    <div className="block w-full space-y-5 max-w-md mx-auto">

      <div className="text-center space-y-1 pb-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Reset Password
        </h1>
        <p className="text-sm text-gray-500">
          Enter your email to receive a password reset link.
        </p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 text-green-600 text-sm">
          <Check size={16} />
          {success}
        </div>
      )}

      <Formik
        initialValues={{ email: '' }}
        validationSchema={ResetSchema}
        onSubmit={async (values: any, { resetForm }) => {
          console.log(values)
          resetForm()
        }}
      >
        {() => (
          <Form className="space-y-4">

            <div>
              <Field
                type="email"
                name="email"
                placeholder="Enter your email address"
                disabled={!!success || isProcessing}
                className="w-full border p-2 rounded"
              />
              <ErrorMessage
                name="email"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            <button
              type="submit"
              disabled={!!success || isProcessing}
              className="w-full bg-black text-white p-2 rounded flex justify-center items-center gap-2"
            >
              {isProcessing && (
                <LoaderCircle className="animate-spin" size={16} />
              )}
              Submit
            </button>

          </Form>
        )}
      </Formik>

      <div className="space-y-3">
        <Link
          href="/signin"
          className="w-full border p-2 rounded flex justify-center items-center gap-2 text-sm"
        >
          <ArrowLeft size={14} />
          Back
        </Link>
      </div>

    </div>
  );
}