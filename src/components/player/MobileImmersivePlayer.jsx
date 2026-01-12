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

    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            const { videoWidth, videoHeight } = videoRef.current;
            setIsPortrait(videoHeight > videoWidth);
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
                    className={`relative rounded-2xl overflow-hidden shadow-floating bg-celebration-charcoal ${
                        isPortrait
                            ? 'w-[55%] max-w-[240px] aspect-[9/16]'
                            : 'w-[90%] max-w-sm aspect-video'
                    }`}
                >
                    <video
                        ref={videoRef}
                        src={dedication.video_message}
                        className={`w-full h-full object-cover transition-all duration-500 ${!isPlaying ? 'blur-sm' : ''}`}
                        playsInline
                        muted={false}
                        onEnded={onEnded}
                        onClick={onTogglePlay}
                        onLoadedMetadata={handleLoadedMetadata}
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
const FooterNavigation = ({ onPrevious, onNext, onClose, isGreeting }) => (
    <div className="w-full px-8 py-6 flex items-center justify-between">
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
        setIsPlaying,
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
