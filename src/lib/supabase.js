import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xfemcnxoahtehskfkypw.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZW1jbnhvYWh0ZWhza2ZreXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NjAyOTcsImV4cCI6MjA4NDAzNjI5N30.Fe72Kf9FJlPfYFYWnuEEGj4cFKEkRJ4zU-hQ_pW-v9E';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Bucket name for media storage
const MEDIA_BUCKET = 'birthday-media';

/**
 * Get the public URL for a media file from Supabase Storage
 * @param {string} path - The path to the file (e.g., 'assets/images/vicky.webp' or 'songs/vicky.m4a')
 * @returns {string} The public URL for the file
 */
export function getMediaUrl(path) {
    if (!path) return null;

    // If already a full URL (http/https), return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // Get public URL from Supabase Storage
    const { data } = supabase.storage
        .from(MEDIA_BUCKET)
        .getPublicUrl(path);

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
        song: dedication.song ? {
            ...dedication.song,
            local_file: getMediaUrl(dedication.song.local_file),
            album_art: getMediaUrl(dedication.song.album_art)
        } : null
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
