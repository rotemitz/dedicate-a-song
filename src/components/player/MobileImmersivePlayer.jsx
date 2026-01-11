import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SegmentProgressBar,
    WaveformVisualizer,
    VinylRecord,
    TimelineSlider,
    PrimaryActionButton,
    DedicationAvatar
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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
};

// ============================================
// FULLSCREEN VIDEO PLAYER (for video greetings)
// ============================================
const FullscreenVideoPlayer = ({ videoRef, dedication, isPlaying, onTogglePlay, onCollapse, onSkipToSong, onEnded }) => {
    const [controlsVisible, setControlsVisible] = useState(true);
    const [hideTimeout, setHideTimeout] = useState(null);

    const showControls = () => {
        setControlsVisible(true);
        if (hideTimeout) clearTimeout(hideTimeout);
        const timeout = setTimeout(() => setControlsVisible(false), 3000);
        setHideTimeout(timeout);
    };

    useEffect(() => {
        showControls();
        return () => {
            if (hideTimeout) clearTimeout(hideTimeout);
        };
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2100] bg-black flex items-center justify-center"
            onClick={showControls}
            onTouchStart={showControls}
        >
            {/* Video Element - centered with auto-fit */}
            <video
                ref={videoRef}
                src={dedication.video_message}
                className="absolute inset-0 w-full h-full object-contain"
                playsInline
                muted={false}
                onEnded={onEnded}
                onClick={(e) => {
                    e.stopPropagation();
                    onTogglePlay();
                }}
            />

            {/* Always Visible Top Bar - Collapse and Skip Buttons */}
            <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-10">
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onSkipToSong();
                    }}
                    className="p-3 rounded-full bg-black/60 hover:bg-black/80 transition-colors backdrop-blur-sm"
                    aria-label="Skip to song"
                >
                    <span className="material-symbols-outlined text-white">skip_next</span>
                </button>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onCollapse();
                    }}
                    className="p-3 rounded-full bg-black/60 hover:bg-black/80 transition-colors backdrop-blur-sm"
                    aria-label="Collapse video"
                >
                    <span className="material-symbols-outlined text-white">close</span>
                </button>
            </div>

            {/* Auto-hiding Controls Overlay */}
            <AnimatePresence>
                {controlsVisible && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"
                    >

                        {/* Center - Play/Pause Indicator (when paused) */}
                        {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="p-6 rounded-full bg-white/20 backdrop-blur-sm">
                                    <span className="material-symbols-outlined text-white !text-7xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                        play_arrow
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Bottom Info */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 pb-8">
                            <p className="text-white/80 text-sm mb-1">Video message from</p>
                            <h2 className="text-white text-2xl font-serif">{dedication.name}</h2>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

// ============================================
// VOICE PHASE VIEW
// ============================================
const VoicePhaseView = ({
    dedication,
    isPlaying,
    progress,
    duration,
    onTogglePlay,
    onSkipToSong,
    onSeek,
    onExpandVideo
}) => (
    <motion.div
        key="voice-phase"
        variants={contentTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center justify-center px-6 gap-4"
    >
        {/* Header */}
        <div className="text-center">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                {dedication.video_message ? 'Video Dedication' : 'Voice Dedication'}
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                A message from <span className="italic">{dedication.name}</span>
            </h1>
        </div>

        {/* Expand to Fullscreen Button (when video is playing in background) */}
        {dedication.video_message && onExpandVideo && (
            <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={onExpandVideo}
                className="px-4 py-2 bg-rose-gold-500 text-white rounded-full text-sm font-medium hover:bg-rose-gold-600 transition-colors flex items-center gap-2"
            >
                <span className="material-symbols-outlined text-sm">fullscreen</span>
                View Video
            </motion.button>
        )}

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
        transition={{ duration: 0.4 }}
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
                size="w-72 h-72"
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
const FooterNavigation = ({ onPrevious, onNext, isGreeting }) => (
    <div className="w-full px-8 pb-10 flex justify-between">
        <button onClick={onPrevious} className="text-left">
            <p className="text-[10px] uppercase tracking-tighter text-rose-gold-400">Previous</p>
            <p className="text-sm font-medium text-celebration-charcoal mt-1">Dedication</p>
        </button>
        <button onClick={onNext} className="text-right">
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
    const [isVideoFullscreen, setIsVideoFullscreen] = useState(true);

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
        setIsPlaying,
    } = useAudioPlayer();

    // Video ref for video greetings (kept local for display)
    const videoRef = useRef(null);

    // Determine if we're in greeting phase
    const isGreeting = phase === 'greeting';
    const hasVideoGreeting = dedication.video_message != null;

    // Reset video fullscreen on dedication change
    useEffect(() => {
        setIsVideoFullscreen(true);
    }, [dedication]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Handle video playback sync with global state
    useEffect(() => {
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) return;

        // Sync video time with global currentTime
        if (Math.abs(videoRef.current.currentTime - currentTime) > 0.5) {
            videoRef.current.currentTime = currentTime;
        }

        if (isPlaying) {
            videoRef.current.play().catch(e => console.error("Video play error:", e));
        } else {
            videoRef.current.pause();
        }
    }, [isPlaying, hasVideoGreeting, isGreeting, currentTime]);

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
            className="fixed inset-0 z-[2000] min-h-screen w-full flex flex-col items-center bg-celebration-cream"
            style={{ paddingTop: 'max(16px, env(safe-area-inset-top))' }}
        >
            {/* Segment Progress Bar */}
            <SegmentProgressBar
                current={currentIndex}
                total={totalCount}
                progress={currentTime}
                duration={duration}
            />

            {/* Close Button */}
            <button
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors shadow-premium"
                onClick={onClose}
            >
                <span className="material-symbols-outlined text-celebration-charcoal">close</span>
            </button>

            {/* Fullscreen Video Player (for video greetings) */}
            {isGreeting && hasVideoGreeting && isVideoFullscreen && (
                <FullscreenVideoPlayer
                    videoRef={videoRef}
                    dedication={dedication}
                    isPlaying={isPlaying}
                    onTogglePlay={handleTogglePlay}
                    onCollapse={() => setIsVideoFullscreen(false)}
                    onSkipToSong={handleSkipToSong}
                    onEnded={handleVideoEnded}
                />
            )}

            {/* Hidden video for non-fullscreen mode */}
            {hasVideoGreeting && !isVideoFullscreen && isGreeting && (
                <video
                    ref={videoRef}
                    src={dedication.video_message}
                    className="hidden"
                    playsInline
                    muted={false}
                    onEnded={handleVideoEnded}
                />
            )}

            {/* Phase Content */}
            <AnimatePresence mode="wait">
                {isGreeting ? (
                    <VoicePhaseView
                        key="voice"
                        dedication={dedication}
                        isPlaying={isPlaying}
                        progress={currentTime}
                        duration={duration}
                        onTogglePlay={handleTogglePlay}
                        onSkipToSong={handleSkipToSong}
                        onSeek={handleSeek}
                        onExpandVideo={hasVideoGreeting && !isVideoFullscreen ? () => setIsVideoFullscreen(true) : null}
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
                isGreeting={isGreeting}
            />
        </motion.div>
    );
};

export default MobileImmersivePlayer;
