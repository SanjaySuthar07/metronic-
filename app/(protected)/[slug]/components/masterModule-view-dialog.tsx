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
import { Download, FileText, Image, X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/store';
import { moduleDetailsApi, getDetailApi } from '@/store/thunk/dynamicModule.thunk';

import { useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


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
  const { moduleList, getModuleDetailTableData, loading } = useSelector(
    (state: any) => state.dynamicModule
  );

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    if (open) {
      dispatch(moduleDetailsApi(slug));
      if (editData?.id) {
        dispatch(getDetailApi({ slug, id: editData.id }));
      }
    }
  }, [open, editData?.id, slug, dispatch]);

  const detailData = getModuleDetailTableData?.data || null;
  const fieldsMetadata = moduleList?.fields || [];

  const visibleFields = fieldsMetadata.filter((f: any) =>
    Array.isArray(f.visibility) && f.visibility.includes(3)
  );

  const STORAGE_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/api\/?$/, '') + "/storage";

  const renderFieldValue = (field: any) => {
    const value = detailData?.[field.name || field.db_column];
    const type = field.type;

    if (value === null || value === undefined || value === "") return "-";

    // Photos
    if (type === "photo") {
      const images = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-wrap gap-2 mt-1">
          {images.map((img: any, i: number) => {
            const url = typeof img === 'string' ? (img.startsWith('http') ? img : `${STORAGE_URL}/${img}`) : (img.file_url || `${STORAGE_URL}/${img.file_path}`);
            return (
              <img
                key={i}
                src={url}
                className="h-16 w-16 object-cover rounded border cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => window.open(url, '_blank')}
                alt=""
              />
            );
          })}
        </div>
      );
    }

    // Files
    if (type === "file") {
      const files = Array.isArray(value) ? value : [value];
      return (
        <div className="flex flex-col gap-1.5 mt-1">
          {files.map((f: any, i: number) => {
            const url = typeof f === 'string' ? (f.startsWith('http') ? f : `${STORAGE_URL}/${f}`) : (f.file_url || `${STORAGE_URL}/${f.file_path}`);
            const name = typeof f === 'string' ? f.split('/').pop() : (f.file_name || f.file_path?.split('/').pop() || "Download");
            return (
              <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-xs flex items-center gap-1">
                <Download className="size-3" />
                {name}
              </a>
            );
          })}
        </div>
      );
    }

    // Select/Relations (labels from options)
    if (typeof value === 'object' && value.selected !== undefined) {
      const selectedIds = Array.isArray(value.selected) ? value.selected.map(String) : [String(value.selected)];
      const options = value.options || [];
      const labels = options
        .filter((o: any) => selectedIds.includes(String(o.id ?? o.option_value ?? o.value)))
        .map((o: any) => o.name ?? o.option_label ?? o.label);
      return labels.join(', ') || "-";
    }

    // CKEditor / HTML
    if (field.is_ckeditor) {
      return (
        <div className="bg-muted/30 border border-muted-foreground/20 rounded-md p-3 min-h-[80px] overflow-auto ck-content text-sm">
          {parse(String(value))}
        </div>
      );
    }

    // Date
    const isDate = (field.name || field.db_column).includes("date") || (field.name || field.db_column).includes("created_at") || type === "date";
    if (typeof value === 'string' && isDate) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) return d.toLocaleString();
    }

    return String(value);
  };


  const RenderSkeleton = () => (
    <div className="space-y-6 py-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="grid grid-cols-[120px_1fr] gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent showCloseButton={false} className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="capitalize">View {slug || 'Details'}</DialogTitle>
          <DialogDescription>
            Detailed information for the selected {slug || 'record'}.
          </DialogDescription>
        </DialogHeader>
        <X onClick={closeDialog} className='absolute right-4 top-4 cursor-pointer text-muted-foreground hover:text-foreground transition-colors' />

        <ScrollArea className="max-h-[75vh] pr-4">
          {loading ? (
            <RenderSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 py-4">
              {visibleFields.length > 0 ? (
                visibleFields.map((field: any) => {
                  const label = field.label;
                  const isFullWidth = field.is_ckeditor || field.type === "photo" || field.type === "file";

                  return (
                    <div key={field.name || field.db_column} className={`space-y-1.5 ${isFullWidth ? "col-span-full" : ""}`}>
                      <label className="text-sm font-semibold capitalize text-muted-foreground">
                        {label}
                      </label>
                      {field.is_ckeditor || field.type === "photo" || field.type === "file" ? (
                        <div>{renderFieldValue(field)}</div>
                      ) : (
                        <Input
                          value={String(renderFieldValue(field))}
                          readOnly
                          className="bg-muted/50 border-muted-foreground/20"
                        />
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-10 text-center text-muted-foreground">
                  No displayable fields with visibility code '3' found.
                </div>
              )}

              {/* Always show Created At */}
              {detailData?.created_at && (
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold capitalize text-muted-foreground">
                    Created At
                  </label>
                  <Input
                    value={new Date(detailData.created_at).toLocaleString()}
                    readOnly
                    className="bg-muted/50 border-muted-foreground/20"
                  />
                </div>
              )}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};



export default RoleViewDialog;