"use client";

import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
export default function EmailVerified() {
    const searchParams = useSearchParams();
    const status = searchParams.get('status')
    console.log(status)
    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="kt-card max-w-[440px] w-full">
                <div className="kt-card-content p-10">
                    <div className="flex justify-center py-10">
                        <Image
                            src={status == "just_verified" ? "/assets/media/illustrations/Group.svg" :
                                status == "already_verified" ? "/assets/media/illustrations/Group16.svg" : "/assets/media/illustrations/Group18.svg"}
                            alt="image"
                            width={120}
                            height={120}
                        />
                    </div>

                    <h3 className="text-lg font-medium text-mono text-center mb-3">
                        {
                            status == "just_verified" ? "Email Verified Successfully" :
                                status == "already_verified" ? "Email Already Verified" : "Invalid or Expired Link"
                        }
                    </h3>

                    <div className="text-sm text-center text-secondary-foreground mb-7.5">
                        {
                            status == "just_verified" ? "  Your email address has been successfully verified. You can now access your account." :
                                status == "already_verified" ? "  This email has already been verified earlier. You can log in normally." : "This verification link is invalid or has expired. Please request a new verification email."
                        }

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