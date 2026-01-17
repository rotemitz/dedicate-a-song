/**
 * Storage abstraction layer
 *
 * Provides a unified interface for media storage across different providers:
 * - local: Uses files from public/ folder (dev mode)
 * - supabase: Uses Supabase Storage
 * - firebase: Uses Firebase Storage
 *
 * The provider is automatically selected based on environment:
 * - Development (localhost): Uses 'local' by default
 * - Production: Uses the provider specified in VITE_STORAGE_PROVIDER (default: 'supabase')
 */

import { storageProvider, isDev } from './config.js';
import * as localProvider from './providers/local.js';
import * as supabaseProvider from './providers/supabase.js';
import * as firebaseProvider from './providers/firebase.js';

// Select the correct provider based on configuration
function getProvider() {
  switch (storageProvider) {
    case 'firebase':
      return firebaseProvider;
    case 'supabase':
      return supabaseProvider;
    case 'local':
    default:
      return localProvider;
  }
}

const provider = getProvider();
console.log('[Storage] Selected provider:', storageProvider, '| isDev:', isDev);

/**
 * Get the URL for a media file using the configured storage provider
 * @param {string} path - The path to the file
 * @returns {string|null} The URL for the file
 */
export function getMediaUrl(path) {
  return provider.getMediaUrl(path);
}

/**
 * Transform a dedication object to use storage URLs for all media
 * @param {object} dedication - The dedication object from dedications.json
 * @returns {object} The dedication with storage URLs
 */
export function transformDedicationMedia(dedication) {
  return provider.transformDedicationMedia(dedication);
}

/**
 * Transform all dedications to use storage URLs
 * @param {object[]} dedications - Array of dedication objects
 * @returns {object[]} Array of dedications with storage URLs
 */
export function transformAllDedications(dedications) {
  return provider.transformAllDedications(dedications);
}

// Re-export config values for external use
export { storageProvider, isDev };
