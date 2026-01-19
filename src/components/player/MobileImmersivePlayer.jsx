import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion';
import {
    SegmentProgressBar,
    WaveformVisualizer,
    VinylRecord,
    TimelineSlider,
    DedicationAvatar,
    MediaLoadingSpinner
} from './PlayerComponents';
import { useAudioPlayer } from '../../context/AudioContext';

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
    isPlayingRef,
    shouldAutoPlayOnMountRef,
    progress,
    duration,
    onTogglePlay,
    onPlay,
    onSeek,
    onEnded,
    onTimeUpdate,
    onDurationChange
}) => {
    const [isPortrait, setIsPortrait] = useState(null);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    // Reset loading state when video source changes
    // Note: Parent handles video.load() to avoid duplicate calls
    useEffect(() => {
        if (!videoRef.current || !dedication.video_message) return;
        console.log('[MobilePlayer] VideoPhaseView - video URL:', dedication.video_message);
        setIsVideoLoading(true);
        setIsPortrait(null);
    }, [dedication.video_message, videoRef]);

    // Handle video loading errors
    const handleVideoError = (e) => {
        console.error('[MobilePlayer] Video load error:', e.target.error);
        console.error('[MobilePlayer] Video URL was:', dedication.video_message);
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

    const handleLoadedMetadata = () => {
        detectOrientation();
    };

    const handleCanPlay = () => {
        setIsVideoLoading(false);
        if (isPortrait === null) {
            detectOrientation();
        }
        // Check both isPlayingRef AND shouldAutoPlayOnMountRef
        // shouldAutoPlayOnMountRef handles the case where user pauses before video loads
        const shouldAutoPlay = shouldAutoPlayOnMountRef.current;
        const shouldPlay = isPlayingRef.current || shouldAutoPlay;
        console.log('[MobilePlayer] handleCanPlay - isPlayingRef:', isPlayingRef.current, 'shouldAutoPlayOnMount:', shouldAutoPlayOnMountRef.current, 'paused:', videoRef.current?.paused);

        // Clear the auto-play flag after checking
        if (shouldAutoPlayOnMountRef.current) {
            shouldAutoPlayOnMountRef.current = false;
        }

        if (shouldPlay && videoRef.current?.paused) {
            console.log('[MobilePlayer] Triggering autoplay from handleCanPlay');
            videoRef.current.play().catch(e => console.error("Video auto-play error:", e));
            // If we're auto-playing due to shouldAutoPlayOnMount, also sync the isPlaying state
            // This prevents the play/pause sync effect from immediately pausing the video
            if (shouldAutoPlay && !isPlayingRef.current) {
                console.log('[MobilePlayer] Syncing isPlaying state to true');
                onPlay();
            }
        }
    };

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
                    {isVideoLoading && (
                        <div className="absolute inset-0 bg-celebration-charcoal flex items-center justify-center z-10">
                            <MediaLoadingSpinner size="lg" />
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        src={dedication.video_message}
                        className={`w-full h-full object-cover transition-all duration-500 ${!isPlaying ? 'blur-sm' : ''}`}
                        playsInline
                        muted={false}
                        preload="metadata"
                        onEnded={onEnded}
                        onClick={onTogglePlay}
                        onLoadedMetadata={handleLoadedMetadata}
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
    const {
        isPlaying,
        currentTime,
        duration,
        phase,
        play,
        togglePlay,
        seek,
        skipToSong,
        setCurrentTime,
        setDuration,
    } = useAudioPlayer();

    const videoRef = useRef(null);
    const containerRef = useRef(null);
    const lastVideoSrcRef = useRef(null);

    // Track latest isPlaying value in a ref to avoid stale closures in callbacks
    const isPlayingRef = useRef(isPlaying);
    useEffect(() => {
        isPlayingRef.current = isPlaying;
    }, [isPlaying]);

    // Track if video should auto-play when ready (set on dedication change, cleared after play attempt)
    const shouldAutoPlayOnMountRef = useRef(false);

    // Swipe gesture state
    const x = useMotionValue(0);
    const [isDragging, setIsDragging] = useState(false);
    const [swipeDirection, setSwipeDirection] = useState(null);

    // Subtle visual feedback during drag (less dramatic)
    const dragOpacity = useTransform(x, [-100, 0, 100], [0.85, 1, 0.85]);

    const isGreeting = phase === 'greeting';
    const hasVideoGreeting = dedication.video_message != null;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Set auto-play flag when dedication changes and has video greeting
    // This runs on every dedication change - we set the flag if this dedication has video
    // The handleCanPlay will check this flag and play automatically when video is ready
    useEffect(() => {
        const dedicationHasVideo = dedication?.video_message != null;
        console.log('[MobilePlayer] Dedication changed to:', dedication?.name, '| hasVideo:', dedicationHasVideo, '| isPlaying:', isPlaying);
        if (dedicationHasVideo) {
            console.log('[MobilePlayer] Setting shouldAutoPlayOnMount = true');
            shouldAutoPlayOnMountRef.current = true;
        }
    }, [dedication?.id]); // Only trigger on dedication change

    // Video loading effect - only load when source actually changes
    useEffect(() => {
        console.log('[MobilePlayer] Video loading effect - hasVideoGreeting:', hasVideoGreeting, 'isGreeting:', isGreeting, 'isPlaying:', isPlaying);
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) {
            console.log('[MobilePlayer] Video loading effect - skipping (conditions not met)');
            return;
        }

        const video = videoRef.current;
        const currentSrc = dedication?.video_message;

        // Only call load() if the source actually changed
        if (lastVideoSrcRef.current !== currentSrc) {
            lastVideoSrcRef.current = currentSrc;
            console.log('[MobilePlayer] Video source changed, loading:', dedication?.name);
            video.load();
        } else {
            console.log('[MobilePlayer] Video source unchanged, not reloading');
        }

        // If already ready and should play, play now
        if (isPlaying && video.readyState >= 3 && video.paused) {
            console.log('[MobilePlayer] Video already ready, playing immediately');
            video.play().catch(e => console.error("Video play error:", e));
        } else {
            console.log('[MobilePlayer] Video loading effect - not playing immediately. readyState:', video.readyState, 'paused:', video.paused);
        }
    }, [dedication?.video_message, hasVideoGreeting, isGreeting, isPlaying]);

    // Video play/pause sync
    useEffect(() => {
        console.log('[MobilePlayer] Play/pause sync effect - isPlaying:', isPlaying, 'hasVideoGreeting:', hasVideoGreeting, 'isGreeting:', isGreeting);
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) {
            console.log('[MobilePlayer] Play/pause sync - skipping (conditions not met)');
            return;
        }

        const video = videoRef.current;

        if (Math.abs(video.currentTime - currentTime) > 0.5) {
            console.log('[MobilePlayer] Play/pause sync - seeking video to:', currentTime);
            video.currentTime = currentTime;
        }

        if (isPlaying) {
            if (video.readyState >= 3 && video.paused) {
                console.log('[MobilePlayer] Play/pause sync - attempting to play video. readyState:', video.readyState);
                video.play().catch(e => console.error("Video play sync error:", e));
            } else {
                console.log('[MobilePlayer] Play/pause sync - not playing. readyState:', video.readyState, 'paused:', video.paused);
            }
        } else {
            if (!video.paused) {
                console.log('[MobilePlayer] Play/pause sync - pausing video');
                video.pause();
            }
        }
    }, [isPlaying, currentTime, hasVideoGreeting, isGreeting]);

    const handleVideoEnded = () => {
        skipToSong();
    };

    // Guard video time updates - only update if still in greeting phase
    // This prevents late timeupdate events during exit animation from overwriting song time
    const handleVideoTimeUpdate = (time) => {
        if (phase === 'greeting') {
            setCurrentTime(time);
        }
    };

    const handleVideoDurationChange = (dur) => {
        if (phase === 'greeting') {
            setDuration(dur);
        }
    };

    const handleSeek = (time) => {
        seek(time);
        if (videoRef.current && hasVideoGreeting && isGreeting) {
            videoRef.current.currentTime = time;
        }
    };

    const handleTogglePlay = () => {
        togglePlay();
    };

    const handleSkipToSong = () => {
        skipToSong();
    };

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
        console.log('[MobilePlayer] handleDragEnd - offset:', offset, 'velocity:', velocity, 'threshold:', threshold, 'isGreeting:', isGreeting);

        if (offset > threshold || velocity > 500) {
            // Swipe right - go to previous
            console.log('[MobilePlayer] Swipe right - calling onPrevious');
            x.set(0);
            onPrevious();
        } else if (offset < -threshold || velocity < -500) {
            // Swipe left - go to next (song if greeting, next dedication if song)
            x.set(0);
            if (isGreeting) {
                console.log('[MobilePlayer] Swipe left (greeting) - calling handleSkipToSong');
                handleSkipToSong();
            } else {
                console.log('[MobilePlayer] Swipe left (song) - calling onNext');
                onNext();
            }
        } else {
            console.log('[MobilePlayer] Swipe not far enough - snapping back');
            // Snap back with spring animation
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
            {/* Segment Progress Bar */}
            <SegmentProgressBar
                current={currentIndex}
                total={totalCount}
                progress={currentTime}
                duration={duration}
            />

            {/* Swipeable Content Container */}
            <motion.div
                ref={containerRef}
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
                            isPlayingRef={isPlayingRef}
                            shouldAutoPlayOnMountRef={shouldAutoPlayOnMountRef}
                            progress={currentTime}
                            duration={duration}
                            onTogglePlay={handleTogglePlay}
                            onPlay={play}
                            onSeek={handleSeek}
                            onEnded={handleVideoEnded}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onDurationChange={handleVideoDurationChange}
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
                            onTogglePlay={handleTogglePlay}
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
                            onClick={handleSkipToSong}
                        />
                    )}
                </AnimatePresence>

                {/* Glassmorphic Controls */}
                <GlassmorphicControls
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    onClose={onClose}
                    showSwipeHint={!isDragging}
                />
            </div>
        </motion.div>
    );
};

export default MobileImmersivePlayer;
