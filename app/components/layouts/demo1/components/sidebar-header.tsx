'use client';

import Link from 'next/link';
import { useSettings } from '@/providers/settings-provider';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSettings } from '@/store/thunk/setting.thunk';
import { toAbsoluteUrl, toBackendUrl } from '@/lib/helpers';

export function SidebarHeader() {
  const { settings, storeOption } = useSettings();
  const dispatch = useDispatch<any>();
  const { setting } = useSelector((s: any) => s.settings);

  useEffect(() => {
    if (!setting || setting.length === 0) {
      dispatch(fetchSettings());
    }
  }, [dispatch, setting]);

  const getSetting = (key: string) => {
    return setting?.find((item: any) => item.key === key)?.value || "";
  };

  const logo = getSetting('logo') || '/media/app/default-logo.svg';
  const miniLogo = getSetting('mini_logo') || '/media/app/mini-logo.svg';
  const logoDark = getSetting('default_logo_dark') || '/media/app/default-logo-dark.svg';
  const miniLogoDark = getSetting('mini_logo_dark') || '/media/app/mini-logo.svg';

  const handleToggleClick = () => {
    storeOption(
      'layouts.demo1.sidebarCollapse',
      !settings.layouts.demo1.sidebarCollapse,
    );
  };

  const renderLogo = (url: string, className: string, alt: string) => {
    const isStatic = url.startsWith('/media/');
    const finalUrl = isStatic ? toAbsoluteUrl(url) : toBackendUrl(url);
    return (
      <img
        src={finalUrl}
        className={className}
        alt={alt}
      />
    );
  };

  return (
    <div className="sidebar-header hidden lg:flex items-center relative justify-between px-3 lg:px-6">
      <Link href="/">
        <div className="dark:hidden">
          {renderLogo(logo, "default-logo h-[22px] w-full object-contain", "Default Logo")}
          {renderLogo(miniLogo, "small-logo h-[22px] w-full object-contain", "Mini Logo")}
        </div>
        <div className="hidden dark:block">
          {renderLogo(logoDark, "default-logo h-[22px] w-full object-contain", "Default Dark Logo")}
          {renderLogo(miniLogoDark, "small-logo h-[22px] w-full object-contain", "Mini Logo")}
        </div>
      </Link>
    </div>
  );
}
