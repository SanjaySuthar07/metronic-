'use client';
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { getProfile } from "@/store/thunk/auth.thunk";
import { AppDispatch } from "@/store";
export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/signup");
        return;
      }
      const result = await dispatch(getProfile());
      if (getProfile.rejected.match(result)) {
        router.replace("/signup");
      } else {
        router.replace("/dashboard");
      }
    };

    checkAuth();
  }, [dispatch, router]);

  return null;
}