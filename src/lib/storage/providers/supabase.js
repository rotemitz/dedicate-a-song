/**
 * Supabase Storage provider
 */
import { createClient } from '@supabase/supabase-js';
import { supabaseConfig } from '../config.js';

// Initialize Supabase client
const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

/**
 * Get the public URL for a media file from Supabase Storage
 * @param {string} path - The path to the file (e.g., 'assets/images/friend.webp')
 * @returns {string|null} The public URL for the file
 */
export function getMediaUrl(path) {
  if (!path) return null;

  // If already a full URL (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Get public URL from Supabase Storage
  const { data } = supabase.storage.from(supabaseConfig.bucket).getPublicUrl(path);

  return data?.publicUrl || path;
}

/**
 * Transform a dedication object to use Supabase URLs for all media
 * @param {object} dedication - The dedication object from dedications.json
 * @returns {object} The dedication with Supabase URLs
 */
export function transformDedicationMedia(dedication) {
  return {
    ...dedication,
    photo: getMediaUrl(dedication.photo),
    voice_message: dedication.voice_message ? getMediaUrl(dedication.voice_message) : null,
    video_message: dedication.video_message ? getMediaUrl(dedication.video_message) : null,
    song: dedication.song
      ? {
          ...dedication.song,
          local_file: getMediaUrl(dedication.song.local_file),
          album_art: getMediaUrl(dedication.song.album_art),
        }
      : null,
  };
}

/**
 * Transform all dedications to use Supabase URLs
 * @param {object[]} dedications - Array of dedication objects
 * @returns {object[]} Array of dedications with Supabase URLs
 */
export function transformAllDedications(dedications) {
  return dedications.map(transformDedicationMedia);
}

// Export the Supabase client for advanced usage if needed
export { supabase };
