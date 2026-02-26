"use client";

import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  email: string;
}

export default function CheckEmailModal({
  isOpen,
  onClose,
  email,
}: Props) {
  const { user } = useSelector((state: RootState) => state.auth);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="kt-card max-w-[440px] w-full">

        <div className="kt-card-content p-10">

          {/* Illustration */}
          <div className="flex justify-center py-10">
            <Image
              src="/assets/media/illustrations/30.svg"
              alt="image"
              width={130}
              height={130}
              className="dark:hidden"
            />
            <Image
              src="/assets/media/illustrations/30-dark.svg"
              alt="image"
              width={130}
              height={130}
              className="light:hidden"
            />
          </div>

          {/* Heading */}
          <h3 className="text-lg font-medium text-mono text-center mb-3">
            Check your email
          </h3>

          {/* Description */}
          <div className="text-sm text-center text-secondary-foreground mb-7.5">
            Please click the link sent to your email{" "}
            <span className="text-sm text-foreground font-medium hover:text-primary">
              {email}
            </span>
            <br />
            to reset your password. Thank you
          </div>

          {/* Button */}
          <div className="flex justify-center mb-5">
            <Link
              href="/signin"
              className="kt-btn kt-btn-primary flex justify-center"
            >
              Sign In
            </Link>
          </div>

          {/* Resend */}
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs text-secondary-foreground">
              Didn’t receive an email?
            </span>
            <span
              className="text-xs font-medium kt-link cursor-pointer"
              onClick={onClose}
            >
              Resend
            </span>
          </div>

        </div>
      </div>

    </div>
  );
}