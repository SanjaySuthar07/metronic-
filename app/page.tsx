'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/signup");
    } else {
      router.replace("/changePassword");
    }
  }, [isAuthenticated, router]);

  return null;
}