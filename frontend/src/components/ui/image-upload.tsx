'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, X, Image as ImageIcon, Link, Clipboard } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string | null) => void;
  disabled?: boolean;
  maxSizeBytes?: number;
  acceptedFormats?: string[];
  className?: string;
}

const DEFAULT_MAX_SIZE = 5 * 1024 * 1024; // 5MB
const DEFAULT_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// Image compression function
const compressImage = (file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width *= ratio;
        height *= ratio;
      }
      
      canvas.width = width;
      canvas.height = height;
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/webp', quality);
    };
    
    img.src = URL.createObjectURL(file);
  });
};

export function ImageUpload({
  value,
  onChange,
  disabled = false,
  maxSizeBytes = DEFAULT_MAX_SIZE,
  acceptedFormats = DEFAULT_FORMATS,
  className = ''
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = useCallback(async (file: File) => {
    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error(`File size must be less than ${Math.round(maxSizeBytes / 1024 / 1024)}MB`);
      return;
    }

    // Validate file type
    if (!acceptedFormats.includes(file.type)) {
      toast.error(`Only ${acceptedFormats.join(', ')} files are allowed`);
      return;
    }

    setIsUploading(true);

    try {
      // Compress image
      const compressedBlob = await compressImage(file);
      if (!compressedBlob) {
        throw new Error('Failed to compress image');
      }

      // Create compressed file
      const compressedFile = new File([compressedBlob], `compressed-${Date.now()}.webp`, {
        type: 'image/webp'
      });

      // Create preview
      const previewUrl = URL.createObjectURL(compressedFile);
      setPreview(previewUrl);

      // For now, we'll use the preview URL - actual Supabase upload will be handled by parent component
      onChange(previewUrl);
      
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setIsUploading(false);
    }
  }, [maxSizeBytes, acceptedFormats, onChange]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (disabled || isUploading) return;

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [disabled, isUploading, handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  const handleRemove = useCallback(() => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, [onChange]);

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  // Handle paste from clipboard
  const handlePaste = useCallback(async (e: ClipboardEvent) => {
    if (disabled || isUploading || showUrlInput) return;
    
    const items = e.clipboardData?.items;
    if (!items) return;
    
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          await handleFileSelect(file);
        }
        break;
      }
    }
  }, [disabled, isUploading, showUrlInput, handleFileSelect]);

  // Handle URL input
  const handleUrlSubmit = useCallback(async () => {
    if (!urlInput.trim()) return;
    
    setIsUploading(true);
    try {
      // Validate URL format
      const url = new URL(urlInput.trim());
      
      // Fetch the image
      const response = await fetch(url.toString());
      if (!response.ok) {
        throw new Error('Failed to fetch image');
      }
      
      const blob = await response.blob();
      if (!blob.type.startsWith('image/')) {
        throw new Error('URL does not point to an image');
      }
      
      // Create file from blob
      const file = new File([blob], `image-${Date.now()}.${blob.type.split('/')[1]}`, {
        type: blob.type
      });
      
      await handleFileSelect(file);
      setShowUrlInput(false);
      setUrlInput('');
    } catch (error) {
      console.error('Error loading image from URL:', error);
      toast.error('Failed to load image from URL');
    } finally {
      setIsUploading(false);
    }
  }, [urlInput, handleFileSelect]);

  // Setup paste event listener
  useEffect(() => {
    const handlePasteEvent = (e: ClipboardEvent) => handlePaste(e);
    document.addEventListener('paste', handlePasteEvent);
    return () => document.removeEventListener('paste', handlePasteEvent);
  }, [handlePaste]);

  return (
    <div className={`space-y-2 ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer
          ${disabled || isUploading ? 'border-gray-300 bg-gray-50 cursor-not-allowed' : 'border-gray-300 hover:border-gray-400'}
          ${preview ? 'border-solid border-gray-200' : ''}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClick}
      >
        {preview ? (
          <div className="relative">
            <div className="relative w-full h-64 bg-white border-2 border-gray-200 rounded-md overflow-hidden">
              <img
                src={preview}
                alt="Chart Screenshot Preview"
                className="w-full h-full object-contain"
              />
            </div>
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2 shadow-lg"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              disabled={disabled || isUploading}
            >
              <X className="h-4 w-4" />
            </Button>
            {/* Image info overlay */}
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
              Chart Screenshot
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700 block">
                {isUploading ? 'Uploading...' : 'Click to upload or drag and drop'}
              </Label>
              <p className="text-xs text-gray-500">
                PNG, JPG, WebP up to {Math.round(maxSizeBytes / 1024 / 1024)}MB
              </p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowUrlInput(!showUrlInput);
                  }}
                  disabled={disabled || isUploading}
                  className="text-xs"
                >
                  <Link className="h-3 w-3 mr-1" />
                  URL
                </Button>
                <span className="text-xs text-gray-400">or</span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={disabled || isUploading}
                  className="text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    toast.info('Copy an image and paste (Ctrl+V) anywhere on this page');
                  }}
                >
                  <Clipboard className="h-3 w-3 mr-1" />
                  Paste
                </Button>
              </div>
            </div>
          </div>
        )}

        <Input
          ref={fileInputRef}
          type="file"
          accept={acceptedFormats.join(',')}
          onChange={handleInputChange}
          disabled={disabled || isUploading}
          className="hidden"
        />
      </div>

      {/* URL Input Section */}
      {showUrlInput && (
        <div className="space-y-2 p-3 border rounded-lg bg-gray-50">
          <Label className="text-sm font-medium">Image URL</Label>
          <div className="flex gap-2">
            <Input
              type="url"
              placeholder="https://example.com/image.jpg"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              disabled={disabled || isUploading}
              className="flex-1"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleUrlSubmit}
              disabled={disabled || isUploading || !urlInput.trim()}
              size="sm"
            >
              Load
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowUrlInput(false);
                setUrlInput('');
              }}
              disabled={disabled || isUploading}
              size="sm"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}


    </div>
  );
}