'use client';

import { useEffect, useState } from 'react';
import {
  formatBytes,
  useFileUpload,
  type FileMetadata,
  type FileWithPreview,
} from '@/hooks/use-file-upload';
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertToolbar,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  FileArchiveIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  HeadphonesIcon,
  ImageIcon,
  RefreshCwIcon,
  TriangleAlert,
  UploadIcon,
  VideoIcon,
  XIcon,
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/image-crop-utils';
import { toAbsoluteUrl } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadItem extends FileWithPreview {
  progress: number;
  status: 'uploading' | 'completed' | 'error';
  error?: string;
}

interface ProgressUploadProps {
  maxFiles?: number;
  maxSize?: number;
  accept?: string;
  multiple?: boolean;
  className?: string;
  onFilesChange?: (files: FileWithPreview[]) => void;
  simulateUpload?: boolean;
  title?: string;
  showCard?: boolean;
  initialFiles?: FileMetadata[];
}

export function FilesUpload({
  maxFiles = 5,
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = 'image/*',
  multiple = false,
  onFilesChange,
  simulateUpload = true,
  title = "Files Upload",
  showCard = true,
  initialFiles = [],
}: ProgressUploadProps) {
  // Convert initial files to FileUploadItem format
  const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

  useEffect(() => {
    if (initialFiles.length > 0) {
      setUploadFiles(
        initialFiles.map((image) => ({
          id: image.id,
          file: {
            name: image.name,
            size: image.size,
            type: image.type,
          } as File,
          preview: image.url,
          progress: 100,
          status: 'completed' as const,
        }))
      );
    }
  }, [initialFiles]);

  const [
    { isDragging, errors },
    {
      removeFile,
      clearFiles,
      handleDragEnter,
      handleDragLeave,
      handleDragOver,
      handleDrop,
      openFileDialog,
      getInputProps,
    },
  ] = useFileUpload({
    maxFiles,
    maxSize,
    accept,
    multiple,
    initialFiles,
    onFilesChange: (newFiles) => {
      // In single file mode, we'll handle cropping first if it's an image
      if (maxFiles === 1 && newFiles.length > 0) {
        const file = newFiles[0].file;
        if (file instanceof File && file.type.startsWith('image/')) {
          setFileToCrop(newFiles[0]);
          setShowCropper(true);
          return; // Wait for crop
        }
      }

      const newUploadFiles = newFiles.map((file) => {
        const existingFile = uploadFiles.find((existing) => existing.id === file.id);
        if (existingFile) {
          return { ...existingFile, ...file };
        } else {
          return { ...file, progress: 0, status: 'uploading' as const };
        }
      });
      setUploadFiles(newUploadFiles);
      onFilesChange?.(newFiles);
    },
  });

  // Cropper State
  const [showCropper, setShowCropper] = useState(false);
  const [fileToCrop, setFileToCrop] = useState<FileWithPreview | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState<number | undefined>(1); // Default to square
  const [cropShape, setCropShape] = useState<'rect' | 'round'>('rect');
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  const onCropComplete = (croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    if (fileToCrop && croppedAreaPixels) {
      const croppedImageBlob = await getCroppedImg(
        fileToCrop.preview!,
        croppedAreaPixels
      );

      if (croppedImageBlob) {
        const croppedFile = new File([croppedImageBlob], (fileToCrop.file as File).name.replace(/\.[^/.]+$/, "") + ".jpg", {
          type: 'image/jpeg',
        });

        // Convert blob to base64 for persistent storage in form
        const reader = new FileReader();
        reader.readAsDataURL(croppedImageBlob);
        reader.onloadend = () => {
          const base64data = reader.result as string;
          const newFile = {
            id: fileToCrop.id,
            file: croppedFile,
            preview: base64data, // Use base64 instead of blob URL
          };

          setUploadFiles([{ ...newFile, progress: 100, status: 'completed' as const }]);
          onFilesChange?.([newFile]);
        };
      }
      setShowCropper(false);
      setFileToCrop(null);
    }
  };

  // Simulate upload progress
  useEffect(() => {
    if (!simulateUpload) return;

    const interval = setInterval(() => {
      setUploadFiles((prev) =>
        prev.map((file) => {
          if (file.status !== 'uploading') return file;

          const increment = Math.random() * 15 + 5; // 5-20% increment
          const newProgress = Math.min(file.progress + increment, 100);

          // Simulate occasional errors (10% chance when progress > 50%)
          if (newProgress > 50 && Math.random() < 0.1) {
            return {
              ...file,
              status: 'error' as const,
              error: 'Upload failed. Please try again.',
            };
          }

          // Complete when progress reaches 100%
          if (newProgress >= 100) {
            return {
              ...file,
              progress: 100,
              status: 'completed' as const,
            };
          }

          return {
            ...file,
            progress: newProgress,
          };
        }),
      );
    }, 500);

    return () => clearInterval(interval);
  }, [simulateUpload]);

  const retryUpload = (fileId: string) => {
    setUploadFiles((prev) =>
      prev.map((file) =>
        file.id === fileId
          ? {
            ...file,
            progress: 0,
            status: 'uploading' as const,
            error: undefined,
          }
          : file,
      ),
    );
  };

  const removeUploadFile = (fileId: string) => {
    setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
    removeFile(fileId);
  };

  const getFileIcon = (file: File | FileMetadata) => {
    const type = file instanceof File ? file.type : file.type;
    if (type.startsWith('image/')) return <ImageIcon className="size-4" />;
    if (type.startsWith('video/')) return <VideoIcon className="size-4" />;
    if (type.startsWith('audio/')) return <HeadphonesIcon className="size-4" />;
    if (type.includes('pdf')) return <FileTextIcon className="size-4" />;
    if (type.includes('word') || type.includes('doc')) return <FileTextIcon className="size-4" />;
    if (type.includes('excel') || type.includes('sheet')) return <FileSpreadsheetIcon className="size-4" />;
    if (type.includes('zip') || type.includes('rar')) return <FileArchiveIcon className="size-4" />;
    return <FileTextIcon className="size-4" />;
  };

  const completedCount = uploadFiles.filter((f) => f.status === 'completed').length;
  const errorCount = uploadFiles.filter((f) => f.status === 'error').length;
  const uploadingCount = uploadFiles.filter((f) => f.status === 'uploading').length;

  const content = (
    <CardContent className={cn("space-y-5", !showCard && "p-0")}>
      {/* Upload Area */}
      <div
        className={cn(
          'relative rounded-lg border border-dashed p-4 text-center transition-colors',
          isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25 hover:border-muted-foreground/50',
        )}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input {...getInputProps()} className="sr-only" />

        <div className="flex flex-col items-center gap-4">
          <div
            className={cn(
              'flex h-12 w-12 items-center justify-center rounded-full',
              isDragging ? 'bg-primary/10' : 'bg-muted',
            )}
          >
            <UploadIcon className={cn('h-6', isDragging ? 'text-primary' : 'text-muted-foreground')} />
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-semibold text-muted-foreground/80">Upload your files</h3>
            <p className="text-xs text-muted-foreground">Drag and drop files here or click to browse</p>
            <p className="text-[10px] text-muted-foreground/60 leading-tight">
              Support for multiple file types up to {formatBytes(maxSize)} each
            </p>
          </div>

          <Button type="button" onClick={openFileDialog}>
            <UploadIcon />
            Select files
          </Button>
        </div>
      </div>

      {/* Upload Stats */}
      {/* {uploadFiles.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-medium">Upload Progress</h4>
            <div className="flex items-center gap-2">
              {completedCount > 0 && (
                <Badge size="sm" variant="success" appearance="light">
                  Completed: {completedCount}
                </Badge>
              )}
              {errorCount > 0 && (
                <Badge size="sm" variant="destructive" appearance="light">
                  Failed: {errorCount}
                </Badge>
              )}
              {uploadingCount > 0 && (
                <Badge size="sm" variant="secondary">
                  Uploading: {uploadingCount}
                </Badge>
              )}
            </div>
          </div>

          <Button type="button" onClick={clearFiles} variant="outline" size="sm">
            Clear all
          </Button>
        </div>
      )} */}

      {/* File List */}
      {uploadFiles.length > 0 && (
        <div className="space-y-3">
          {uploadFiles.map((fileItem) => (
            <div key={fileItem.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start gap-2.5">
                {/* File Icon */}
                <div className="flex-shrink-0">
                  {fileItem.preview && fileItem.file.type.startsWith('image/') ? (
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="h-12 w-12 rounded-lg border object-cover"
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border text-muted-foreground">
                      {getFileIcon(fileItem.file)}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between mt-0.75">
                    <p className="inline-flex flex-col justify-center gap-1 truncate font-medium">
                      <span className="text-sm">{fileItem.file.name}</span>
                      <span className="text-xs text-muted-foreground">{formatBytes(fileItem.file.size)}</span>
                    </p>
                    <div className="flex items-center gap-2">
                      {/* Remove Button */}
                      <Button
                        onClick={() => removeUploadFile(fileItem.id)}
                        variant="ghost"
                        type="button"
                        size="icon"
                        className="size-6 text-muted-foreground hover:opacity-100 hover:bg-transparent"
                      >
                        <XIcon className="size-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileItem.status === 'uploading' && (
                    <div className="mt-2">
                      <Progress value={fileItem.progress} className="h-1" />
                    </div>
                  )}

                  {/* Error Message */}
                  {fileItem.status === 'error' && fileItem.error && (
                    <Alert variant="destructive" appearance="light" className="items-center gap-1.5 mt-2 px-2 py-1">
                      <AlertIcon>
                        <TriangleAlert className="size-4!" />
                      </AlertIcon>
                      <AlertTitle className="text-xs">{fileItem.error}</AlertTitle>
                      <AlertToolbar>
                        <Button
                          type="button"
                          onClick={() => retryUpload(fileItem.id)}
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:opacity-100 hover:bg-transparent"
                        >
                          <RefreshCwIcon className="size-3.5" />
                        </Button>
                      </AlertToolbar>
                    </Alert>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error Messages */}
      {errors.length > 0 && (
        <Alert variant="destructive" appearance="light">
          <AlertIcon>
            <TriangleAlert />
          </AlertIcon>
          <AlertContent>
            <AlertTitle>File upload error(s)</AlertTitle>
            <AlertDescription>
              {errors.map((error, index) => (
                <p key={index} className="last:mb-0">
                  {error}
                </p>
              ))}
            </AlertDescription>
          </AlertContent>
        </Alert>
      )}

      {/* Cropper Modal */}
      {showCropper && fileToCrop && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-xl bg-background shadow-2xl">
            <div className="flex items-center justify-between border-b p-4">
              <h3 className="text-lg font-semibold">Crop Image</h3>
              <Button size="icon" variant="ghost" onClick={() => setShowCropper(false)}>
                <XIcon className="size-5" />
              </Button>
            </div>
            <div className="relative h-[400px] bg-muted w-full">
              <Cropper
                image={fileToCrop.preview}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                cropShape={cropShape}
                showGrid={true}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
            <div className="flex flex-col gap-4 border-t p-4 pb-6">
              {/* Aspect Ratio & Shape Selection */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 border rounded-lg p-1 bg-muted/50">
                  <Button
                    type="button"
                    size="sm"
                    variant={cropShape === 'rect' && aspect === 1 ? 'primary' : 'ghost'}
                    onClick={() => { setCropShape('rect'); setAspect(1); }}
                    className="h-8 px-3 text-xs"
                  >
                    Square
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={cropShape === 'round' ? 'primary' : 'ghost'}
                    onClick={() => { setCropShape('round'); setAspect(1); }}
                    className="h-8 px-3 text-xs"
                  >
                    Circle
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={cropShape === 'rect' && aspect === 16 / 9 ? 'primary' : 'ghost'}
                    onClick={() => { setCropShape('rect'); setAspect(16 / 9); }}
                    className="h-8 px-3 text-xs"
                  >
                    Wide
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={aspect === undefined ? 'primary' : 'ghost'}
                    onClick={() => { setCropShape('rect'); setAspect(undefined); }}
                    className="h-8 px-3 text-xs"
                  >
                    Free
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Zoom</span>
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCropper(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleCropSave}>
                  Save & Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CardContent>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card className="pb-2.5">
      <CardHeader id="files_upload">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      {content}
    </Card>
  );
}
