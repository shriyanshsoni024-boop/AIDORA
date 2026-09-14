/**
 * AIDORA Cooperative Platform — Profile Photo Storage Service
 * 
 * Handles validating, previewing, and uploading user & worker profile photos
 * to Supabase Storage bucket 'profile-photos' with local fallback support.
 */

import { supabase, isSupabaseConfigured } from '../../lib/supabase';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export interface PhotoUploadResult {
  success: boolean;
  url?: string;
  previewUrl?: string;
  error?: string;
}

class PhotoStorageService {
  private bucketName = 'profile-photos';

  /**
   * Validate file type and size
   */
  public validatePhoto(file: File): { isValid: boolean; error?: string } {
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error: 'Invalid file type. Please upload a JPEG, PNG, WEBP, or GIF image.',
      };
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return {
        isValid: false,
        error: 'Image is too large. Maximum allowed file size is 5 MB.',
      };
    }

    return { isValid: true };
  }

  /**
   * Generate local data URL preview for instantaneous UI feedback
   */
  public generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read image file.'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload profile photo to Supabase Storage
   */
  public async uploadProfilePhoto(userId: string, file: File): Promise<PhotoUploadResult> {
    const validation = this.validatePhoto(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    let previewUrl = '';
    try {
      previewUrl = await this.generatePreview(file);
    } catch {
      // Non-fatal, continue
    }

    const cleanUserId = userId || 'temp-user';
    const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const filePath = `avatars/${cleanUserId}_${Date.now()}.${fileExt}`;

    if (isSupabaseConfigured()) {
      try {
        const { data, error } = await supabase.storage
          .from(this.bucketName)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          });

        if (!error && data) {
          const { data: urlData } = supabase.storage
            .from(this.bucketName)
            .getPublicUrl(filePath);

          const publicUrl = urlData?.publicUrl || previewUrl;
          return {
            success: true,
            url: publicUrl,
            previewUrl,
          };
        } else if (error) {
          console.warn('Supabase profile photo upload notice:', error.message);
        }
      } catch (err: any) {
        console.warn('Supabase storage upload exception:', err);
      }
    }

    // Return preview URL as fallback if Supabase Storage is not reached
    if (previewUrl) {
      return {
        success: true,
        url: previewUrl,
        previewUrl,
      };
    }

    return {
      success: false,
      error: 'Failed to upload photo. Please try again.',
    };
  }

  /**
   * Flexible upload helper for worker/customer contexts
   */
  public async uploadPhoto(file: File, _role?: string, userId?: string): Promise<PhotoUploadResult> {
    return this.uploadProfilePhoto(userId || 'user', file);
  }

  /**
   * Validation alias returning { valid, error }
   */
  public validatePhotoFile(file: File): { valid: boolean; error?: string } {
    const res = this.validatePhoto(file);
    return { valid: res.isValid, error: res.error };
  }
}

export const photoStorageService = new PhotoStorageService();
