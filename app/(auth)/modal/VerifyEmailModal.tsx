"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    email: string;
}

export default function VerifyEmailModal({
    isOpen,
    onClose,
    email,
}: Props) {
    const router = useRouter()
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex justify-center items-center z-50">
            <div className="kt-card max-w-[430px] w-full relative bg-white dark:bg-slate-900">
                <div className="kt-card-content p-10">
                    <div className="flex justify-center py-6">
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
                    <h3 className="text-lg font-medium text-mono text-center mb-3">
                        Check your email
                    </h3>
                    <div className="text-sm text-center text-secondary-foreground mb-7.5">
                        Please click the link sent to your email{" "}
                        <span className="text-mono font-medium">
                            {email}
                        </span>
                        <br />
                        to verify your account. Thank you
                    </div>

                    <div className="flex justify-center mb-5">
                        <Button onClick={() => router.push("signin")}>
                            Sign In
                        </Button>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-2sm">
                        <span className="text-secondary-foreground">
                            Didn’t receive an email?
                        </span>
                        <span
                            className="kt-link font-semibold  text-primary cursor-pointer"
                            onClick={() => onClose()}
                        >
                            Resend
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}