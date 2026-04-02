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
} from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    FileArchiveIcon,
    FileSpreadsheetIcon,
    FileTextIcon,
    HeadphonesIcon,
    ImageIcon,
    TriangleAlert,
    UploadIcon,
    VideoIcon,
    XIcon,
} from 'lucide-react';
import Cropper from 'react-easy-crop';
import getCroppedImg from '@/lib/image-crop-utils';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface FileUploadItem extends FileWithPreview {
    progress: number;
    status: 'uploading' | 'completed' | 'error';
    error?: string;
}

interface FormFilesUploadProps {
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

export function FormFilesUpload({
    maxFiles = 10,
    maxSize = 25 * 1024 * 1024, // 25MB
    accept = '*/*',
    multiple = true,
    onFilesChange,
    simulateUpload = false,
    title = 'Files Upload',
    showCard = true,
    initialFiles = [],
}: FormFilesUploadProps) {
    const [uploadFiles, setUploadFiles] = useState<FileUploadItem[]>([]);

    useEffect(() => {
        if (initialFiles.length > 0) {
            const currentPreviews = uploadFiles.map((f) => f.preview).join('|');
            const newPreviews = initialFiles.map((f) => f.url).join('|');

            if (currentPreviews !== newPreviews) {
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
        } else if (uploadFiles.length === 0) {
            setUploadFiles([]);
        }
    }, [initialFiles]);

    const [
        { isDragging, errors },
        {
            removeFile,
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
            // In single file mode, handle cropping for images first
            if (!multiple && maxFiles === 1 && newFiles.length > 0) {
                const file = newFiles[0].file;
                if (
                    file instanceof File &&
                    file.type.startsWith('image/') &&
                    file.type !== 'image/svg+xml'
                ) {
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
                    return { ...file, progress: 100, status: 'completed' as const };
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
    const [aspect, setAspect] = useState<number | undefined>(1);
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
                const croppedFile = new File(
                    [croppedImageBlob],
                    (fileToCrop.file as File).name.replace(/\.[^/.]+$/, '') + '.jpg',
                    { type: 'image/jpeg' }
                );

                const previewUrl = URL.createObjectURL(croppedImageBlob);
                const newFile = {
                    id: fileToCrop.id,
                    file: croppedFile,
                    preview: previewUrl,
                };

                setUploadFiles([{ ...newFile, progress: 100, status: 'completed' as const }]);
                onFilesChange?.([newFile]);
            }
            setShowCropper(false);
            setFileToCrop(null);
        }
    };

    const removeUploadFile = (fileId: string) => {
        setUploadFiles((prev) => prev.filter((file) => file.id !== fileId));
        removeFile(fileId);
    };

    const getFileIcon = (file: File | FileMetadata) => {
        const type = file instanceof File ? file.type : file.type;
        const name = file instanceof File ? file.name : file.name;
        const extension = name.split('.').pop()?.toLowerCase() || '';

        if (type.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) return <ImageIcon className="size-4" />;
        if (type.startsWith('video/') || ['mp4', 'avi', 'mov', 'wmv'].includes(extension)) return <VideoIcon className="size-4" />;
        if (type.startsWith('audio/') || ['mp3', 'wav', 'ogg'].includes(extension)) return <HeadphonesIcon className="size-4" />;
        if (type.includes('pdf') || extension === 'pdf') return <FileTextIcon className="size-4" />;
        if (type.includes('word') || type.includes('doc') || ['doc', 'docx'].includes(extension)) return <FileTextIcon className="size-4" />;
        if (type.includes('excel') || type.includes('sheet') || ['xls', 'xlsx', 'csv'].includes(extension)) return <FileSpreadsheetIcon className="size-4" />;
        if (type.includes('zip') || type.includes('rar') || ['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return <FileArchiveIcon className="size-4" />;
        return <FileTextIcon className="size-4" />;
    };

    const content = (
        <CardContent className={cn('space-y-5', !showCard && 'p-0')}>
            {/* Upload Area */}
            <div
                className={cn(
                    'relative rounded-lg border border-dashed p-4 text-center transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-muted-foreground/50'
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
                            'flex h-12 w-12 items-center justify-center rounded-full cursor-pointer',
                            isDragging ? 'bg-primary/10' : 'bg-muted'
                        )}
                        onClick={openFileDialog}
                    >
                        <UploadIcon
                            className={cn('h-6', isDragging ? 'text-primary' : 'text-muted-foreground')}
                        />
                    </div>

                    <div className="space-y-1">
                        <h3 className="text-base font-semibold text-muted-foreground/80">
                            Upload your files
                        </h3>
                        <p className="text-xs text-muted-foreground">
                            Drag and drop files here or click to browse
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 leading-tight">
                            Support for {multiple ? 'multiple files' : 'a single file'} up to{' '}
                            {formatBytes(maxSize)} {multiple && 'each'}
                        </p>
                    </div>

                    <Button type="button" onClick={openFileDialog}>
                        <UploadIcon className="mr-2 h-4 w-4" />
                        Select files
                    </Button>
                </div>
            </div>

            {/* File List */}
            {uploadFiles.length > 0 && (
                <div className="space-y-3">
                    {uploadFiles.map((fileItem) => {
                        const type = fileItem.file instanceof File ? fileItem.file.type : fileItem.file.type;
                        const name = fileItem.file.name;
                        const isImage = type?.startsWith('image/') || /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(name);

                        return (
                            <div key={fileItem.id} className="rounded-lg border border-border bg-card p-4">
                                <div className="flex items-start gap-2.5">
                                    {/* File Icon */}
                                    <div className="flex-shrink-0">
                                        {fileItem.preview && isImage ? (
                                            <img
                                                src={fileItem.preview}
                                                alt={fileItem.file.name}
                                                className="h-12 w-12 object-cover rounded-lg border"
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
                                                <span className="text-sm truncate max-w-[200px] sm:max-w-xs">{fileItem.file.name}</span>
                                                <span className="text-xs text-muted-foreground">
                                                    {formatBytes(fileItem.file.size)}
                                                </span>
                                            </p>
                                            <div className="flex items-center gap-2">
                                                {/* Remove Button - Now working */}
                                                <Button
                                                    onClick={() => removeUploadFile(fileItem.id)}
                                                    variant="ghost"
                                                    type="button"
                                                    size="icon"
                                                    className="size-6 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                                >
                                                    <XIcon className="size-4" />
                                                </Button>
                                            </div>
                                        </div>

                                        {fileItem.status === 'uploading' && (
                                            <div className="mt-2">
                                                <Progress value={fileItem.progress} className="h-1" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Error Messages */}
            {errors.length > 0 && (
                <Alert variant="destructive">
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
                                        variant={cropShape === 'rect' && aspect === 1 ? 'default' : 'ghost'}
                                        onClick={() => { setCropShape('rect'); setAspect(1); }}
                                        className="h-8 px-3 text-xs"
                                    >
                                        Square
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={cropShape === 'round' ? 'default' : 'ghost'}
                                        onClick={() => { setCropShape('round'); setAspect(1); }}
                                        className="h-8 px-3 text-xs"
                                    >
                                        Circle
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={cropShape === 'rect' && aspect === 16 / 9 ? 'default' : 'ghost'}
                                        onClick={() => { setCropShape('rect'); setAspect(16 / 9); }}
                                        className="h-8 px-3 text-xs"
                                    >
                                        Wide
                                    </Button>
                                    <Button
                                        type="button"
                                        size="sm"
                                        variant={aspect === undefined && cropShape === 'rect' ? 'default' : 'ghost'}
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
