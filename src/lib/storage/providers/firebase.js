/**
 * Firebase Storage provider
 */
import { initializeApp } from 'firebase/app';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';
import { firebaseConfig } from '../config.js';

// Initialize Firebase app and storage
let app = null;
let storage = null;

function initFirebase() {
  if (!app && firebaseConfig.projectId && firebaseConfig.storageBucket) {
    app = initializeApp({
      projectId: firebaseConfig.projectId,
      storageBucket: firebaseConfig.storageBucket,
      apiKey: firebaseConfig.apiKey,
    });
    storage = getStorage(app);
  }
  return storage;
}

// Cache for resolved URLs to avoid repeated API calls
const urlCache = new Map();

/**
 * Get the download URL for a media file from Firebase Storage
 * Note: Firebase URLs require async resolution. This returns a promise.
 * @param {string} path - The path to the file in Firebase Storage
 * @returns {Promise<string|null>} The download URL for the file
 */
export async function getMediaUrlAsync(path) {
  if (!path) return null;

  // If already a full URL (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Check cache first
  if (urlCache.has(path)) {
    return urlCache.get(path);
  }

  const firebaseStorage = initFirebase();
  if (!firebaseStorage) {
    console.warn('[Firebase] Storage not initialized. Check VITE_FIREBASE_* env vars.');
    return path;
  }

  try {
    const storageRef = ref(firebaseStorage, path);
    const url = await getDownloadURL(storageRef);
    urlCache.set(path, url);
    return url;
  } catch (error) {
    console.error(`[Firebase] Error getting URL for ${path}:`, error);
    return path;
  }
}

/**
 * Synchronous version that returns the path for initial render.
 * The URL will be resolved asynchronously and cached.
 * For Firebase, we construct a predictable URL format.
 * @param {string} path - The path to the file
 * @returns {string|null} The URL for the file
 */
export function getMediaUrl(path) {
  if (!path) return null;

  // If already a full URL (http/https), return as-is
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Check cache first
  if (urlCache.has(path)) {
    return urlCache.get(path);
  }

  // For Firebase public buckets, we can construct the URL directly
  // Format: https://firebasestorage.googleapis.com/v0/b/{bucket}/o/{encodedPath}?alt=media
  if (firebaseConfig.storageBucket) {
    // Strip gs:// prefix if present
    const bucket = firebaseConfig.storageBucket.replace(/^gs:\/\//, '');
    const encodedPath = encodeURIComponent(path);
    return `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodedPath}?alt=media`;
  }

  // Fallback: trigger async resolution and return path for now
  getMediaUrlAsync(path).then((url) => {
    urlCache.set(path, url);
  });

  return path;
}

/**
 * Transform a dedication object to use Firebase URLs for all media
 * @param {object} dedication - The dedication object from dedications.json
 * @returns {object} The dedication with Firebase URLs
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
 * Transform all dedications to use Firebase URLs
 * @param {object[]} dedications - Array of dedication objects
 * @returns {object[]} Array of dedications with Firebase URLs
 */
export function transformAllDedications(dedications) {
  return dedications.map(transformDedicationMedia);
}

/**
 * Async version that resolves all Firebase URLs
 * Use this when you need guaranteed resolved URLs
 * @param {object[]} dedications - Array of dedication objects
 * @returns {Promise<object[]>} Array of dedications with resolved Firebase URLs
 */
export async function transformAllDedicationsAsync(dedications) {
  return Promise.all(
    dedications.map(async (dedication) => {
      const [photo, voiceMessage, videoMessage, songFile, albumArt] = await Promise.all([
        getMediaUrlAsync(dedication.photo),
        dedication.voice_message ? getMediaUrlAsync(dedication.voice_message) : null,
        dedication.video_message ? getMediaUrlAsync(dedication.video_message) : null,
        dedication.song?.local_file ? getMediaUrlAsync(dedication.song.local_file) : null,
        dedication.song?.album_art ? getMediaUrlAsync(dedication.song.album_art) : null,
      ]);

      return {
        ...dedication,
        photo,
        voice_message: voiceMessage,
        video_message: videoMessage,
        song: dedication.song
          ? {
              ...dedication.song,
              local_file: songFile,
              album_art: albumArt,
            }
          : null,
      };
    })
  );
}

// Export storage for advanced usage
export { storage, app };
