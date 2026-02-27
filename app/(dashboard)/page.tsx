'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
export default function Dashboard() {
    const router = useRouter();
    const token = localStorage.getItem('token');
    useEffect(() => {
        if (!token) {
            router.replace("/signup");
        } else {
            router.replace("/dashboard");
        }
    }, [token, router]);

    return null;
}