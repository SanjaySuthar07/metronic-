'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useIsMobile } from '@/hooks/use-mobile';
import { AppDispatch } from '@/store';

import { getProfile } from '@/store/thunk/auth.thunk';
import { Header } from '../components/layouts/demo1/components/header';
import { Sidebar } from '../components/layouts/demo1/components/sidebar';
import { Footer } from '../components/layouts/demo1/components/footer';

export default function Layout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const isMobile = useIsMobile();
  const [loadingAuth, setLoadingAuth] = useState(true);
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/signin");
        return;
      }

      const result = await dispatch(getProfile());

      if (getProfile.rejected.match(result)) {
        // Check if token still exists — the interceptor may have refreshed it
        const currentToken = localStorage.getItem("token");
        if (!currentToken) {
          // router.replace("/signin");
        } else {
          // Token was refreshed, retry profile fetch
          const retryResult = await dispatch(getProfile());
          if (getProfile.rejected.match(retryResult)) {
            // router.replace("/signin");
          } else {
            setLoadingAuth(false);
          }
        }
      } else {
        setLoadingAuth(false);
      }
    };

    checkAuth();
  }, [dispatch, router]);

  useEffect(() => {
    const bodyClass = document.body.classList;

    bodyClass.add('demo1');
    bodyClass.add('sidebar-fixed');
    bodyClass.add('header-fixed');

    return () => {
      bodyClass.remove('demo1');
      bodyClass.remove('sidebar-fixed');
      bodyClass.remove('header-fixed');
    };
  }, []);

  if (loadingAuth) return null;

  return (
    <>
      {!isMobile && <Sidebar />}

      <div className="wrapper flex grow flex-col">
        <Header />

        <main className="grow pt-5" role="content">
          {children}
        </main>

        <Footer />
      </div>
    </>
  );
}