import React, { useRef, useState } from 'react';
import { FormService } from '@/lib/formService';
import { useAuthStore } from '@/stores/authStore';
import { logger } from '@/utils/logger';

interface LogoUploadProps {
  currentLogoUrl?: string;
  onLogoUpdated?: (newLogoUrl: string) => void;
  className?: string;
}

export const LogoUpload: React.FC<LogoUploadProps> = ({
  currentLogoUrl,
  onLogoUpdated,
  className = '',
}) => {
  const { user } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file');
      }

      if (file.size > 1048576) {
        // 1MB
        throw new Error('Logo file must be less than 1MB');
      }

      // Upload logo
      const newLogoUrl = await FormService.uploadUserLogo(user.id, file);

      // Notify parent component
      if (onLogoUpdated) {
        onLogoUpdated(newLogoUrl);
      }

      logger.log('Logo uploaded successfully', { logoUrl: newLogoUrl });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Upload failed';
      setError(errorMessage);
      logger.error('Logo upload failed', error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className={`logo-upload ${className}`}>
      <div
        className={`logo-upload-area ${uploading ? 'uploading' : ''}`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {currentLogoUrl && !uploading ? (
          <div className='current-logo'>
            <img
              src={currentLogoUrl}
              alt='Current logo'
              className='logo-preview'
            />
            <div className='logo-overlay'>
              <span>Click or drop to change logo</span>
            </div>
          </div>
        ) : uploading ? (
          <div className='upload-progress'>
            <div className='spinner'>⟳</div>
            <span>Uploading logo...</span>
          </div>
        ) : (
          <div className='upload-placeholder'>
            <div className='upload-icon'>📁</div>
            <span>Click or drop logo here</span>
            <small>Max 1MB • JPG, PNG, SVG</small>
          </div>
        )}
      </div>

      {error && <div className='logo-upload-error'>{error}</div>}

      <input
        ref={fileInputRef}
        type='file'
        accept='image/*'
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />
    </div>
  );
};

// Add CSS styles
const logoUploadStyles = `
.logo-upload {
  max-width: 200px;
}

.logo-upload-area {
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #f8f9fa;
}

.logo-upload-area:hover {
  border-color: #007bff;
  background: #e7f3ff;
}

.logo-upload-area.uploading {
  border-color: #ffc107;
  background: #fff3cd;
  cursor: not-allowed;
}

.current-logo {
  position: relative;
}

.logo-preview {
  max-width: 100%;
  max-height: 80px;
  object-fit: contain;
}

.logo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
  font-size: 12px;
  text-align: center;
}

.current-logo:hover .logo-overlay {
  opacity: 1;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #856404;
}

.spinner {
  font-size: 20px;
  animation: spin 1s linear infinite;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  color: #6c757d;
}

.upload-icon {
  font-size: 24px;
}

.upload-placeholder small {
  font-size: 11px;
  color: #999;
}

.logo-upload-error {
  margin-top: 8px;
  padding: 8px;
  background: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  font-size: 12px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
`;

// Inject styles (in a real app, these would be in a CSS file)
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = logoUploadStyles;
  document.head.appendChild(styleElement);
}
