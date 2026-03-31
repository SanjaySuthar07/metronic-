'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings } from '@/store/thunk/setting.thunk';
import { toBackendUrl } from '@/lib/helpers';

export function DynamicFavicon() {
    const dispatch = useDispatch<any>();
    const { setting } = useSelector((s: any) => s.settings);

    useEffect(() => {
        // Fetch settings if not already loaded to get the latest favicon
        if (!setting || setting.length === 0) {
            dispatch(fetchSettings());
        }
    }, [dispatch, setting]);

    useEffect(() => {
        const faviconValue = setting?.find((item: any) => item.key === 'favicon_icon')?.value;

        if (faviconValue) {
            let finalUrl = toBackendUrl(faviconValue);

            // Append version/timestamp to bypass browser favicon cache (if not a data URL)
            if (!finalUrl.startsWith('data:')) {
                finalUrl += `?v=${Date.now()}`;
            }

            // Find all potential favicon links
            const existingIcons = document.querySelectorAll("link[rel*='icon']");

            if (existingIcons.length > 0) {
                existingIcons.forEach((el) => {
                    (el as HTMLLinkElement).href = finalUrl;
                });
            } else {
                // Create a new link tag if none exist
                const link = document.createElement('link');
                link.rel = 'icon';
                link.href = finalUrl;
                document.getElementsByTagName('head')[0].appendChild(link);
            }
        }
    }, [setting]);

    return null; // This component doesn't render anything
}
