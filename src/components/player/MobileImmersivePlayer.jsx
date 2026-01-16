import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SegmentProgressBar,
    WaveformVisualizer,
    VinylRecord,
    TimelineSlider,
    PrimaryActionButton,
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
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
};

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
    onSkipToSong,
    onSeek,
    onEnded
}) => {
    const [isPortrait, setIsPortrait] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    // Ensure video loads when component mounts or source changes
    // This handles the AnimatePresence timing issue where the parent's effect
    // runs before this component mounts
    useEffect(() => {
        if (videoRef.current && dedication.video_message) {
            setIsVideoLoading(true);
            videoRef.current.load();
        }
    }, [dedication.video_message, videoRef]);

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            setIsPortrait(videoHeight > videoWidth);
        }
    };

    const handleCanPlay = () => {
        setIsVideoLoading(false);
        // Auto-play when video is ready and we're supposed to be playing
        // This handles the case when navigating via "Next" button where
        // the effect runs before the video element mounts
        if (isPlaying && videoRef.current?.paused) {
            videoRef.current.play().catch(e => console.error("Video auto-play error:", e));
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
            className="flex-1 flex flex-col items-center justify-center px-6 gap-4"
        >
            {/* Header */}
            <div className="text-center">
                <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                    Video Dedication
                </p>
                <h1 className="text-2xl font-serif text-celebration-charcoal">
                    A message from <span className="italic">{dedication.name}</span>
                </h1>
            </div>

            {/* Video Card - adapts to portrait or landscape */}
            <div className="my-6 w-full flex justify-center">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`relative rounded-2xl overflow-hidden shadow-floating bg-celebration-charcoal ${isPortrait
                        ? 'w-[55%] max-w-[240px] aspect-[9/16]'
                        : 'w-[90%] max-w-sm aspect-video'
                        }`}
                >
                    {/* Video loading overlay */}
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
                    />
                </motion.div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-6">
                {/* Play/Pause Button */}
                <PrimaryActionButton onClick={onTogglePlay}>
                    <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </PrimaryActionButton>

                {/* Skip to Song Button */}
                {dedication.song?.local_file && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <PrimaryActionButton variant="skip" onClick={onSkipToSong}>
                            <span className="material-symbols-outlined !text-xl">skip_next</span>
                            Skip to Song
                        </PrimaryActionButton>
                    </motion.div>
                )}

                {/* Timeline */}
                <div className="w-full mt-4">
                    <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
                </div>
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
    onTogglePlay,
    onSkipToSong,
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
        className="flex-1 flex flex-col items-center justify-center px-6 gap-4"
    >
        {/* Header */}
        <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                Voice Dedication
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                A message from <span className="italic">{dedication.name}</span>
            </h1>
        </div>

        {/* Hero Profile */}
        <div className="my-8 flex flex-col items-center gap-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                <DedicationAvatar
                    src={dedication.photo}
                    alt={dedication.name}
                    isPlaying={isPlaying}
                    size="large"
                />
            </motion.div>

            {/* Waveform */}
            <div className="mt-6">
                <WaveformVisualizer isPlaying={isPlaying} barCount={16} />
            </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
            {/* Play/Pause Button */}
            <PrimaryActionButton onClick={onTogglePlay}>
                <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </PrimaryActionButton>

            {/* Skip to Song Button */}
            {dedication.song?.local_file && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                >
                    <PrimaryActionButton variant="skip" onClick={onSkipToSong}>
                        <span className="material-symbols-outlined !text-xl">skip_next</span>
                        Skip to Song
                    </PrimaryActionButton>
                </motion.div>
            )}

            {/* Timeline */}
            <div className="w-full mt-8">
                <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
            </div>
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
        className="flex-1 flex flex-col items-center justify-center px-6 gap-4"
    >
        {/* Header */}
        <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                40th Birthday
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                Now Playing
            </h1>
        </div>

        {/* Hero Vinyl */}
        <div className="my-8 flex flex-col items-center">
            <VinylRecord
                albumArt={dedication.song?.album_art || dedication.photo}
                songTitle={dedication.song?.title}
                isPlaying={isPlaying}
                size="w-56 h-56"
                onClick={onTogglePlay}
            />
        </div>

        {/* Song Info */}
        <div className="text-center mb-6">
            <h2 className="text-3xl font-serif text-celebration-charcoal mb-2">
                {dedication.song?.title}
            </h2>
            <p className="text-lg text-rose-gold-600 font-sans">
                {dedication.song?.artist}
            </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col items-center gap-6">
            {/* Play/Pause Button */}
            <PrimaryActionButton onClick={onTogglePlay}>
                <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </PrimaryActionButton>
        </div>

        {/* Timeline */}
        <div className="w-full mt-8">
            <TimelineSlider progress={progress} duration={duration} onSeek={onSeek} />
        </div>
    </motion.div>
);

