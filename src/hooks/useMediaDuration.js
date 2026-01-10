import { useState, useEffect } from 'react';

/**
 * Format seconds to MM:SS display format
 */
const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return null;
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Hook to extract duration from a media file (audio/video)
 * @param {string} mediaUrl - URL to the media file
 * @returns {string|null} - Formatted duration string (e.g., "2:34") or null if loading/unavailable
 */
const useMediaDuration = (mediaUrl) => {
    const [duration, setDuration] = useState(null);

    useEffect(() => {
        if (!mediaUrl) {
            setDuration(null);
            return;
        }

        const media = new Audio();

        const handleLoadedMetadata = () => {
            setDuration(formatDuration(media.duration));
        };

        const handleError = () => {
            setDuration(null);
        };

        media.addEventListener('loadedmetadata', handleLoadedMetadata);
        media.addEventListener('error', handleError);
        media.src = mediaUrl;

        return () => {
            media.removeEventListener('loadedmetadata', handleLoadedMetadata);
            media.removeEventListener('error', handleError);
            media.src = '';
        };
    }, [mediaUrl]);

    return duration;
};

/**
 * Hook to get the total duration of a dedication (voice/video message + song)
 * @param {object} dedication - The dedication object
 * @returns {string|null} - Formatted duration of the primary media
 */
export const useDedicationDuration = (dedication) => {
    // Priority: video message > voice message > song
    const mediaUrl = dedication?.video_message ||
                     dedication?.voice_message ||
                     dedication?.song?.local_file;

    return useMediaDuration(mediaUrl);
};

export default useMediaDuration;
