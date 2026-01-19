import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
    SegmentProgressBar,
    WaveformVisualizer,
    VinylRecord,
    TimelineSlider,
    DedicationAvatar,
    MediaLoadingSpinner
} from './PlayerComponents';

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================
const pageTransition = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 1.05 }
};

const contentTransition = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
};

// ============================================
// UP NEXT PREVIEW COMPONENT
// ============================================
const UpNextPreview = ({ dedication, onClick }) => {
    if (!dedication?.song?.local_file) return null;

    return (
        <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-lg hover:bg-white/80 active:scale-95 transition-all"
            style={{ boxShadow: '0 8px 32px rgba(212, 144, 123, 0.2)' }}
        >
            {/* Album art thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden shadow-md flex-shrink-0">
                <img
                    src={dedication.song?.album_art || dedication.photo}
                    alt="Up next"
                    className="w-full h-full object-cover"
                />
                {/* Pulsing overlay */}
                <motion.div
                    className="absolute inset-0 bg-rose-gold-500/20"
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>

            {/* Song info */}
            <div className="text-left min-w-0">
                <p className="text-[10px] uppercase tracking-wider text-rose-gold-500 font-semibold">
                    Up Next
                </p>
                <p className="text-sm font-medium text-celebration-charcoal truncate">
                    {dedication.song?.title}
                </p>
                <p className="text-xs text-rose-gold-400 truncate">
                    {dedication.song?.artist}
                </p>
            </div>

            {/* Play icon */}
            <div className="w-8 h-8 rounded-full bg-rose-gold-500 flex items-center justify-center flex-shrink-0 ml-auto">
                <span className="material-symbols-outlined text-white !text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    play_arrow
                </span>
            </div>
        </motion.button>
    );
};