// ============================================
// FOOTER NAVIGATION
// ============================================
const FooterNavigation = ({ onPrevious, onNext, onClose, isGreeting }) => (
    <div
        className="w-full px-8 pt-6 flex items-center justify-between"
        style={{ paddingBottom: 'max(24px, calc(16px + env(safe-area-inset-bottom)))' }}
    >
        <button onClick={onPrevious} className="text-left flex-1">
            <p className="text-[10px] uppercase tracking-tighter text-rose-gold-400">Previous</p>
            <p className="text-sm font-medium text-celebration-charcoal mt-1">Dedication</p>
        </button>

        {/* Close button - centered */}
        <button
            onClick={onClose}
            className="w-12 h-12 rounded-full bg-white/80 hover:bg-white transition-colors shadow-md mx-4 flex items-center justify-center"
            aria-label="Close player"
        >
            <span className="material-symbols-outlined text-celebration-charcoal leading-none">close</span>
        </button>

        <button onClick={onNext} className="text-right flex-1">
            <p className="text-[10px] uppercase tracking-tighter text-rose-gold-400">Next</p>
            <p className="text-sm font-medium text-celebration-charcoal mt-1">
                {isGreeting ? 'Song' : 'Dedication'}
            </p>
        </button>
    </div>
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
    // Use global audio context
    const {
        isPlaying,
        currentTime,
        duration,
        phase,
        togglePlay,
        seek,
        skipToSong,
        setCurrentTime,
        setDuration,
    } = useAudioPlayer();

    // Video ref for video greetings (kept local for display)
    const videoRef = useRef(null);

    // Determine if we're in greeting phase
    const isGreeting = phase === 'greeting';
    const hasVideoGreeting = dedication.video_message != null;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Dedicated effect to handle video loading when dedication changes
    // This runs when we navigate to a new video dedication
    useEffect(() => {
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) return;

        const video = videoRef.current;
        console.log('[MobilePlayer] Video dedication effect - loading video for:', dedication?.name);

        // Force load the video (in case src was just updated in JSX)
        video.load();

        // Only attempt to play if we should be playing
        if (isPlaying) {
            const attemptPlay = () => {
                console.log('[MobilePlayer] Attempting to play video, readyState:', video.readyState);
                video.play().catch(e => console.error("Video play error:", e));
            };

            // Check if video is ready to play
            if (video.readyState >= 3) { // HAVE_FUTURE_DATA or higher
                attemptPlay();
            } else {
                // Wait for video to be ready - use canplay for faster start on slow connections
                const handleCanPlay = () => {
                    console.log('[MobilePlayer] Video canplay fired');
                    attemptPlay();
                    video.removeEventListener('canplay', handleCanPlay);
                };
                video.addEventListener('canplay', handleCanPlay);
                return () => video.removeEventListener('canplay', handleCanPlay);
            }
        }
    }, [dedication?.video_message, hasVideoGreeting, isGreeting, isPlaying]); // Trigger on video source change

    // Handle play/pause sync with global state (separate from loading)
    useEffect(() => {
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) return;

        const video = videoRef.current;

        // Sync video time with global currentTime (only if significantly different)
        if (Math.abs(video.currentTime - currentTime) > 0.5) {
            video.currentTime = currentTime;
        }

        if (isPlaying) {
            // Only play if video is ready
            if (video.readyState >= 3 && video.paused) {
                video.play().catch(e => console.error("Video play sync error:", e));
            }
        } else {
            if (!video.paused) {
                video.pause();
            }
        }
    }, [isPlaying, currentTime, hasVideoGreeting, isGreeting]);

    // Video progress tracking
    useEffect(() => {
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) return;

        const video = videoRef.current;
        const handleTimeUpdate = () => {
            setCurrentTime(video.currentTime);
        };
        const handleLoadedMetadata = () => {
            setDuration(video.duration);
        };

        video.addEventListener('timeupdate', handleTimeUpdate);
        video.addEventListener('loadedmetadata', handleLoadedMetadata);

        return () => {
            video.removeEventListener('timeupdate', handleTimeUpdate);
            video.removeEventListener('loadedmetadata', handleLoadedMetadata);
        };
    }, [hasVideoGreeting, isGreeting, setCurrentTime, setDuration]);

    const handleVideoEnded = () => {
        skipToSong();
    };

    const handleSeek = (time) => {
        seek(time);
        // Also seek video if in video greeting mode
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

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[2000] h-[100dvh] w-full flex flex-col items-center bg-celebration-cream overflow-hidden"
            style={{
                paddingTop: 'max(16px, env(safe-area-inset-top))',
                paddingBottom: 'env(safe-area-inset-bottom)'
            }}
        >
            {/* Segment Progress Bar */}
            <SegmentProgressBar
                current={currentIndex}
                total={totalCount}
                progress={currentTime}
                duration={duration}
            />

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
                        onTogglePlay={handleTogglePlay}
                        onSkipToSong={handleSkipToSong}
                        onSeek={handleSeek}
                        onEnded={handleVideoEnded}
                    />
                ) : isGreeting ? (
                    <VoicePhaseView
                        key="voice"
                        dedication={dedication}
                        isPlaying={isPlaying}
                        progress={currentTime}
                        duration={duration}
                        onTogglePlay={handleTogglePlay}
                        onSkipToSong={handleSkipToSong}
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

            {/* Footer Navigation */}
            <FooterNavigation
                onPrevious={onPrevious}
                onNext={() => {
                    if (isGreeting) handleSkipToSong();
                    else onNext();
                }}
                onClose={onClose}
                isGreeting={isGreeting}
            />
        </motion.div>
    );
};

export default MobileImmersivePlayer;
