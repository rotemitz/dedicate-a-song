import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';

/**
 * Global Audio Context
 * 
 * Manages a single persistent audio instance across all player components.
 * This ensures playback continues seamlessly when switching between:
 * - Inline player (dedications list)
 * - Immersive player (mobile/desktop)
 * - Video fullscreen mode
 */

const AudioContext = createContext(null);

export const useAudioPlayer = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudioPlayer must be used within an AudioProvider');
    }
    return context;
};

export const AudioProvider = ({ children }) => {
    // Current dedication being played
    const [currentDedication, setCurrentDedication] = useState(null);
    const [currentDedicationIndex, setCurrentDedicationIndex] = useState(-1);

    // Playback state
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [phase, setPhase] = useState('greeting'); // 'greeting' or 'song'
    const [volume, setVolume] = useState(1);

    // Refs for audio elements
    const audioRef = useRef(null); // For voice messages and songs
    const videoRef = useRef(null); // For video messages (controlled externally, synced here)

    // Callbacks for external handling
    const onPhaseChangeRef = useRef(null);
    const onDedicationEndRef = useRef(null);

    // Get current media source based on phase
    const getCurrentSource = useCallback(() => {
        if (!currentDedication) return null;

        if (phase === 'greeting') {
            return currentDedication.video_message || currentDedication.voice_message;
        }
        return currentDedication.song?.local_file;
    }, [currentDedication, phase]);

    // Load a new dedication
    const loadDedication = useCallback((dedication, index, startPhase = null) => {
        console.log('[loadDedication] Loading:', dedication.name, 'at index:', index);
        const hasGreeting = dedication.video_message || dedication.voice_message;
        const newPhase = startPhase || (hasGreeting ? 'greeting' : 'song');

        // First, ALWAYS stop any currently playing audio and clear source
        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.currentTime = 0;
            // Clear the source to ensure no audio plays
            audioRef.current.src = '';
            console.log('[loadDedication] Cleared previous audio');
        }

        // Update state
        setCurrentDedication(dedication);
        setCurrentDedicationIndex(index);
        setPhase(newPhase);
        setCurrentTime(0);
        setDuration(0);
        setIsPlaying(true);

        // Determine source
        let source = null;
        if (newPhase === 'greeting') {
            // Only load voice messages into audio element
            // Video messages are handled by video elements (to avoid dual playback)
            source = dedication.voice_message;
            console.log('[loadDedication] Greeting source:', source);
        } else {
            source = dedication.song?.local_file;
        }

        console.log('[loadDedication] Source:', source, 'Phase:', newPhase);

        // Load and play audio (only if we have an audio source)
        if (audioRef.current && source) {
            audioRef.current.src = source;
            audioRef.current.load();
            console.log('[loadDedication] Audio src set, waiting for audio to be ready...');

            // Use canplay event for streaming optimization - starts playing as soon as
            // enough data is buffered, without waiting for the entire file
            const handleCanPlay = () => {
                console.log('[loadDedication] Audio ready, playing...');
                audioRef.current?.play().catch(e => {
                    console.error("[loadDedication] Audio play error:", e);
                    setIsPlaying(false);
                });
                audioRef.current?.removeEventListener('canplay', handleCanPlay);
            };

            // Check if already ready (HAVE_FUTURE_DATA or higher - enough to start playing)
            if (audioRef.current.readyState >= 3) {
                console.log('[loadDedication] Audio already ready, playing immediately');
                audioRef.current.play().catch(e => {
                    console.error("[loadDedication] Audio play error:", e);
                    setIsPlaying(false);
                });
            } else {
                audioRef.current.addEventListener('canplay', handleCanPlay);
            }
        } else {
            console.log('[loadDedication] No source available');
        }
    }, []);

    // Play
    const play = useCallback(() => {
        setIsPlaying(true);
        if (audioRef.current) {
            // Always try to play - readyState check is more reliable than src check
            if (audioRef.current.readyState >= 1) {
                audioRef.current.play().catch(e => {
                    console.error("Play error:", e);
                    setIsPlaying(false);
                });
            } else {
                // Audio not ready, wait for it to load
                const handleCanPlay = () => {
                    audioRef.current?.play().catch(e => {
                        console.error("Play error after canplay:", e);
                        setIsPlaying(false);
                    });
                    audioRef.current?.removeEventListener('canplay', handleCanPlay);
                };
                audioRef.current.addEventListener('canplay', handleCanPlay);
            }
        }
    }, []);

    // Pause
    const pause = useCallback(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.pause();
        }
    }, []);

    // Toggle play/pause
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    // Seek to specific time
    const seek = useCallback((time) => {
        setCurrentTime(time);
        if (audioRef.current) {
            audioRef.current.currentTime = time;
        }
    }, []);

    // Skip to song phase
    const skipToSong = useCallback(() => {
        if (!currentDedication?.song?.local_file) {
            // No song available, trigger end
            if (onDedicationEndRef.current) {
                onDedicationEndRef.current();
            }
            return;
        }

        setPhase('song');
        setCurrentTime(0);

        if (audioRef.current) {
            audioRef.current.src = currentDedication.song.local_file;
            audioRef.current.load();

            if (isPlaying) {
                // Wait for audio to be ready before playing (streaming optimized)
                const handleCanPlay = () => {
                    audioRef.current?.play().catch(e => console.error("Skip to song play error:", e));
                    audioRef.current?.removeEventListener('canplay', handleCanPlay);
                };

                if (audioRef.current.readyState >= 3) {
                    audioRef.current.play().catch(e => console.error("Skip to song play error:", e));
                } else {
                    audioRef.current.addEventListener('canplay', handleCanPlay);
                }
            }
        }

        if (onPhaseChangeRef.current) {
            onPhaseChangeRef.current('song');
        }
    }, [currentDedication, isPlaying]);

    // Handle greeting ended (transition to song)
    const handleGreetingEnded = useCallback(() => {
        if (currentDedication?.song?.local_file) {
            skipToSong();
        } else {
            // No song, dedication ends
            if (onDedicationEndRef.current) {
                onDedicationEndRef.current();
            }
        }
    }, [currentDedication, skipToSong]);

    // Handle song ended
    const handleSongEnded = useCallback(() => {
        if (onDedicationEndRef.current) {
            onDedicationEndRef.current();
        }
    }, []);

    // Set volume
    const changeVolume = useCallback((newVolume) => {
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    }, []);

    // Register callbacks
    const setOnPhaseChange = useCallback((callback) => {
        onPhaseChangeRef.current = callback;
    }, []);

    const setOnDedicationEnd = useCallback((callback) => {
        onDedicationEndRef.current = callback;
    }, []);

    // Stop playback completely
    const stop = useCallback(() => {
        setIsPlaying(false);
        setCurrentDedication(null);
        setCurrentDedicationIndex(-1);
        setCurrentTime(0);
        setDuration(0);
        setPhase('greeting');

        if (audioRef.current) {
            audioRef.current.pause();
            audioRef.current.src = '';
        }
    }, []);

    // Check if current dedication has a video greeting
    const hasVideoGreeting = currentDedication?.video_message != null;
    const hasVoiceGreeting = currentDedication?.voice_message != null;
    const hasSong = currentDedication?.song?.local_file != null;
    const isGreetingPhase = phase === 'greeting';

    // Audio element event handlers
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            if (phase === 'greeting') {
                handleGreetingEnded();
            } else {
                handleSongEnded();
            }
        };

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);
        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, [phase, handleGreetingEnded, handleSongEnded]);

    // Sync volume when it changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume;
        }
    }, [volume]);

    const value = {
        // State
        currentDedication,
        currentDedicationIndex,
        isPlaying,
        currentTime,
        duration,
        phase,
        volume,

        // Computed
        hasVideoGreeting,
        hasVoiceGreeting,
        hasSong,
        isGreetingPhase,

        // Actions
        loadDedication,
        play,
        pause,
        togglePlay,
        seek,
        skipToSong,
        changeVolume,
        stop,

        // Callbacks
        setOnPhaseChange,
        setOnDedicationEnd,

        // Refs (for external video sync)
        audioRef,
        videoRef,

        // Direct state setters for video sync
        setCurrentTime,
        setDuration,
        setIsPlaying,
        setPhase,
    };

    return (
        <AudioContext.Provider value={value}>
            {/* Global audio element - hidden, persistent */}
            <audio ref={audioRef} preload="metadata" />
            {children}
        </AudioContext.Provider>
    );
};

export default AudioContext;
