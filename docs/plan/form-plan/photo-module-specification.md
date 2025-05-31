# Photo Module Specification

**Last Updated**: December 2024  
**Status**: Implementation Ready  
**Module**: Photos (FLRA Form Module)

---

## 🎯 **Photo Module Overview**

The Photo Module allows construction workers to capture and attach photos to safety forms for documentation purposes. Photos provide visual evidence of site conditions, hazards, and safety measures.

---

## 📋 **Module Specification**

### **TypeScript Interface**

```typescript
interface PhotoModule {
  photos: Array<{
    id: string; // Unique photo identifier
    storageUrl: string; // Supabase Storage URL
    thumbnailUrl: string; // Compressed preview URL
    caption?: string; // Optional photo description
    timestamp: Date; // When photo was taken
    location?: GeoLocation; // GPS coordinates if available
    fileSize: number; // File size in bytes
    compressed: boolean; // Whether photo was compressed
    originalFileName?: string; // Original file name from device
  }>;

  // Module Configuration
  maxPhotos: 5; // Maximum photos per form
  maxFileSize: 5242880; // 5MB per photo (5 * 1024 * 1024)
  compressionQuality: 0.8; // 80% quality for compression
  allowedFormats: ['jpeg', 'jpg', 'png', 'webp'];

  // Module Metadata
  moduleId: 'photos';
  moduleTitle: 'Photos';
  moduleDescription: 'Attach photos to document site conditions';
  required: false; // Photos are optional
  order: 6; // Display order in form
}

interface GeoLocation {
  latitude: number;
  longitude: number;
  accuracy?: number; // GPS accuracy in meters
}
```

---

## 🔧 **Technical Requirements**

### **Storage Strategy**

- **Primary Storage**: Supabase Storage (not JSONB)
- **Local Preview**: Blob URLs for immediate display
- **Thumbnails**: Generated client-side (max 200x200px)
- **Compression**: Client-side before upload
- **Cleanup**: Automatic blob URL cleanup on component unmount

### **File Handling**

- **Input**: HTML5 file input with camera access
- **Formats**: JPEG, PNG, WebP (convert HEIC if needed)
- **Compression**: Reduce to max 1920x1080, 80% quality
- **Validation**: File size, format, and count limits

### **Performance Considerations**

- **Progressive Upload**: Show thumbnail immediately, upload in background
- **Batch Processing**: Handle multiple photos efficiently
- **Memory Management**: Clean up blob URLs and canvas elements
- **Offline Support**: Queue uploads when offline

---

## 📱 **User Experience**

### **Photo Capture Flow**

1. **Tap Camera Button** → Opens device camera or file picker
2. **Take/Select Photo** → Immediate thumbnail preview
3. **Add Caption** → Optional description field
4. **Auto-save** → Photo uploads in background
5. **Visual Feedback** → Progress indicator and success state

### **Photo Management**

- **View Photos**: Grid layout with thumbnails
- **Full Size View**: Tap thumbnail to view full image
- **Delete Photos**: Swipe or tap delete button
- **Reorder Photos**: Drag and drop (Phase 2)
- **Caption Editing**: Tap to edit photo descriptions

---

## 🏗️ **Construction Site Considerations**

### **Device Compatibility**

- **Mobile Cameras**: Primary photo source
- **Tablet Cameras**: Secondary option
- **File Upload**: For photos taken with other devices
- **Work Gloves**: Large touch targets (48px minimum)

### **Environmental Factors**

- **Bright Sunlight**: High contrast UI for outdoor visibility
- **Dirty Devices**: Simple, large interface elements
- **Network Issues**: Offline photo storage and sync
- **Battery Life**: Efficient image processing

### **Safety Context**

- **Hazard Documentation**: Photos of unsafe conditions
- **PPE Verification**: Photos showing proper equipment use
- **Site Conditions**: Weather, lighting, workspace setup
- **Compliance Evidence**: Visual proof of safety measures

---

## 🔒 **Security & Privacy**

### **Data Protection**

- **GPS Stripping**: Option to remove location data
- **Access Control**: Photos only visible to form creator
- **Secure Storage**: Supabase Storage with RLS policies
- **Data Retention**: Follow company data retention policies

### **Privacy Considerations**

- **Worker Privacy**: No photos of workers without consent
- **Site Security**: No sensitive equipment or processes
- **Client Confidentiality**: Respect client site restrictions
- **GDPR Compliance**: Right to delete personal data

