'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import parse from "html-react-parser";

import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X } from 'lucide-react';

const RoleViewDialog = ({
  open,
  closeDialog,
  editData,
  slug,
  fields = [],
}: {
  open: boolean;
  closeDialog: () => void;
  editData: any;
  slug?: string;
  fields?: any[];
}) => {
  const visibleFields = (fields || []).filter((f: any) =>
    Array.isArray(f.visibility) && f.visibility.includes(3)
  );

  const formatValue = (key: string, value: any) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === 'string' && (key.includes("date") || key.includes("created_at") || /^\d{4}-\d{2}-\d{2}/.test(value))) {
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        return `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      }
    }
    if (typeof value === 'string' && (key.includes("description") || key.includes("content") || key.includes("body"))) {
      return parse(value);
    }
    return String(value);
  };

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false} className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">View {slug || 'Details'}</DialogTitle>
          <DialogDescription>
            Detailed information for the selected {slug || 'record'}.
          </DialogDescription>
        </DialogHeader>
        <X onClick={closeDialog} className='absolute right-4 top-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors' />

        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            {visibleFields.length > 0 ? (
              visibleFields.map((field) => {
                const key = field.db_column;
                const label = field.label;
                const formatted = formatValue(key, editData[key]);
                const isHtml = typeof formatted === 'object' && formatted !== null;

                return (
                  <div key={key} className={`space-y-1.5 ${isHtml ? "col-span-full" : ""}`}>
                    <label className="text-sm font-semibold capitalize text-muted-foreground">
                      {label}
                    </label>
                    {isHtml ? (
                      <div className="bg-muted/50 border border-muted-foreground/20 rounded-md p-3 min-h-[100px] overflow-auto ck-content">
                        {formatted}
                      </div>
                    ) : (
                      <Input
                        value={String(formatted)}
                        readOnly
                        className="bg-muted/50 border-muted-foreground/20"
                      />
                    )}
                  </div>
                );
              })
            ) : fields.length === 0 && editData ? (
              // Fallback if no metadata
              Object.keys(editData)
                .filter(k => !['id', 'updated_at', 'deleted_at', 'tenant_id'].includes(k))
                .map((key) => {
                  const formatted = formatValue(key, editData[key]);
                  const isHtml = typeof formatted === 'object' && formatted !== null;

                  return (
                    <div key={key} className={`space-y-1.5 ${isHtml ? "col-span-full" : ""}`}>
                      <label className="text-sm font-semibold capitalize text-muted-foreground">
                        {key.replaceAll("_", " ")}
                      </label>
                      {isHtml ? (
                        <div className="bg-muted/50 border border-muted-foreground/20 rounded-md p-3 min-h-[100px] overflow-auto ck-content text-sm">
                          {formatted}
                        </div>
                      ) : (
                        <Input
                          value={String(formatted)}
                          readOnly
                          className="bg-muted/50 border-muted-foreground/20"
                        />
                      )}
                    </div>
                  );
                })
            ) : (
              <div className="col-span-full py-10 text-center text-muted-foreground">
                No displayable data found.
              </div>
            )}

            {/* Always show Created At if available */}
            {editData?.created_at && (
              <div className="space-y-1.5">
                <label className="text-sm font-semibold capitalize text-muted-foreground">
                  Created At
                </label>
                <Input
                  value={formatValue("created_at", editData.created_at) as string}
                  readOnly
                  className="bg-muted/50 border-muted-foreground/20"
                />
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default RoleViewDialog;