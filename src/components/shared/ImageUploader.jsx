'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { mediaApi } from '@/lib/api/media';
import { toast } from 'sonner';
import { Upload, X, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ImageUploader({
  value,
  onChange,
  folder = 'images',
  label = 'Upload Gambar',
  description,
  maxSize = 5, // in MB
  className,
}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const maxSizeBytes = maxSize * 1024 * 1024; // Convert MB to bytes

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      // Validate file size
      if (file.size > maxSizeBytes) {
        toast.error(`Ukuran file tidak boleh lebih dari ${maxSize}MB`);
        return;
      }

      setIsUploading(true);
      setUploadProgress(0);

      try {
        // Upload to CDN via site-admin-api
        const response = await mediaApi.uploadToFileServer(
          file,
          folder,
          true, // is_public
          (progress) => setUploadProgress(progress)
        );

        // Get the uploaded file data from response
        const uploadData = response.data || response;
        console.log('Upload response:', uploadData);

        const fileUrl = uploadData.url;
        const filePath = uploadData.file_path || uploadData.path || uploadData.url;
        const fileName = uploadData.file_name || uploadData.filename || file.name;

        console.log('Sending metadata:', {
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_url: fileUrl,
          file_type: 'image',
          file_size: file.size,
        });

        // Save metadata to backend
        await mediaApi.saveMetadata({
          file_name: fileName,
          original_name: file.name,
          file_path: filePath,
          file_url: fileUrl,
          file_type: 'image',
          file_size: file.size,
        });

        onChange(fileUrl);
        toast.success('Gambar berhasil diupload');
      } catch (error) {
        toast.error('Gagal mengupload gambar');
        console.error(error);
      } finally {
        setIsUploading(false);
        setUploadProgress(0);
      }
    },
    [folder, maxSizeBytes, onChange]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    },
    multiple: false,
    disabled: isUploading,
  });

  const removeImage = () => {
    onChange('');
  };

  console.log('ImageUploader value:', value);

  return (
    <div className={cn('space-y-2', className)}>
      {label && <Label>{label}</Label>}
      {description && <p className="text-sm text-gray-500">{description}</p>}

      {value && value !== '' ? (
        <div className="relative w-full max-w-md">
          <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              onError={(e) => {
                console.error('Image preview error:', value);
                toast.error('Gagal memuat preview gambar');
              }}
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={removeImage}
            disabled={isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
            isDragActive
              ? 'border-primary-500 bg-primary-50'
              : 'border-gray-300 hover:border-gray-400',
            isUploading && 'pointer-events-none opacity-50'
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            {isUploading ? (
              <>
                <Loader2 className="h-12 w-12 text-primary-600 animate-spin mb-4" />
                <p className="text-sm text-gray-600 mb-2">
                  Mengupload... {uploadProgress}%
                </p>
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary-600 h-2 rounded-full transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                {isDragActive ? (
                  <p className="text-sm text-gray-600">
                    Drop gambar di sini...
                  </p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-1">
                      Drag & drop gambar di sini, atau klik untuk memilih
                    </p>
                    <p className="text-xs text-gray-500">
                      Maksimal {maxSize}MB (JPG, PNG, WEBP)
                    </p>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
