'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CheckCircle2, Loader2 } from 'lucide-react';


interface Props {
    oppenQR: boolean;
    setOppenQR: (value: boolean) => void;
    qrCode: string | null;
    userId: number | null;
}
export default function VerifyOtpPage({
    oppenQR,
    setOppenQR,
    qrCode
    // userId
}: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    const handleChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        // Auto focus next
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

        // Focus last filled or last input
        const nextFocus = Math.min(index + digits.length, 5);
        inputRefs.current[nextFocus]?.focus();
    };

    async function handleVerify() {
        const code = otp.join('');
        if (code.length !== 6) return;

        setLoading(true);
        setError('');

        try {
            // → Replace with your real API call
            await new Promise((res) => setTimeout(res, 1400));

            // const res = await fetch('/api/verify-2fa', {
            //   method: 'POST',
            //   body: JSON.stringify({ code, userId }),
            // });

            // if (!res.ok) throw new Error('Invalid code');

            setSuccess(true);

            setTimeout(() => {
                router.push('/'); // or /dashboard
            }, 1800);
        } catch (err) {
            setError('Invalid or expired code. Please try again.');
            setLoading(false);
        }
    }

    if (!oppenQR) { return null }
    return (
        <div className="fixed text-white inset-0 bg-black/80 flex justify-center items-center z-50">
            <div className="p-10">

                {/* Title */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-white">
                        Set up 2-Step Verification
                    </h1>
                    <p className="mt-2 text-sm text-white/80">
                        Scan the QR code with your authenticator app
                    </p>
                </div>

                {/* 2 Column Layout */}
                <div className="grid md:grid-cols-2 gap-10 items-start">

                    {/* LEFT SIDE */}
                    <div className="flex flex-col items-center">
                        <div className="relative w-64 h-64 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
                            {qrCode ? (
                                <img
                                    src={`data:image/svg+xml;base64,${qrCode}`}
                                    alt="2FA QR Code"
                                    className="w-full h-full object-contain p-6"
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white">
                                    QR Loading...
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT SIDE */}
                    <div>

                        {/* Manual Key */}
                        <div className="mb-6 text-center md:text-left">
                            <p className="text-xs text-white mb-2">
                                Can’t scan? Enter this key manually:
                            </p>
                            <div className="font-mono text-sm tracking-wider bg-slate-50 p-3 rounded-lg border border-slate-200 select-all text-black">
                                LKS7-28HS-J910-HAXX-72LA-OHAJ-SCBH
                            </div>
                        </div>

                        {/* OTP */}
                        <div className="mb-4 text-sm font-medium text-white text-center md:text-left">
                            Enter 6-digit code from your authenticator
                        </div>

                        <div className="flex gap-3 justify-center md:justify-start mb-4">
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
                                    className={`text-center text-xl font-semibold h-12 w-12 border-2 rounded-lg transition-all ${error
                                            ? 'border-red-400'
                                            : success
                                                ? 'border-green-400'
                                                : 'border-slate-300 focus:border-blue-500 focus:ring-blue-200'
                                        }`}
                                    disabled={loading || success}
                                />
                            ))}
                        </div>

                        {error && (
                            <p className="text-red-600 text-sm">{error}</p>
                        )}

                    </div>
                </div>

                {/* CONTINUE BUTTON CENTER */}
                <div className="mt-10 flex justify-center">
                    <Button
                        onClick={handleVerify}
                        disabled={loading || success || otp.join('').length !== 6}
                        className="w-56 h-12 text-base font-medium bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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