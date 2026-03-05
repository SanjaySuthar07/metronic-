'use client';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { verifyMfa } from '@/store/thunk/auth.thunk';
import Image from 'next/image';
import { RiCloseFill } from '@remixicon/react';
interface Props {
    oppenQR: boolean;
    onClose: () => void;
    qrCode: string | null;
    userId: number | null;
    message: string,
    userType: string,
}
export default function VerifyOtpPage({
    oppenQR,
    onClose,
    qrCode,
    message,
    userId,
    userType,
}: Props) {
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (
        e: React.KeyboardEvent<HTMLInputElement>,
        index: number
    ) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };
    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>, index: number) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').trim();
        if (!/^\d{1,6}$/.test(paste)) return;

        const digits = paste.split('').slice(0, 6 - index);
        const newOtp = [...otp];

        digits.forEach((d, i) => {
            if (index + i < 6) newOtp[index + i] = d;
        });

        setOtp(newOtp);

        const nextFocus = Math.min(index + digits.length, 5);
        inputRefs.current[nextFocus]?.focus();
    };

    async function handleVerify() {
        const code = otp.join('');
        if (code.length !== 6 || !userId) return;

        setLoading(true);
        setError('');

        const result = await dispatch(
            verifyMfa({
                user_id: userId,
                otp: Number(code),
                user_type: userType,
            })
        );

        if (verifyMfa.fulfilled.match(result)) {
            setSuccess(true);

            setTimeout(() => {
                onClose()
                router.push('/');
            }, 1200);
        } else {
            setError(result.payload as string);
            setLoading(false);
        }
    }

    if (!oppenQR) { return null }
    return (
        <div className="fixed inset-0 bg-black/70 dark:bg-black/80 flex justify-center items-center z-50">
            <div className="kt-card max-w-[430px] w-full relative bg-white dark:bg-slate-900">
                <span className="float-right m-3 cursor-pointer" onClick={onClose}>
                    <RiCloseFill></RiCloseFill>
                </span>
                <div className="kt-card-content p-10">
                    <div className="text-center flex flex-col justify-center items-center">
                        {qrCode ? ("") :
                            (<Image
                                src="/assets/auth/2FAsmartphone.svg"
                                alt="image"
                                width={130}
                                height={130}
                                className="mt-5 mb-5"
                            />)}
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                            {qrCode ? "Set up" : ""}  2FA Verification Code
                        </h1>
                        <p className="mt-5 mb-5 text-sm text-gray-600 dark:text-gray-300">
                            {message}
                        </p>
                    </div>
                    <div className="px-8">
                        {qrCode ? (
                            <div className="relative mx-auto w-64 h-64 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner overflow-hidden">
                                {success && (
                                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-20 animate-fade-in">
                                        <div className="text-center">
                                            <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 animate-scale-in" />
                                            <p className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                                                Verification Successful!
                                            </p>
                                        </div>
                                    </div>
                                )}
                                {!success && !loading && (
                                    <div className="absolute inset-0 z-10 pointer-events-none">
                                        <div className="scan-line" />
                                    </div>
                                )}
                                <img
                                    src={`data:image/svg+xml;base64,${qrCode}`}
                                    alt="2FA QR Code"
                                    className="w-full h-full object-contain p-4"
                                />
                            </div>
                        )
                            : ("")}
                        <div className="px-8">
                            <div className="mt-5 mb-5 text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                                {qrCode ? "Enter 6-digit code from your authenticator" : ""}
                            </div>

                            <div className="flex gap-3 justify-center mb-6">
                                {otp.map((digit, i) => (
                                    <Input
                                        key={i}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) => handleChange(i, e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, i)}
                                        onPaste={(e) => handlePaste(e, i)}
                                        ref={(el) => (inputRefs.current[i] = el)}
                                        className={`text-center text-2xl font-semibold h-14 w-14 border-2 transition-all
${error
                                                ? 'border-red-400 focus:border-red-500'
                                                : success
                                                    ? 'border-green-400'
                                                    : 'border-slate-300 dark:border-slate-700 focus:border-blue-500 focus:ring-blue-200'
                                            }dark:bg-slate-800 dark:text-white rounded-lg`}
                                        disabled={loading || success}
                                    />
                                ))}
                            </div>

                            {error && (
                                <p className="text-red-600 text-sm text-center mb-4">{error}</p>
                            )}

                            <Button
                                onClick={handleVerify}
                                disabled={loading || success || otp.join('').length !== 6}
                                className="w-full h-12 text-white font-medium bg-primary"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Verifying...
                                    </>
                                ) : success ? (
                                    'Verified!'
                                ) : (
                                    'Continue'
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            {/* <style jsx global>{`
        .scan-line {
          position: absolute;
          width: 100%;
          height: 4px;
          background: linear-gradient(
            to right,
            transparent,
            rgba(59, 130, 246, 0.7),
            transparent
          );
          box-shadow: 0 0 12px rgba(59, 130, 246, 0.5);
          animation: scan 2.2s linear infinite;
        }

        @keyframes scan {
          0% {
            top: -10%;
          }
          100% {
            top: 110%;
          }
        }

        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }

        @keyframes scale-in {
          from {
            transform: scale(0.6);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-scale-in {
          animation: scale-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style> */}
        </div>
    );
}