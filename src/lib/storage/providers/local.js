/**
 * Local file provider for development mode
 * Returns paths relative to the public folder
 */

// Get the base URL from Vite config (e.g., '/dedicate-a-song/' for GitHub Pages)
const BASE_URL = import.meta.env.BASE_URL || '/';

/**
 * Get URL for a local file (relative to public folder)
 * @param {string} path - The path to the file
 * @returns {string|null} The URL for the file
 */
export function getMediaUrl(path) {
  if (!path) return null;

  // If already a full URL, return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Combine base URL with path
  // BASE_URL already has trailing slash from Vite
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE_URL}${cleanPath}`;
}

/**
 * Transform a dedication object to use local URLs for all media
 * @param {object} dedication - The dedication object from dedications.json
 * @returns {object} The dedication with local URLs
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
 * Transform all dedications to use local URLs
 * @param {object[]} dedications - Array of dedication objects
 * @returns {object[]} Array of dedications with local URLs
 */
export function transformAllDedications(dedications) {
  return dedications.map(transformDedicationMedia);
}
