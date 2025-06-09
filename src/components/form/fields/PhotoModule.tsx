import React, { useState, useRef, useCallback } from 'react';
import { supabase } from '@/config/supabaseClient';
import { MODULE_CONSTRAINTS } from '@/config/moduleConstraints';
import { logger } from '@/utils/logger';
import '@/styles/components/photo-module.css';

interface PhotoModuleProps {
  moduleData: any;
  moduleDefinition: any;
  onChange: (moduleData: any) => void;
}

interface PhotoEntry {
  id: string;
  storageUrl: string;
  thumbnailUrl: string;
  caption: string;
  timestamp: string;
  fileSize: number;
  compressed: boolean;
  originalFileName?: string;
  blobUrl?: string; // For immediate preview
  uploading?: boolean;
  uploadProgress?: number;
}

export const PhotoModule: React.FC<PhotoModuleProps> = ({
  moduleData,
  moduleDefinition,
  onChange,
}) => {
  const photos: PhotoEntry[] = moduleData?.photos || [];
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessingMultiple, setIsProcessingMultiple] = useState(false);

  const maxPhotos = MODULE_CONSTRAINTS.photos.maxPhotos;
  const maxFileSize = MODULE_CONSTRAINTS.photos.maxFileSize;
  const allowedTypes = MODULE_CONSTRAINTS.photos.allowedTypes;

  // Generate unique photo ID
  const generatePhotoId = (): string => {
    return `photo_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Compress image client-side
  const compressImage = useCallback((file: File): Promise<File> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // Calculate new dimensions (max 1920x1080)
        let { width, height } = img;
        const maxWidth = 1920;
        const maxHeight = 1080;

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress
        ctx?.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          blob => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          'image/jpeg',
          MODULE_CONSTRAINTS.photos.compressionQuality
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Generate thumbnail
  const generateThumbnail = useCallback((file: File): Promise<string> => {
    return new Promise(resolve => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        const size = 200; // 200x200 thumbnail
        canvas.width = size;
        canvas.height = size;

        // Calculate crop dimensions for square thumbnail
        const { width, height } = img;
        const minDim = Math.min(width, height);
        const sx = (width - minDim) / 2;
        const sy = (height - minDim) / 2;

        ctx?.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);

        canvas.toBlob(
          blob => {
            if (blob) {
              resolve(URL.createObjectURL(blob));
            } else {
              resolve('');
            }
          },
          'image/jpeg',
          0.8
        );
      };

      img.src = URL.createObjectURL(file);
    });
  }, []);

  // Validate file
  const validateFile = (file: File): string | null => {
    if (!allowedTypes.includes(file.type as any)) {
      return `File type not allowed. Please use: ${allowedTypes.join(', ')}`;
    }
    if (file.size > maxFileSize) {
      return `File too large. Maximum size: ${Math.round(maxFileSize / 1024 / 1024)}MB`;
    }
    return null;
  };

  // Upload photo to Supabase Storage
  const uploadToStorage = async (
    file: File,
    photoId: string
  ): Promise<string> => {
    const filePath = `${moduleDefinition.formId || 'temp'}/${photoId}.jpg`;

    logger.log('Starting photo upload:', { filePath, fileSize: file.size });

    const { data, error } = await supabase.storage
      .from(MODULE_CONSTRAINTS.photos.storageBucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      logger.error('Photo upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    logger.log('Photo upload successful:', { filePath, data });

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(MODULE_CONSTRAINTS.photos.storageBucket)
      .getPublicUrl(filePath);

    logger.log('Got public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  // Handle file selection/upload
  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files);
    const remainingSlots = maxPhotos - photos.length;

    // Check photo limit and provide better feedback
    if (remainingSlots === 0) {
      logger.warn(
        `Maximum ${maxPhotos} photos already reached. Please delete existing photos before adding new ones.`
      );
      return;
    }

    if (fileArray.length > remainingSlots) {
      logger.warn(
        `Can only add ${remainingSlots} more photo${remainingSlots === 1 ? '' : 's'}. ${fileArray.length} files selected. Only the first ${remainingSlots} will be processed.`
      );
      // Process only the files that fit
      fileArray.splice(remainingSlots);
    }

    // Show progress for multiple uploads
    if (fileArray.length > 1) {
      logger.log(`Processing ${fileArray.length} photos...`);
      setIsProcessingMultiple(true);
    }

    // Keep track of the running photos array
    let currentPhotos = [...photos];

    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i];

      // Double-check limit before processing each file (race condition protection)
      if (currentPhotos.length >= maxPhotos) {
        logger.warn(
          `Stopping upload: Maximum ${maxPhotos} photos limit reached.`
        );
        break;
      }

      const validation = validateFile(file);
      if (validation) {
        logger.warn(`File ${file.name}: ${validation}`);
        continue;
      }

      const photoId = generatePhotoId();
      const blobUrl = URL.createObjectURL(file);

      // Create immediate preview entry
      const previewPhoto: PhotoEntry = {
        id: photoId,
        storageUrl: '',
        thumbnailUrl: await generateThumbnail(file),
        caption: '',
        timestamp: new Date().toISOString(),
        fileSize: file.size,
        compressed: false,
        originalFileName: file.name,
        blobUrl,
        uploading: true,
        uploadProgress: 0,
      };

      // Final safety check before adding
      if (currentPhotos.length >= maxPhotos) {
        logger.warn(
          `Cannot add photo ${photoId}: Maximum ${maxPhotos} photos limit reached.`
        );
        URL.revokeObjectURL(blobUrl);
        break;
      }

      // Add to running photos array and update UI immediately
      currentPhotos = [...currentPhotos, previewPhoto];
      onChange({ photos: currentPhotos });

      try {
        // Compress and upload
        logger.log('Starting compression for photo:', photoId);
        const compressedFile = await compressImage(file);
        logger.log('Compression complete, starting upload:', {
          originalSize: file.size,
          compressedSize: compressedFile.size,
        });

        const storageUrl = await uploadToStorage(compressedFile, photoId);
        logger.log('Upload complete, updating UI:', { photoId, storageUrl });

        // Update photo with final data
        const finalPhoto: PhotoEntry = {
          ...previewPhoto,
          storageUrl,
          fileSize: compressedFile.size,
          compressed: true,
          uploading: false,
          uploadProgress: 100,
        };

        // Update the specific photo in the running array
        currentPhotos = currentPhotos.map(p =>
          p.id === photoId ? finalPhoto : p
        );
        onChange({ photos: currentPhotos });

        // Cleanup blob URL
        URL.revokeObjectURL(blobUrl);

        logger.log(`Photo uploaded successfully: ${photoId}`);
      } catch (error) {
        logger.error(`Failed to upload photo ${photoId}:`, error);

        // Remove failed upload from running array
        currentPhotos = currentPhotos.filter(p => p.id !== photoId);
        onChange({ photos: currentPhotos });

        // Cleanup blob URL
        URL.revokeObjectURL(blobUrl);
      }
    }

    // Reset processing state
    if (fileArray.length > 1) {
      setIsProcessingMultiple(false);
    }
  };

  // File input change handler
  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    // Prevent processing if at capacity
    if (photos.length >= maxPhotos) {
      logger.warn(
        `Cannot select files: Maximum ${maxPhotos} photos already reached.`
      );
      event.target.value = ''; // Reset input
      return;
    }

    if (files) {
      handleFiles(files);
    }
    // Reset input
    event.target.value = '';
  };

  // Drag and drop handlers
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);

    // Prevent processing if at capacity
    if (photos.length >= maxPhotos) {
      logger.warn(
        `Cannot drop files: Maximum ${maxPhotos} photos already reached.`
      );
      return;
    }

    const files = event.dataTransfer.files;
    if (files) {
      handleFiles(files);
    }
  };

  // Delete photo
  const deletePhoto = async (photoId: string) => {
    const photo = photos.find(p => p.id === photoId);
    if (!photo) return;

    try {
      // Delete from Supabase Storage if uploaded
      if (photo.storageUrl) {
        const filePath = `${moduleDefinition.formId || 'temp'}/${photoId}.jpg`;
        await supabase.storage
          .from(MODULE_CONSTRAINTS.photos.storageBucket)
          .remove([filePath]);
      }

      // Cleanup blob URL if exists
      if (photo.blobUrl) {
        URL.revokeObjectURL(photo.blobUrl);
      }

      // Remove from photos array
      const updatedPhotos = photos.filter(p => p.id !== photoId);
      onChange({ photos: updatedPhotos });

      logger.log(`Photo deleted: ${photoId}`);
    } catch (error) {
      logger.error(`Failed to delete photo ${photoId}:`, error);
    }
  };

  // Update photo caption
  const updateCaption = (photoId: string, caption: string) => {
    const updatedPhotos = photos.map(photo =>
      photo.id === photoId ? { ...photo, caption } : photo
    );
    onChange({ photos: updatedPhotos });
  };

  // Open camera/file picker
  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className='photo-module'>
      {/* Upload Area */}
      <div className='photo-upload-area'>
        <div
          className={`upload-zone ${isDragOver ? 'drag-over' : ''} ${
            photos.length >= maxPhotos ? 'upload-disabled' : ''
          }`}
          onDragOver={photos.length < maxPhotos ? handleDragOver : undefined}
          onDragLeave={photos.length < maxPhotos ? handleDragLeave : undefined}
          onDrop={photos.length < maxPhotos ? handleDrop : undefined}
          onClick={photos.length < maxPhotos ? openFilePicker : undefined}
        >
          <div className='upload-content'>
            <div className='upload-icon'>📷</div>
            <p className='upload-text'>
              {photos.length >= maxPhotos
                ? 'Maximum photos reached. Delete photos to add more.'
                : MODULE_CONSTRAINTS.photos.dragDropText}
            </p>
            {photos.length < maxPhotos && (
              <button type='button' className='upload-button'>
                {MODULE_CONSTRAINTS.photos.uploadButtonText}
              </button>
            )}
            <p className='upload-limits'>
              {photos.length < maxPhotos
                ? `Can select ${maxPhotos - photos.length} more photo${maxPhotos - photos.length === 1 ? '' : 's'}, ${Math.round(maxFileSize / 1024 / 1024)}MB each`
                : `Maximum ${maxPhotos} photos reached`}
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type='file'
          accept={allowedTypes.join(',')}
          multiple
          capture='environment' // Use rear camera on mobile
          title='Hold Ctrl/Cmd to select multiple photos at once'
          style={{ display: 'none' }}
          onChange={handleFileInput}
        />
      </div>

      {/* Photo Count */}
      <div className='photo-count'>
        {isProcessingMultiple ? (
          <span className='processing-indicator'>
            📤 Processing multiple photos... {photos.length} / {maxPhotos}
          </span>
        ) : (
          `${photos.length} / ${maxPhotos} photos`
        )}
      </div>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className='photo-grid'>
          {photos.map(photo => (
            <div key={photo.id} className='photo-item'>
              <div className='photo-preview'>
                <img
                  src={photo.thumbnailUrl || photo.blobUrl || photo.storageUrl}
                  alt={photo.caption || 'Form photo'}
                  className='photo-thumbnail'
                />

                {photo.uploading && (
                  <div className='upload-overlay'>
                    <div className='upload-progress'>
                      <div className='progress-spinner'></div>
                      <span>Uploading...</span>
                    </div>
                  </div>
                )}

                <button
                  type='button'
                  className='delete-photo-btn'
                  onClick={() => deletePhoto(photo.id)}
                  disabled={photo.uploading}
                >
                  ✕
                </button>
              </div>

              <div className='photo-caption'>
                <textarea
                  value={photo.caption}
                  onChange={e => updateCaption(photo.id, e.target.value)}
                  placeholder='Add caption (optional)'
                  maxLength={MODULE_CONSTRAINTS.photos.captionMaxLength}
                  rows={2}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className='photo-empty-state'>
          <p>
            No photos added yet. Use the camera or select files to add photos.
          </p>
        </div>
      )}
    </div>
  );
};
