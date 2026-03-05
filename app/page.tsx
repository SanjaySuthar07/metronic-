'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "@/store/thunk/auth.thunk";
import { AppDispatch } from "@/store";

export default function Home() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((s) => s.auth)

  useEffect(() => {
    const checkAuth = async () => {
      // const token = localStorage.getItem("token");
      // if (!token) {
      //   router.replace("/signup");
      //   return;
      // }
      // let result
      // if (!loading) {
      //   result = await dispatch(getProfile());
      // }
      // if (getProfile.rejected.match(result)) {
      //   router.replace("/signup");
      // } else {
      router.replace("/dashboard");
      // }
    };

    checkAuth();
  }, [dispatch, router]);

  return null;
}