/**
 * Storage configuration and environment detection
 */

// Auto-detect development environment
export const isDev =
  import.meta.env.DEV ||
  (typeof window !== 'undefined' &&
    (window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'));

// Get storage provider from environment variable
// Defaults to 'local' in dev mode, 'firebase' in production
const envProvider = import.meta.env.VITE_STORAGE_PROVIDER;
export const storageProvider = envProvider || (isDev ? 'local' : 'firebase');

// Supabase configuration
export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://xfemcnxoahtehskfkypw.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhmZW1jbnhvYWh0ZWhza2ZreXB3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0NjAyOTcsImV4cCI6MjA4NDAzNjI5N30.Fe72Kf9FJlPfYFYWnuEEGj4cFKEkRJ4zU-hQ_pW-v9E',
  bucket: import.meta.env.VITE_SUPABASE_BUCKET || 'birthday-media',
};

// Firebase configuration
export const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
};

// Log current storage provider in development
if (isDev) {
  console.log(`[Storage] Using '${storageProvider}' provider (isDev: ${isDev})`);
}
