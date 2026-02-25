"use client";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
const img = "/assets/media/illustrations/30.svg"
interface Props {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

export default function VerifyEmailModal({ isOpen, onClose, email, }: Props) {
    const { user } = useSelector((state: RootState) => state.auth);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl w-full max-w-md p-8 relative">
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
                    <span className="font-medium  text-black ">
                        {email}
                    </span>
                    <br />
                    to verify your account. Thank you
                </p>

                <div className="flex justify-center gap-3">
                    <Link
                        href="/signin"
                        className="kt-btn kt-btn-primary flex justify-center"
                    >
                        Sign In
                    </Link>
                </div>

                <div className="text-center mt-4 text-sm">
                    Didn’t receive an email?{" "}
                    <span
                        className="kt-link font-medium"
                        onClick={() => onClose()}
                    >
                        Resend
                    </span>
                </div>

            </div>
        </div>
    );
}