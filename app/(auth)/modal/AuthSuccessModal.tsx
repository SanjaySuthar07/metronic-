"use client";
import Link from "next/link";
import Image from "next/image";
interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthSuccessModal({ isOpen, onClose, title, message }: Props) {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-xl w-full max-w-md p-8 relative">

        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <div className="flex justify-center py-6">
          <Image
            src="/assets/media/illustrations/Group.svg"
            alt="illustration"
            width={120}
            height={120}
            priority
          />
        </div>

        <h3 className="text-lg font-semibold text-center mb-3">
          Email Verified Successfully
        </h3>

        <p className="text-sm text-center text-gray-500 mb-6">
          Your email address has been successfully verified. You can now access your account.{" "}
        </p>

        <div className="flex justify-center gap-3">
          <Link
            href="/signin"
            className="kt-btn kt-btn-primary flex justify-center rounded"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}