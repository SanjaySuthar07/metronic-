"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const img = "/assets/media/illustrations/30.svg"
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function CheckEmailModal({ isOpen, onClose, title, message }: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-8 relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <div className="flex justify-center py-6">
          <Image
            src="/assets/media/illustrations/30.svg"
            alt="illustration"
            width={120}
            height={120}
            priority
          />
        </div>

        <h3 className="text-lg font-semibold text-center mb-3">
          Check your email
        </h3>

        <p className="text-sm text-center text-gray-500 mb-6">
          Please click the link sent to your email{" "}
          <span className="font-medium text-black">
            {user?.email}
          </span>
          <br />
          to verify your account.
        </p>
        <p className="text-sm text-center text-gray-500 mb-6">
          {title}
          <br />
          {message}
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/signin"
            className="bg-black text-white px-4 py-2 rounded"
          >
            Signin
          </Link>
        </div>

        <div className="text-center mt-4 text-sm">
          Didn’t receive an email?{" "}
          <Link
            href="/resend-verification"
            className="underline font-medium"
          >
            Resend
          </Link>
        </div>

      </div>
    </div>
  );
}