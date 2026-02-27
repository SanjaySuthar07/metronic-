'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
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