// ============================================
// GLASSMORPHIC FLOATING CONTROLS
// ============================================
const GlassmorphicControls = ({
    isPlaying,
    onTogglePlay,
    onClose,
    showSwipeHint = true
}) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        className="flex items-center gap-4"
    >
        {/* Swipe hint - left */}
        {showSwipeHint && (
            <motion.div
                className="text-rose-gold-300"
                animate={{ x: [-3, 0, -3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="material-symbols-outlined !text-xl">chevron_left</span>
            </motion.div>
        )}

        {/* Main control pill */}
        <div
            className="flex items-center gap-2 px-2 py-2 rounded-full bg-white/70 backdrop-blur-xl border border-white/40 shadow-xl"
            style={{ boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)' }}
        >
            {/* Close button */}
            <button
                onClick={onClose}
                className="w-11 h-11 rounded-full bg-white/80 hover:bg-white flex items-center justify-center transition-colors"
                aria-label="Close player"
            >
                <span className="material-symbols-outlined text-celebration-charcoal/70 !text-xl">close</span>
            </button>

            {/* Play/Pause button */}
            <button
                onClick={onTogglePlay}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
                style={{ boxShadow: '0 4px 20px rgba(212, 144, 123, 0.4)' }}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                <span className="material-symbols-outlined !text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </button>
        </div>

        {/* Swipe hint - right */}
        {showSwipeHint && (
            <motion.div
                className="text-rose-gold-300"
                animate={{ x: [3, 0, 3] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
                <span className="material-symbols-outlined !text-xl">chevron_right</span>
            </motion.div>
        )}
    </motion.div>
);

// ============================================
// VIDEO PHASE VIEW (for video greetings - themed card layout)
// ============================================
const VideoPhaseView = ({
    videoRef,
    dedication,
    isPlaying,
    progress,
    duration,
    onTogglePlay,
    onSeek,
    onEnded,
    onTimeUpdate,
    onDurationChange,
    onCanPlay
}) => {
    const [isPortrait, setIsPortrait] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);
    const [isVideoReady, setIsVideoReady] = useState(false);

    // Reset loading state when video source changes
    useEffect(() => {
        if (!dedication.video_message) return;
        setIsVideoLoading(true);
        setIsVideoReady(false);
        setIsPortrait(null);
    }, [dedication.video_message]);

    // Handle video loading errors
    const handleVideoError = (e) => {
        console.error('[MobilePlayer] Video load error:', e.target.error);
        console.error('[MobilePlayer] Video URL was:', dedication.video_message);
        setIsVideoLoading(false);
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const handleTimeUpdate = () => onTimeUpdate(video.currentTime);
        const handleDurationChange = () => onDurationChange(video.duration);

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleDurationChange);
        video.addEventListener('durationchange', handleDurationChange);

        if (video.duration && !isNaN(video.duration)) {
            onDurationChange(video.duration);
        }

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleDurationChange);
            video.removeEventListener('durationchange', handleDurationChange);
        };
    }, [videoRef, onTimeUpdate, onDurationChange]);

    const detectOrientation = () => {
        if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            if (videoWidth > 0 && videoHeight > 0) {
                setIsPortrait(videoHeight > videoWidth);
                return true;
            }
        }
        return false;
    };

    // When metadata loads, we can detect orientation
    const handleLoadedMetadata = () => {
        detectOrientation();
    };

    // When first frame is available (loadeddata), stop spinner and show first frame
    const handleLoadedData = () => {
        setIsVideoLoading(false);
        setIsVideoReady(true);
        if (isPortrait === null) {
            detectOrientation();
        }
    };

    // When video can play through, notify parent to attempt autoplay
    const handleCanPlay = () => {
        // Notify parent that video is ready for playback attempt
        onCanPlay();
    };

    // Show play button when video is ready but not playing
    const showPlayButton = isVideoReady && !isPlaying;

    return (
        <motion.div
            key="video-phase"
            variants={contentTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            style={{ willChange: 'transform, opacity' }}
            className="flex-1 flex flex-col items-center justify-center px-6 gap-4 w-full"
        >
            {/* Header */}
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                    ברכה
                </p>
                <h1 className="text-2xl font-serif text-celebration-charcoal">
                    <span className="italic">מ{dedication.name}</span>
                </h1>
            </div>

            {/* Video Card */}
            <div className="my-4 w-full flex justify-center">
                <div
                    className={`relative rounded-2xl overflow-hidden shadow-floating bg-celebration-charcoal ${isPortrait === true
                        ? 'w-[55%] max-w-[240px] aspect-[9/16]'
                        : isPortrait === false
                            ? 'w-[90%] max-w-sm aspect-video'
                            : 'w-[70%] max-w-[280px] aspect-square'
                        }`}
                >
                    {/* Loading spinner - shown until first frame is available */}
                    {isVideoLoading && (
                        <div className="absolute inset-0 bg-celebration-charcoal flex items-center justify-center z-10">
                            <MediaLoadingSpinner size="lg" />
                        </div>
                    )}

                    {/* Play button overlay - shown when video is ready but not playing */}
                    {showPlayButton && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer"
                            onClick={onTogglePlay}
                        >
                            {/* Semi-transparent overlay */}
                            <div className="absolute inset-0 bg-black/30" />
                            {/* Play button */}
                            <motion.div
                                initial={{ scale: 0.8 }}
                                animate={{ scale: 1 }}
                                whileTap={{ scale: 0.95 }}
                                className="relative w-20 h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-xl"
                            >
                                <span
                                    className="material-symbols-outlined text-rose-gold-500 !text-5xl ml-1"
                                    style={{ fontVariationSettings: "'FILL' 1" }}
                                >
                                    play_arrow
                                </span>
                            </motion.div>
                        </motion.div>
                    )}

                    <video
                        ref={videoRef}
                        src={dedication.video_message}
                        className="w-full h-full object-cover"
                        playsInline
                        muted={false}
                        preload="metadata"
                        onEnded={onEnded}
                        onClick={onTogglePlay}
                        onLoadedMetadata={handleLoadedMetadata}
                        onLoadedData={handleLoadedData}
                        onCanPlay={handleCanPlay}
                        onError={handleVideoError}
                    />
                </div>
            </div>

            {/* Timeline */}
            <div className="w-full max-w-sm">
                <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
            </div>
        </motion.div>
    );
};

// ============================================
// VOICE PHASE VIEW (for voice-only dedications)
// ============================================
const VoicePhaseView = ({
    dedication,
    isPlaying,
    progress,
    duration,
    onSeek
}) => (
    <motion.div
        key="voice-phase"
        variants={contentTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'transform, opacity' }}
        className="flex-1 flex flex-col items-center justify-center px-6 gap-4 w-full"
    >
        {/* Header */}
        <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                ברכה
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                <span className="italic">מ{dedication.name}</span>
            </h1>
        </div>

        {/* Hero Profile */}
        <div className="my-6 flex flex-col items-center gap-4">
            <DedicationAvatar
                src={dedication.photo}
                alt={dedication.name}
                isPlaying={isPlaying}
                size="large"
            />

            {/* Waveform */}
            <div className="mt-4">
                <WaveformVisualizer isPlaying={isPlaying} barCount={16} />
            </div>
        </div>

        {/* Timeline */}
        <div className="w-full max-w-sm">
            <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
        </div>
    </motion.div>
);

