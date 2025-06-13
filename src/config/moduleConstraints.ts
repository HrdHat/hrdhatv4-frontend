/**
 * Module Constraints Configuration
 *
 * This file contains the business rules and constraints for form modules.
 * These should NOT be stored in database templates - they belong in the frontend.
 *
 * Benefits:
 * - Easy to update without database migrations
 * - Single source of truth for all templates
 * - Cleaner, lighter database templates
 * - Better separation of concerns
 */

export const MODULE_CONSTRAINTS = {
  // Photo Module Constraints
  photos: {
    maxPhotos: 5,
    maxFileSize: 5242880, // 5MB in bytes
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp'],
    storageTable: 'form_photos',
    storageBucket: 'form-photos',
    captionMaxLength: 200,
    compressionQuality: 0.8, // JPEG compression quality
    // UI behavior
    uploadButtonText: 'Select Photos (up to 5)',
    dragDropText: 'Drop photos here or click to select multiple photos',
    previewSize: { width: 150, height: 150 },
  },

  // Signature Module Constraints
  signatures: {
    maxFileSize: 102400, // 100KB in bytes
    fileFormat: 'png',
    storageTable: 'form_signatures',
    storageBucket: 'form-signatures',
    signaturesRequired: false, // Phase 1: signatures are optional
    immutableOnceCreated: true, // Audit compliance
    // Available signer roles
    signerRoles: [
      'worker',
      'supervisor',
      'foreman',
      'safety_officer',
      'management',
      'apprentice',
      'subcontractor',
      'inspector',
    ],
    // UI behavior
    canvasWidth: 400,
    canvasHeight: 200,
    strokeColor: '#000000',
    strokeWidth: 2,
    backgroundColor: '#ffffff',
  },

  // Task Hazard Control Module Constraints
  taskHazardControl: {
    maxEntries: 6,
    /* eslint-disable @typescript-eslint/naming-convention */
    riskScale: {
      min: 1,
      max: 10,
      labels: {
        '1': 'Very Low',
        '2': 'Low',
        '3': 'Low-Medium',
        '4': 'Medium',
        '5': 'Medium',
        '6': 'Medium-High',
        '7': 'High',
        '8': 'High',
        '9': 'Very High',
        '10': 'Extreme',
      },
      colors: {
        '1': '#4CAF50', // Green
        '2': '#4CAF50',
        '3': '#8BC34A',
        '4': '#CDDC39',
        '5': '#FFEB3B', // Yellow
        '6': '#FFC107',
        '7': '#FF9800', // Orange
        '8': '#FF5722',
        '9': '#F44336', // Red
        '10': '#B71C1C',
      },
    },
    /* eslint-enable @typescript-eslint/naming-convention */
    fieldMaxLengths: {
      task: 200,
      hazard: 300,
      control: 400,
    },
  },

  // General field constraints
  general: {
    textFieldMaxLength: 200,
    textAreaMaxLength: 1000,
    helperTextMaxLength: 150,
    formNumberPattern: /^\d{8}-\d{2}$/, // YYYYMMDD-NN
    dateFormat: 'YYYY-MM-DD',
    timeFormat: 'HH:mm',
  },
} as const;

// Type exports for TypeScript
export type PhotoConstraints = typeof MODULE_CONSTRAINTS.photos;
export type SignatureConstraints = typeof MODULE_CONSTRAINTS.signatures;
export type TaskHazardControlConstraints =
  typeof MODULE_CONSTRAINTS.taskHazardControl;
export type GeneralConstraints = typeof MODULE_CONSTRAINTS.general;

// Helper functions
export const getMaxFileSize = (moduleType: 'photos' | 'signatures'): number => {
  return MODULE_CONSTRAINTS[moduleType].maxFileSize;
};

export const getMaxEntries = (
  moduleType: 'photos' | 'taskHazardControl'
): number => {
  return moduleType === 'photos'
    ? MODULE_CONSTRAINTS.photos.maxPhotos
    : MODULE_CONSTRAINTS.taskHazardControl.maxEntries;
};

export const isValidFileType = (file: File, moduleType: 'photos'): boolean => {
  return MODULE_CONSTRAINTS[moduleType].allowedTypes.includes(file.type as any);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getRiskColor = (riskLevel: number): string => {
  return (
    (MODULE_CONSTRAINTS.taskHazardControl.riskScale.colors as any)[riskLevel] ||
    '#9E9E9E'
  );
};

export const getRiskLabel = (riskLevel: number): string => {
  return (
    (MODULE_CONSTRAINTS.taskHazardControl.riskScale.labels as any)[riskLevel] ||
    'Unknown'
  );
};
