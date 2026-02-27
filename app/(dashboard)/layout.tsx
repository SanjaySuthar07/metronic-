'use client';
import { ReactNode, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';
import { useSettings } from '@/providers/settings-provider';
import { Footer } from './components/footer';
import { Header } from './components/header';
import { Sidebar } from './components/sidebar';

export function Layout({ children }: { children: ReactNode }) {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('/signup');
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    const isMobile = useIsMobile();
    const { settings, setOption } = useSettings();

    useEffect(() => {
        const bodyClass = document.body.classList;
        if (settings.layouts.demo1.sidebarCollapse) {
            bodyClass.add('sidebar-collapse');
        } else {
            bodyClass.remove('sidebar-collapse');
        }
    }, [settings]);

    useEffect(() => {
        setOption('layout', 'demo1');
    }, [setOption]);

    useEffect(() => {
        const bodyClass = document.body.classList;

        bodyClass.add('demo1');
        bodyClass.add('sidebar-fixed');
        bodyClass.add('header-fixed');

        const timer = setTimeout(() => {
            bodyClass.add('layout-initialized');
        }, 1000);

        return () => {
            bodyClass.remove('demo1');
            bodyClass.remove('sidebar-fixed');
            bodyClass.remove('sidebar-collapse');
            bodyClass.remove('header-fixed');
            bodyClass.remove('layout-initialized');
            clearTimeout(timer);
        };
    }, []);

    if (isAuthenticated === null) return null;

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

export default Layout;