// ============================================
// SONG PHASE VIEW
// ============================================
const SongPhaseView = ({
    dedication,
    isPlaying,
    progress,
    duration,
    onTogglePlay,
    onSeek
}) => (
    <motion.div
        key="song-phase"
        variants={contentTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        style={{ willChange: 'transform, opacity' }}
        className="flex-1 flex flex-col items-center justify-center px-6 gap-4 w-full"
    >
        {/* Header */}
        <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                Dedicated Song
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                Now Playing
            </h1>
        </div>

        {/* Hero Vinyl */}
        <div className="my-6 flex flex-col items-center">
            <VinylRecord
                albumArt={dedication.song?.album_art || dedication.photo}
                songTitle={dedication.song?.title}
                isPlaying={isPlaying}
                size="w-52 h-52"
                onClick={onTogglePlay}
            />
        </div>

        {/* Song Info */}
        <div className="text-center">
            <h2 className="text-2xl font-serif text-celebration-charcoal mb-1">
                {dedication.song?.title}
            </h2>
            <p className="text-base text-rose-gold-600 font-sans">
                {dedication.song?.artist}
            </p>
        </div>

        {/* Timeline */}
        <div className="w-full max-w-sm mt-4">
            <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
        </div>
    </motion.div>
);

// ============================================
// SWIPE HINT OVERLAY
// ============================================
const SwipeHintOverlay = ({ direction }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={`absolute top-1/2 -translate-y-1/2 ${direction === 'left' ? 'left-2' : 'right-2'} z-10`}
    >
        <motion.div
            className="w-10 h-10 rounded-full bg-white/60 backdrop-blur-sm flex items-center justify-center shadow-lg"
            animate={{
                x: direction === 'left' ? [-5, 0, -5] : [5, 0, 5],
                scale: [1, 1.1, 1]
            }}
            transition={{ duration: 0.8, repeat: Infinity }}
        >
            <span className="material-symbols-outlined text-rose-gold-500 !text-xl">
                {direction === 'left' ? 'chevron_left' : 'chevron_right'}
            </span>
        </motion.div>
    </motion.div>
);

// ============================================
// MAIN MOBILE IMMERSIVE PLAYER
// ============================================
const MobileImmersivePlayer = ({
    dedication,
    currentIndex = 0,
    totalCount = 1,
    onClose,
    onNext,
    onPrevious,
}) => {
    // Local media refs
    const videoRef = useRef(null);
    const audioRef = useRef(null);

    // Local playback state (no context!)
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [phase, setPhase] = useState('greeting'); // 'greeting' or 'song'

    // Swipe gesture state
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    // Subtle visual feedback during drag
    const dragOpacity = useTransform(x, [-100, 0, 100], [0.85, 1, 0.85]);

    // Computed values
    const hasVideoGreeting = dedication?.video_message != null;
    const isGreeting = phase === 'greeting';

    // Get current active media element
    const getActiveMedia = useCallback(() => {
        if (phase === 'greeting') {
            return hasVideoGreeting ? videoRef.current : audioRef.current;
        }
        return audioRef.current;
    }, [phase, hasVideoGreeting]);

    // Play
    const play = useCallback(() => {
        const media = getActiveMedia();
        if (media) {
            media.play().catch(e => console.error("Play error:", e));
        }
        setIsPlaying(true);
    }, [getActiveMedia]);

    // Pause
    const pause = useCallback(() => {
        const media = getActiveMedia();
        if (media) {
            media.pause();
        }
        setIsPlaying(false);
    }, [getActiveMedia]);

    // Toggle
    const togglePlay = useCallback(() => {
        if (isPlaying) {
            pause();
        } else {
            play();
        }
    }, [isPlaying, play, pause]);

    // Skip to song phase
    const skipToSong = useCallback(() => {

        // Stop video if playing
        if (videoRef.current) {
            videoRef.current.pause();
        }
        // Stop voice message if playing
        if (audioRef.current) {
            audioRef.current.pause();
        }

        setPhase('song');
        setCurrentTime(0);
        setDuration(0);

        // Load and play song
        if (audioRef.current && dedication?.song?.local_file) {
            audioRef.current.src = dedication.song.local_file;
            audioRef.current.load();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    // AbortError is expected if user navigates quickly - ignore it
                    if (e.name !== 'AbortError') {
                        console.error("Song play error:", e);
                    }
                });
        } else {
            // No song, go to next dedication
            onNext();
        }
    }, [dedication, onNext]);

    // Handle greeting ended (voice or video)
    const handleGreetingEnded = useCallback(() => {
        if (dedication?.song?.local_file) {
            skipToSong();
        } else {
            // No song, go to next dedication
            onNext();
        }
    }, [dedication, skipToSong, onNext]);

    // Handle song ended
    const handleSongEnded = useCallback(() => {
        onNext();
    }, [onNext]);

    // Seek
    const seek = useCallback((time) => {
        setCurrentTime(time);
        const media = getActiveMedia();
        if (media) {
            media.currentTime = time;
        }
    }, [getActiveMedia]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop all media on unmount
            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.src = '';
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
            }
        };
    }, []);

    // Autoplay when dedication changes
    useEffect(() => {
        if (!dedication) return;

        const dedicationHasGreeting = dedication.video_message || dedication.voice_message;
        const newPhase = dedicationHasGreeting ? 'greeting' : 'song';

        // IMPORTANT: Stop all current media first to prevent overlap
        // This fixes the issue where audio continues playing while video loads
        if (videoRef.current) {
            videoRef.current.pause();
        }
        if (audioRef.current) {
            audioRef.current.pause();
        }
        setIsPlaying(false);

        setPhase(newPhase);
        setCurrentTime(0);
        setDuration(0);

        // Autoplay video greeting
        // NOTE: Don't check videoRef.current here - it might not exist yet since
        // the video element only renders when phase='greeting'. We set the phase first,
        // then the video element will mount and autoplay via handleVideoCanPlay.
        if (dedication.video_message) {
            // Clear audio src to prevent any accidental playback
            if (audioRef.current) {
                audioRef.current.src = '';
            }
            // Video autoplay is handled by handleVideoCanPlay callback
            // videoRef.current.load() will be triggered by the video element mounting
        }
        // Autoplay voice greeting
        else if (dedication.voice_message && audioRef.current) {
            audioRef.current.src = dedication.voice_message;
            audioRef.current.load();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    // AbortError is expected if user navigates quickly - ignore it
                    if (e.name !== 'AbortError') {
                        console.error("Voice autoplay error:", e);
                    }
                });
        }
        // Autoplay song (no greeting)
        else if (dedication.song?.local_file && audioRef.current) {
            audioRef.current.src = dedication.song.local_file;
            audioRef.current.load();
            audioRef.current.play()
                .then(() => setIsPlaying(true))
                .catch(e => {
                    // AbortError is expected if user navigates quickly - ignore it
                    if (e.name !== 'AbortError') {
                        console.error("Song autoplay error:", e);
                    }
                });
        }
    }, [dedication?.id]);

    // Audio element event listeners
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const onEnded = () => {
            if (phase === 'greeting') {
                handleGreetingEnded();
            } else {
                handleSongEnded();
            }
        };

        const onTimeUpdate = () => setCurrentTime(audio.currentTime);
        const onLoadedMetadata = () => setDuration(audio.duration);
        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);

        audio.addEventListener('ended', onEnded);
        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);

        return () => {
            audio.removeEventListener('ended', onEnded);
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
        };
    }, [phase, handleGreetingEnded, handleSongEnded]);

    // Video element - handle video ended event
    const handleVideoEnded = useCallback(() => {
        handleGreetingEnded();
    }, [handleGreetingEnded]);

    // Video time update (only update local state in greeting phase)
    const handleVideoTimeUpdate = useCallback((time) => {
        if (phase === 'greeting') {
            setCurrentTime(time);
        }
    }, [phase]);

    // Video duration change
    const handleVideoDurationChange = useCallback((dur) => {
        if (phase === 'greeting') {
            setDuration(dur);
        }
    }, [phase]);

    // Handle video can play - attempt autoplay with iOS muted workaround
    const handleVideoCanPlay = useCallback(() => {
        if (videoRef.current && videoRef.current.paused) {
            // Start muted for iOS autoplay compatibility
            videoRef.current.muted = true;
            videoRef.current.play()
                .then(() => {
                    // Autoplay succeeded, unmute
                    videoRef.current.muted = false;
                    setIsPlaying(true);
                })
                .catch(() => {
                    // Autoplay failed (mobile) - restore unmuted state
                    // User will see play button and can tap to play
                    videoRef.current.muted = false;
                });
        }
    }, []);

    // Handle seek for video
    const handleSeek = useCallback((time) => {
        seek(time);
        if (videoRef.current && hasVideoGreeting && isGreeting) {
            videoRef.current.currentTime = time;
        }
    }, [seek, hasVideoGreeting, isGreeting]);

    // Swipe handlers
    const handleDragStart = () => {
        setIsDragging(true);
    };

    const handleDrag = (_, info) => {
        if (info.offset.x > 30) {
            setSwipeDirection('right');
        } else if (info.offset.x < -30) {
            setSwipeDirection('left');
        } else {
            setSwipeDirection(null);
        }
    };

    const handleDragEnd = (_, info) => {
        setIsDragging(false);
        setSwipeDirection(null);

        const threshold = 80;
        const velocity = info.velocity.x;
        const offset = info.offset.x;

        // Stop current media before navigating
        if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
        if (audioRef.current && !audioRef.current.paused) {
            audioRef.current.pause();
        }

        if (offset > threshold || velocity > 500) {
            // Swipe right - go to previous
            x.set(0);
            onPrevious();
        } else if (offset < -threshold || velocity < -500) {
            // Swipe left - go to next (song if greeting, next dedication if song)
            x.set(0);
            if (isGreeting) {
                skipToSong();
            } else {
                onNext();
            }
        } else {
            // Snap back
            animate(x, 0, { type: "spring", stiffness: 500, damping: 30 });
        }
    };

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[2000] h-[100dvh] w-full flex flex-col items-center bg-celebration-cream overflow-hidden"
            style={{
                paddingTop: 'max(16px, env(safe-area-inset-top))',
            }}
        >
            {/* Hidden local audio element */}
            <audio ref={audioRef} preload="metadata" />

            {/* Segment Progress Bar */}
            <SegmentProgressBar
                current={currentIndex}
                total={totalCount}
                progress={currentTime}
                duration={duration}
            />

            {/* Swipeable Content Container */}
            <motion.div
                className="flex-1 w-full flex flex-col items-center justify-center relative touch-pan-y"
                style={{ x, opacity: dragOpacity }}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragStart={handleDragStart}
                onDrag={handleDrag}
                onDragEnd={handleDragEnd}
            >
                {/* Swipe direction indicators */}
                <AnimatePresence>
                    {isDragging && swipeDirection === 'left' && (
                        <SwipeHintOverlay direction="right" />
                    )}
                    {isDragging && swipeDirection === 'right' && (
                        <SwipeHintOverlay direction="left" />
                    )}
                </AnimatePresence>

                {/* Phase Content */}
                <AnimatePresence mode="wait">
                    {isGreeting && hasVideoGreeting ? (
                        <VideoPhaseView
                            key="video"
                            videoRef={videoRef}
                            dedication={dedication}
                            isPlaying={isPlaying}
                            progress={currentTime}
                            duration={duration}
                            onTogglePlay={togglePlay}
                            onSeek={handleSeek}
                            onEnded={handleVideoEnded}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onDurationChange={handleVideoDurationChange}
                            onCanPlay={handleVideoCanPlay}
                        />
                    ) : isGreeting ? (
                        <VoicePhaseView
                            key="voice"
                            dedication={dedication}
                            isPlaying={isPlaying}
                            progress={currentTime}
                            duration={duration}
                            onSeek={handleSeek}
                        />
                    ) : (
                        <SongPhaseView
                            key="song"
                            dedication={dedication}
                            isPlaying={isPlaying}
                            progress={currentTime}
                            duration={duration}
                            onTogglePlay={togglePlay}
                            onSeek={handleSeek}
                        />
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Bottom Controls Area */}
            <div
                className="w-full flex flex-col items-center gap-4 px-6 pb-2"
                style={{ paddingBottom: 'max(16px, calc(8px + env(safe-area-inset-bottom)))' }}
            >
                {/* Up Next Preview - only show during greeting phase */}
                <AnimatePresence>
                    {isGreeting && dedication?.song?.local_file && (
                        <UpNextPreview
                            dedication={dedication}
                            onClick={skipToSong}
                        />
                    )}
                </AnimatePresence>

                {/* Glassmorphic Controls */}
                <GlassmorphicControls
                    isPlaying={isPlaying}
                    onTogglePlay={togglePlay}
                    onClose={onClose}
                    showSwipeHint={!isDragging}
                />
            </div>
        </motion.div>
    );
};

export default MobileImmersivePlayer;