---

## 📊 **Module Limits & Constraints**

### **Hard Limits**

```typescript
const PHOTO_LIMITS = {
  maxPhotos: 5, // Per form instance
  maxFileSize: 5 * 1024 * 1024, // 5MB per photo
  maxTotalSize: 25 * 1024 * 1024, // 25MB total per form
  compressionQuality: 0.8, // 80% JPEG quality
  maxDimensions: {
    width: 1920,
    height: 1080,
  },
  thumbnailSize: {
    width: 200,
    height: 200,
  },
};
```

### **Validation Rules**

- **File Format**: Must be image type (JPEG, PNG, WebP)
- **File Size**: Individual photos ≤ 5MB
- **Photo Count**: Maximum 5 photos per form
- **Caption Length**: Maximum 500 characters
- **Required Fields**: None (photos are optional)

---

## 🧪 **Testing Requirements**

### **Functional Testing**

- **Photo Capture**: Camera access and file selection
- **Upload Process**: Background upload with progress
- **Compression**: File size reduction verification
- **Thumbnail Generation**: Preview image creation
- **Caption Management**: Add, edit, delete captions

### **Performance Testing**

- **Large Files**: 5MB photo upload performance
- **Multiple Photos**: 5 photos upload simultaneously
- **Memory Usage**: Blob URL cleanup verification
- **Network Conditions**: Offline/slow connection handling

### **Accessibility Testing**

- **Touch Targets**: Camera button ≥ 48px
- **Screen Readers**: Photo descriptions and status
- **Keyboard Navigation**: Tab through photo controls
- **High Contrast**: Visible in bright sunlight

---

## 🔄 **Integration Points**

### **Form Integration**

- **Module Position**: After Task/Hazard/Control module
- **Data Storage**: URLs stored in form JSONB
- **Validation**: Optional module, no blocking validation
- **Auto-save**: Triggers form auto-save on photo changes

### **Backend Integration**

- **Storage Bucket**: `form-photos` in Supabase Storage
- **File Naming**: `{formId}/{photoId}.{extension}`
- **Metadata**: Stored in form JSONB, files in Storage
- **Cleanup**: Orphaned file cleanup process

### **API Endpoints**

```typescript
// Photo upload
POST /storage/v1/object/form-photos/{formId}/{photoId}

// Photo deletion
DELETE /storage/v1/object/form-photos/{formId}/{photoId}

// Form update with photo metadata
PATCH /rest/v1/form_instances?id=eq.{formId}
```

---

## 📋 **Implementation Checklist**

### **Phase 1: Basic Photo Module**

- [ ] **File Input**: Camera access and file selection
- [ ] **Image Compression**: Client-side resize and compress
- [ ] **Thumbnail Generation**: 200x200px previews
- [ ] **Supabase Storage**: Upload to storage bucket
- [ ] **Progress Indicators**: Upload progress feedback
- [ ] **Caption Management**: Add/edit photo descriptions
- [ ] **Photo Deletion**: Remove photos and cleanup storage
- [ ] **Form Integration**: Save photo metadata to JSONB

### **Phase 2: Enhanced Features**

- [ ] **GPS Location**: Optional location tagging
- [ ] **Photo Reordering**: Drag and drop interface
- [ ] **Batch Upload**: Multiple photo selection
- [ ] **Advanced Compression**: WebP format support
- [ ] **Offline Queue**: Upload when connection restored

---

## 🎯 **Success Criteria**

### **Functional Goals**

- ✅ Workers can capture photos using device camera
- ✅ Photos upload and display within 5 seconds
- ✅ Thumbnails load immediately for preview
- ✅ Captions can be added and edited easily
- ✅ Photos are properly compressed (≤ 5MB)

### **Performance Goals**

- ✅ Photo upload completes in < 10 seconds on 3G
- ✅ Thumbnail generation in < 2 seconds
- ✅ Memory usage stays under 50MB with 5 photos
- ✅ No memory leaks from blob URLs

### **User Experience Goals**

- ✅ Touch targets work with work gloves (48px)
- ✅ Interface visible in bright sunlight
- ✅ Clear feedback during upload process
- ✅ Intuitive photo management controls

---

**Status**: Ready for Implementation  
**Dependencies**: Supabase Storage configuration, form JSONB schema  
**Next Steps**: Implement basic photo capture and upload functionality
