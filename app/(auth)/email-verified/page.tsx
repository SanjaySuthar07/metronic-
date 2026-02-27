"use client";

import Link from "next/link";
import Image from "next/image";
export default function EmailVerified() {
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="kt-card max-w-[440px] w-full">
                <div className="kt-card-content p-10">
                    <div className="flex justify-center py-10">
                        <Image
                            src="/assets/media/illustrations/Group.svg"
                            alt="image"
                            width={120}
                            height={120}
                        />
                    </div>

                    <h3 className="text-lg font-medium text-mono text-center mb-3">
                        Email Verified Successfully
                    </h3>

                    <div className="text-sm text-center text-secondary-foreground mb-7.5">
                        Your email address has been successfully verified.
                        You can now access your account.
                    </div>

                    <div className="flex justify-center">
                        <Link
                            href="/signin"
                            className="kt-btn kt-btn-primary flex justify-center"
                        >
                            Sign In
                        </Link>
                    </div>

                </div>
            </div>

        </div>
    );
}