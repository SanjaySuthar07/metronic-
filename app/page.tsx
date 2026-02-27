'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace("/signup");
    } else {
      router.replace("/dashboard");
    }
  }, [router]);

  return null;
}