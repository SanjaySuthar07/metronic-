'use client';

import { BasicSettings, FilesUpload } from './components';

export function AccountSettingsPlainContent() {
  return (
    <div className="grid gap-5 lg:gap-7.5  mx-auto">
      <BasicSettings title="General Settings" />
    </div>
  );
}
