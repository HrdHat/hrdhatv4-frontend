import React, { useState, useRef, useCallback, useEffect } from 'react';

import { MODULE_CONSTRAINTS } from '@/config/moduleConstraints';
import { supabase } from '@/config/supabaseClient';
import { logger } from '@/utils/logger';

import '@/styles/components/signature-module.css';

interface SignatureModuleProps {
  moduleData: any;
  moduleDefinition: any;
  onChange: (moduleData: any) => void;
}

interface SignatureEntry {
  id: string;
  storageUrl: string;
  signerName: string;
  signerType: 'worker' | 'supervisor';
  signerRole: string;
  timestamp: string;
  fileSize: number;
  signatureMetadata: {
    canvasWidth: number;
    canvasHeight: number;
  };
  uploading?: boolean;
  blobUrl?: string; // For immediate preview
}

export const SignatureModule: React.FC<SignatureModuleProps> = ({
  moduleData,
  moduleDefinition,
  onChange,
}) => {
  const signatures: SignatureEntry[] = moduleData?.signatures || [];
  const supervisorCanvasRef = useRef<HTMLCanvasElement>(null);
  const workerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [workerName, setWorkerName] = useState('');
  const [supervisorName, setSupervisorName] = useState('');

  const maxFileSize = MODULE_CONSTRAINTS.signatures.maxFileSize;
  const canvasWidth = MODULE_CONSTRAINTS.signatures.canvasWidth;
  const canvasHeight = MODULE_CONSTRAINTS.signatures.canvasHeight;
  const strokeColor = MODULE_CONSTRAINTS.signatures.strokeColor;
  const strokeWidth = MODULE_CONSTRAINTS.signatures.strokeWidth;
  const backgroundColor = MODULE_CONSTRAINTS.signatures.backgroundColor;

  // Get signatures by type
  const supervisorSignature = signatures.find(
    s => s.signerType === 'supervisor'
  );
  const workerSignatures = signatures.filter(s => s.signerType === 'worker');

  // Generate unique signature ID
  const generateSignatureId = (): string => {
    return `signature_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  };

  // Setup canvas for drawing
  const setupCanvas = useCallback(
    (canvas: HTMLCanvasElement) => {
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    },
    [backgroundColor, strokeColor, strokeWidth]
  );

  // Initialize canvases
  useEffect(() => {
    if (supervisorCanvasRef.current) {
      setupCanvas(supervisorCanvasRef.current);
    }
    if (workerCanvasRef.current) {
      setupCanvas(workerCanvasRef.current);
    }
  }, [setupCanvas]);

  // Get canvas coordinates
  const getCanvasCoordinates = (
    canvas: HTMLCanvasElement,
    event: MouseEvent | TouchEvent
  ): { x: number; y: number } => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in event) {
      return {
        x: (event.touches[0].clientX - rect.left) * scaleX,
        y: (event.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (event.clientX - rect.left) * scaleX,
        y: (event.clientY - rect.top) * scaleY,
      };
    }
  };

  // Start drawing
  const startDrawing = useCallback(
    (canvas: HTMLCanvasElement, event: MouseEvent | TouchEvent) => {
      event.preventDefault();
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      setIsDrawing(true);
      const { x, y } = getCanvasCoordinates(canvas, event);
      ctx.beginPath();
      ctx.moveTo(x, y);
    },
    []
  );

  // Draw on canvas
  const draw = useCallback(
    (canvas: HTMLCanvasElement, event: MouseEvent | TouchEvent) => {
      if (!isDrawing) return;
      event.preventDefault();

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const { x, y } = getCanvasCoordinates(canvas, event);
      ctx.lineTo(x, y);
      ctx.stroke();
    },
    [isDrawing]
  );

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Add event listeners to canvas
  const addCanvasEventListeners = useCallback(
    (canvas: HTMLCanvasElement, _canvasType: 'supervisor' | 'worker') => {
      const handleMouseDown = (e: MouseEvent) => {
        startDrawing(canvas, e);
      };
      const handleMouseMove = (e: MouseEvent) => draw(canvas, e);
      const handleMouseUp = () => stopDrawing();

      const handleTouchStart = (e: TouchEvent) => {
        startDrawing(canvas, e);
      };
      const handleTouchMove = (e: TouchEvent) => draw(canvas, e);
      const handleTouchEnd = () => stopDrawing();

      canvas.addEventListener('mousedown', handleMouseDown);
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseup', handleMouseUp);
      canvas.addEventListener('touchstart', handleTouchStart);
      canvas.addEventListener('touchmove', handleTouchMove);
      canvas.addEventListener('touchend', handleTouchEnd);

      return () => {
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      };
    },
    [startDrawing, draw, stopDrawing]
  );

  // Setup canvas event listeners
  useEffect(() => {
    let supervisorCleanup: (() => void) | undefined;
    let workerCleanup: (() => void) | undefined;

    if (supervisorCanvasRef.current && !supervisorSignature) {
      supervisorCleanup = addCanvasEventListeners(
        supervisorCanvasRef.current,
        'supervisor'
      );
    }

    if (workerCanvasRef.current) {
      workerCleanup = addCanvasEventListeners(
        workerCanvasRef.current,
        'worker'
      );
    }

    return () => {
      supervisorCleanup?.();
      workerCleanup?.();
    };
  }, [addCanvasEventListeners, supervisorSignature]);

  // Clear canvas
  const clearCanvas = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setupCanvas(canvas);
  };

  // Check if canvas has signature
  const canvasHasSignature = (canvas: HTMLCanvasElement): boolean => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return false;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Check if any pixel is not the background color
    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const a = data[i + 3];

      // If pixel is not white/transparent, there's a signature
      if (a > 0 && (r !== 255 || g !== 255 || b !== 255)) {
        return true;
      }
    }
    return false;
  };

  // Convert canvas to PNG blob
  const canvasToBlob = (canvas: HTMLCanvasElement): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to convert canvas to blob'));
        }
      }, 'image/png');
    });
  };

  // Upload signature to Supabase Storage
  const uploadSignatureToStorage = async (
    blob: Blob,
    signatureId: string
  ): Promise<string> => {
    const filePath = `${moduleDefinition.formId || 'temp'}/${signatureId}.png`;

    logger.log('Starting signature upload:', { filePath, fileSize: blob.size });

    const { data, error } = await supabase.storage
      .from(MODULE_CONSTRAINTS.signatures.storageBucket)
      .upload(filePath, blob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      logger.error('Signature upload error:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    logger.log('Signature upload successful:', { filePath, data });

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(MODULE_CONSTRAINTS.signatures.storageBucket)
      .getPublicUrl(filePath);

    logger.log('Got public URL:', urlData.publicUrl);
    return urlData.publicUrl;
  };

  // Save signature
  const saveSignature = async (
    canvas: HTMLCanvasElement,
    signerName: string,
    signerType: 'worker' | 'supervisor'
  ) => {
    if (!canvasHasSignature(canvas)) {
      logger.warn('Cannot save empty signature');
      return;
    }

    if (!signerName.trim()) {
      logger.warn('Signer name is required');
      return;
    }

    const signatureId = generateSignatureId();
    const blobUrl = canvas.toDataURL();

    // Create immediate preview entry
    const previewSignature: SignatureEntry = {
      id: signatureId,
      storageUrl: '',
      signerName: signerName.trim(),
      signerType,
      signerRole: signerType, // Phase 1: role matches type
      timestamp: new Date().toISOString(),
      fileSize: 0,
      signatureMetadata: {
        canvasWidth: canvas.width,
        canvasHeight: canvas.height,
      },
      uploading: true,
      blobUrl,
    };

    // Add to signatures array and update UI immediately
    const currentSignatures = [...signatures, previewSignature];
    onChange({ signatures: currentSignatures });

    try {
      // Convert canvas to blob and upload
      logger.log('Starting signature processing for:', signatureId);
      const blob = await canvasToBlob(canvas);

      if (blob.size > maxFileSize) {
        throw new Error(
          `Signature too large: ${blob.size} bytes (max: ${maxFileSize} bytes)`
        );
      }

      const storageUrl = await uploadSignatureToStorage(blob, signatureId);
      logger.log('Upload complete, updating UI:', { signatureId, storageUrl });

      // Update signature with final data
      const finalSignature: SignatureEntry = {
        ...previewSignature,
        storageUrl,
        fileSize: blob.size,
        uploading: false,
      };

      // Update the specific signature in the array
      const updatedSignatures = currentSignatures.map(s =>
        s.id === signatureId ? finalSignature : s
      );
      onChange({ signatures: updatedSignatures });

      // Clear the canvas and name input
      clearCanvas(canvas);
      if (signerType === 'worker') {
        setWorkerName('');
      } else {
        setSupervisorName('');
      }

      logger.log(`Signature saved successfully: ${signatureId}`);
    } catch (error) {
      logger.error(`Failed to save signature ${signatureId}:`, error);

      // Remove failed signature from array
      const updatedSignatures = currentSignatures.filter(
        s => s.id !== signatureId
      );
      onChange({ signatures: updatedSignatures });
    }
  };

  // Handle supervisor signature save
  const saveSupervisorSignature = () => {
    if (supervisorCanvasRef.current) {
      saveSignature(supervisorCanvasRef.current, supervisorName, 'supervisor');
    }
  };

  // Handle worker signature save
  const saveWorkerSignature = () => {
    if (workerCanvasRef.current) {
      saveSignature(workerCanvasRef.current, workerName, 'worker');
    }
  };

  // Clear supervisor canvas
  const clearSupervisorCanvas = () => {
    if (supervisorCanvasRef.current) {
      clearCanvas(supervisorCanvasRef.current);
    }
  };

  // Clear worker canvas
  const clearWorkerCanvas = () => {
    if (workerCanvasRef.current) {
      clearCanvas(workerCanvasRef.current);
    }
  };

  return (
    <div className='signature-module'>
      {/* Supervisor Signature Section */}
      <div className='supervisor-signature-section'>
        <h3 className='signature-section-title'>🧑‍💼 Supervisor Signature</h3>

        {supervisorSignature ? (
          <div className='signature-display'>
            <div className='signature-preview'>
              <img
                src={
                  supervisorSignature.blobUrl || supervisorSignature.storageUrl
                }
                alt={`Signature by ${supervisorSignature.signerName}`}
                className='signature-image'
              />
              {supervisorSignature.uploading && (
                <div className='upload-overlay'>
                  <div className='upload-progress'>
                    <div className='progress-spinner'></div>
                    <span>Uploading...</span>
                  </div>
                </div>
              )}
            </div>
            <div className='signature-info'>
              <p>
                <strong>{supervisorSignature.signerName}</strong>
              </p>
              <p className='signature-timestamp'>
                Signed:{' '}
                {new Date(supervisorSignature.timestamp).toLocaleString()}
              </p>
            </div>
          </div>
        ) : (
          <div className='signature-capture'>
            <div className='signature-input-group'>
              <input
                type='text'
                value={supervisorName}
                onChange={e => setSupervisorName(e.target.value)}
                placeholder='Supervisor Name'
                className='signer-name-input'
                maxLength={100}
              />
            </div>

            <div className='canvas-container'>
              <canvas
                ref={supervisorCanvasRef}
                width={canvasWidth}
                height={canvasHeight}
                className='signature-canvas'
              />
              <div className='canvas-instructions'>
                Sign here with mouse or touch
              </div>
            </div>

            <div className='signature-actions'>
              <button
                type='button'
                onClick={clearSupervisorCanvas}
                className='clear-signature-btn'
              >
                Clear
              </button>
              <button
                type='button'
                onClick={saveSupervisorSignature}
                className='save-signature-btn'
                disabled={!supervisorName.trim()}
              >
                Save Supervisor Signature
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Workers Signature Section */}
      <div className='workers-signature-section'>
        <h3 className='signature-section-title'>👷 Worker Signatures</h3>

        {/* Existing Worker Signatures */}
        {workerSignatures.length > 0 && (
          <div className='worker-signatures-list'>
            {workerSignatures.map(signature => (
              <div key={signature.id} className='signature-display'>
                <div className='signature-preview'>
                  <img
                    src={signature.blobUrl || signature.storageUrl}
                    alt={`Signature by ${signature.signerName}`}
                    className='signature-image'
                  />
                  {signature.uploading && (
                    <div className='upload-overlay'>
                      <div className='upload-progress'>
                        <div className='progress-spinner'></div>
                        <span>Uploading...</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className='signature-info'>
                  <p>
                    <strong>{signature.signerName}</strong>
                  </p>
                  <p className='signature-timestamp'>
                    Signed: {new Date(signature.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add New Worker Signature */}
        <div className='signature-capture'>
          <div className='signature-input-group'>
            <input
              type='text'
              value={workerName}
              onChange={e => setWorkerName(e.target.value)}
              placeholder='Worker Name'
              className='signer-name-input'
              maxLength={100}
            />
          </div>

          <div className='canvas-container'>
            <canvas
              ref={workerCanvasRef}
              width={canvasWidth}
              height={canvasHeight}
              className='signature-canvas'
            />
            <div className='canvas-instructions'>
              Sign here with mouse or touch
            </div>
          </div>

          <div className='signature-actions'>
            <button
              type='button'
              onClick={clearWorkerCanvas}
              className='clear-signature-btn'
            >
              Clear
            </button>
            <button
              type='button'
              onClick={saveWorkerSignature}
              className='save-signature-btn'
              disabled={!workerName.trim()}
            >
              Add Worker Signature
            </button>
          </div>
        </div>

        {/* Signature Count */}
        <div className='signature-count'>
          {workerSignatures.length} worker signature
          {workerSignatures.length !== 1 ? 's' : ''} added
        </div>
      </div>

      {/* Module Summary */}
      <div className='signature-summary'>
        <p>
          Signatures: {supervisorSignature ? '1 Supervisor' : '0 Supervisor'},{' '}
          {workerSignatures.length} Worker
          {workerSignatures.length !== 1 ? 's' : ''}
        </p>
      </div>
    </div>
  );
};
