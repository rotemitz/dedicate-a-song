import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WaveformVisualizer, DedicationAvatar, VinylRecord } from './PlayerComponents';
import { useAudioPlayer } from '../../context/AudioContext';

// Helper function
const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
};

// ============================================
// DESKTOP SEGMENT PROGRESS BAR
// ============================================
const DesktopSegmentBar = ({ current, total, progress, duration }) => {
    const segmentProgress = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div className="flex gap-2 w-full">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-1.5 flex-1 rounded-full overflow-hidden bg-rose-gold-200/30"
                >
                    {i < current ? (
                        // Completed segments
                        <div className="h-full w-full rounded-full bg-rose-gold-500" />
                    ) : i === current ? (
                        // Active segment with animated fill
                        <motion.div
                            className="h-full rounded-full bg-rose-gold-500"
                            initial={{ width: 0 }}
                            animate={{ width: `${segmentProgress}%` }}
                            transition={{ duration: 0.1, ease: "linear" }}
                        />
                    ) : null}
                </div>
            ))}
        </div>
    );
};

// ============================================
// DESKTOP HEADER
// ============================================
const DesktopHeader = ({ eventTitle, current, total, progress, duration, onClose }) => (
    <div className="flex flex-col gap-4 px-8 pt-8 pb-4">
        <DesktopSegmentBar current={current} total={total} progress={progress} duration={duration} />
        <div className="flex items-center justify-between">
            <h1 className="font-display text-xl text-celebration-charcoal">{eventTitle}</h1>
            <div className="flex items-center gap-6">
                <span className="font-display text-sm text-celebration-charcoal/70">
                    Segment {current + 1} of {total}
                </span>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                    aria-label="Close player"
                >
                    <span className="material-symbols-outlined text-rose-gold-500">close</span>
                </button>
            </div>
        </div>
    </div>
);

// ============================================
// VIDEO PLAYER (Clean video with no card wrapper)
// ============================================
const VideoPlayer = ({
    dedication,
    videoRef,
    isPlaying,
    isPortraitVideo,
    onEnded,
    onTogglePlay,
    onVideoCanPlay,
    onTimeUpdate,
    onLoadedMetadata
}) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className="relative h-full flex items-center justify-end"
        style={{ willChange: 'transform, opacity' }}
    >
        {/* Video with rounded corners - height matches container, width by aspect ratio */}
        <div
            className="relative h-full overflow-hidden"
            style={{
                borderRadius: '48px',
                boxShadow: '0 20px 50px rgba(0,0,0,0.15)'
            }}
        >
            <video
                ref={videoRef}
                src={dedication.video_message}
                className="h-full w-auto object-contain"
                playsInline
                preload="metadata"
                onEnded={onEnded}
                onClick={onTogglePlay}
                onCanPlay={onVideoCanPlay}
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={onLoadedMetadata}
                onDurationChange={onLoadedMetadata}
                style={{ borderRadius: '48px' }}
            />
            {/* Play Overlay */}
            <AnimatePresence>
                {!isPlaying && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                        style={{ borderRadius: '48px' }}
                        onClick={onTogglePlay}
                    >
                        <span className="material-symbols-outlined text-white !text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                            play_circle
                        </span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Sender Name Badge with gradient */}
            <div
                className={`absolute bottom-6 z-10 ${isPortraitVideo ? 'left-1/2 -translate-x-1/2' : 'right-6'} backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg`}
                style={{
                    background: 'linear-gradient(135deg, rgba(212, 144, 123, 0.95) 0%, rgba(180, 100, 80, 0.95) 100%)'
                }}
            >
                <h2 className="text-xl font-bold text-white font-display">{dedication.name}</h2>
            </div>
        </div>
    </motion.div>
);

// ============================================
// GREETING CARD (For voice messages only - Dark)
// ============================================
const VoiceGreetingCard = ({
    dedication,
    isPlaying,
    isGreeting
}) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        style={{
            borderRadius: '80px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            minHeight: '400px',
            willChange: 'transform, opacity'
        }}
        className="relative w-full h-full bg-celebration-charcoal overflow-hidden flex flex-col"
    >
        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center p-10">
            {dedication.voice_message ? (
                <div className="flex flex-col items-center justify-center gap-6">
                    {/* Avatar */}
                    <DedicationAvatar
                        src={dedication.photo}
                        alt={dedication.name}
                        isPlaying={isPlaying && isGreeting}
                        size="large"
                    />
                    {/* Waveform visualization */}
                    <WaveformVisualizer isPlaying={isPlaying && isGreeting} barCount={16} />
                </div>
            ) : (
                <div className="text-center text-white/50">
                    <span className="material-symbols-outlined !text-6xl mb-4">mic_off</span>
                    <p>No greeting available</p>
                </div>
            )}
        </div>

        {/* Sender Name Badge with gradient */}
        <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-lg"
            style={{
                background: 'linear-gradient(135deg, rgba(212, 144, 123, 0.95) 0%, rgba(180, 100, 80, 0.95) 100%)'
            }}
        >
            <h2 className="text-xl font-bold text-white font-display">{dedication.name}</h2>
        </div>
    </motion.div>
);

// ============================================
// VINYL/MUSIC CARD (Right - Light)
// ============================================
const VinylCard = ({
    dedication,
    isPlaying,
    isGreeting,
    onSkipToSong,
    onTogglePlay
}) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1], delay: 0.05 }}
        style={{
            borderRadius: '80px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            minHeight: '400px',
            willChange: 'transform, opacity'
        }}
        className="relative w-full h-full bg-celebration-cream-light overflow-hidden flex flex-col items-center justify-center"
    >
        {/* Vinyl Record - Clickable for skip/play-pause */}
        <VinylRecord
            albumArt={dedication.song?.album_art || dedication.photo}
            songTitle={dedication.song?.title}
            isPlaying={isPlaying && !isGreeting}
            size="w-64 h-64"
            onClick={isGreeting ? onSkipToSong : onTogglePlay}
        />

        {/* Now Playing Info - Bottom Center */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
            <h2 className="text-2xl font-semibold font-display text-celebration-charcoal mb-1">{dedication.song?.title}</h2>
            <p className="text-rose-gold-500/80 italic font-sans">{dedication.song?.artist}</p>
        </div>
    </motion.div>
);

// ============================================
// DESKTOP FOOTER CONTROLS
// ============================================
const DesktopFooterControls = ({
    onPrevious,
    onNext,
    onTogglePlay,
    isPlaying,
    volume,
    onVolumeChange
}) => (
    <div className="h-[120px] flex items-center justify-center px-8">
        <div className="flex items-center gap-8 px-10 py-4 rounded-full bg-white/60 backdrop-blur-xl border border-white/40 shadow-xl">
            {/* Previous */}
            <button
                onClick={onPrevious}
                className="text-rose-gold-500 hover:text-rose-gold-700 transition-colors p-2"
            >
                <span className="material-symbols-outlined !text-3xl">skip_previous</span>
            </button>

            {/* Play/Pause FAB */}
            <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform bg-gradient-to-br from-rose-gold-300 to-rose-gold-500"
                style={{ boxShadow: '0 8px 24px rgba(212, 144, 123, 0.4)' }}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </button>

            {/* Next */}
            <button
                onClick={onNext}
                className="text-rose-gold-500 hover:text-rose-gold-700 transition-colors p-2"
            >
                <span className="material-symbols-outlined !text-3xl">skip_next</span>
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-rose-gold-200/30 mx-4" />

            {/* Volume Control */}
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-rose-gold-500 !text-2xl">
                    {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                </span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-28 h-1.5 rounded-full appearance-none cursor-pointer volume-slider"
                    style={{
                        background: `linear-gradient(to right, #D4907B 0%, #D4907B ${volume * 100}%, rgba(212, 144, 123, 0.2) ${volume * 100}%, rgba(212, 144, 123, 0.2) 100%)`
                    }}
                    aria-label="Volume"
                />
            </div>
        </div>
    </div>
);

// ============================================
// MAIN DESKTOP IMMERSIVE PLAYER
// ============================================
const DesktopImmersivePlayer = ({
    dedication,
    currentIndex = 0,
    totalCount = 1,
    eventTitle = "Birthday Wishes",
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
        volume,
        togglePlay,
        seek,
        skipToSong,
        changeVolume,
        setCurrentTime,
        setDuration,
    } = useAudioPlayer();

    // Video ref for video greetings (kept local for display)
    const videoRef = useRef(null);
    const lastVideoSrcRef = useRef(null);
    const pendingAutoplayRef = useRef(false);

    // Track video aspect ratio for layout
    const [videoAspectRatio, setVideoAspectRatio] = useState(null);

    const isGreeting = phase === 'greeting';
    const hasVideoGreeting = dedication.video_message != null;
    const isPortraitVideo = videoAspectRatio !== null && videoAspectRatio < 1;

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Reset video aspect ratio when dedication changes
    useEffect(() => {
        setVideoAspectRatio(null);
    }, [dedication]);

    // Dedicated effect to handle video loading when dedication changes
    // Only loads when the video source actually changes to avoid race conditions
    useEffect(() => {
        if (!videoRef.current || !hasVideoGreeting || !isGreeting) return;

        const video = videoRef.current;
        const currentSrc = dedication?.video_message;

        // Only call load() if the source actually changed
        if (lastVideoSrcRef.current !== currentSrc) {
            lastVideoSrcRef.current = currentSrc;
            console.log('[DesktopPlayer] Video source changed, loading:', dedication?.name);
            // Mark that we want to autoplay when video is ready
            pendingAutoplayRef.current = isPlaying;
            video.load();
        }

        // If already ready and should play, play now
        // Otherwise, handleVideoCanPlay callback will handle it when video is ready
        if (isPlaying && video.readyState >= 3 && video.paused) {
            console.log('[DesktopPlayer] Video ready, playing immediately');
            video.play().catch(e => console.error("Video play error:", e));
        }
    }, [dedication?.video_message, hasVideoGreeting, isGreeting, isPlaying]);

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

    // Note: Video progress tracking is handled via onTimeUpdate/onLoadedMetadata
    // props passed to GreetingCard to avoid timing issues

    // Sync volume to video
    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.volume = volume;
        }
    }, [volume]);

    const handleVideoEnded = () => {
        skipToSong();
    };

    const handleVideoCanPlay = () => {
        // Auto-play when video is ready and we're supposed to be playing
        // This handles the case when navigating via "Next" button where
        // the effect runs before the video element is ready
        console.log('[DesktopPlayer] handleVideoCanPlay - isPlaying:', isPlaying, 'paused:', videoRef.current?.paused, 'pendingAutoplay:', pendingAutoplayRef.current);
        if ((isPlaying || pendingAutoplayRef.current) && videoRef.current?.paused) {
            console.log('[DesktopPlayer] Triggering autoplay from handleVideoCanPlay');
            pendingAutoplayRef.current = false;
            videoRef.current.play().catch(e => console.error("Video auto-play error:", e));
        }
    };

    // Guard video time updates - only update if still in greeting phase
    // This prevents late events during phase transition from overwriting song time
    const handleVideoTimeUpdate = (e) => {
        if (isGreeting) {
            setCurrentTime(e.target.currentTime);
        }
    };

    const handleVideoLoadedMetadata = (e) => {
        if (isGreeting) {
            setDuration(e.target.duration);
        }
        // Capture video aspect ratio for layout
        const video = e.target;
        if (video.videoWidth && video.videoHeight) {
            setVideoAspectRatio(video.videoWidth / video.videoHeight);
        }
    };

    const handleTogglePlay = () => {
        togglePlay();
    };

    return (
        <div
            className="fixed inset-0 z-[2000] flex flex-col overflow-hidden font-sans"
            style={{
                background: 'linear-gradient(180deg, #FDF8F2 0%, #F4E4E0 100%)'
            }}
        >
            {/* Header */}
            <DesktopHeader
                eventTitle={eventTitle}
                current={currentIndex}
                total={totalCount}
                progress={currentTime}
                duration={duration}
                onClose={onClose}
            />

            {/* Hero Section - Split Cards */}
            <div className="flex-1 flex items-center justify-center px-8 py-4">
                {hasVideoGreeting ? (
                    /* Video layout: video sizes by aspect ratio, both centered */
                    <div className="flex items-center justify-center gap-10 h-full max-h-[600px]">
                        <VideoPlayer
                            dedication={dedication}
                            videoRef={videoRef}
                            isPlaying={isPlaying}
                            isPortraitVideo={isPortraitVideo}
                            onEnded={handleVideoEnded}
                            onTogglePlay={handleTogglePlay}
                            onVideoCanPlay={handleVideoCanPlay}
                            onTimeUpdate={handleVideoTimeUpdate}
                            onLoadedMetadata={handleVideoLoadedMetadata}
                        />
                        <div className="h-full aspect-square">
                            <VinylCard
                                dedication={dedication}
                                isPlaying={isPlaying}
                                isGreeting={isGreeting}
                                onSkipToSong={skipToSong}
                                onTogglePlay={handleTogglePlay}
                            />
                        </div>
                    </div>
                ) : (
                    /* Voice/no greeting layout: equal width cards */
                    <div className="w-full max-w-5xl flex gap-10 h-full max-h-[600px]">
                        <div className="flex-1">
                            <VoiceGreetingCard
                                dedication={dedication}
                                isPlaying={isPlaying}
                                isGreeting={isGreeting}
                            />
                        </div>
                        <div className="flex-1">
                            <VinylCard
                                dedication={dedication}
                                isPlaying={isPlaying}
                                isGreeting={isGreeting}
                                onSkipToSong={skipToSong}
                                onTogglePlay={handleTogglePlay}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Footer Controls */}
            <DesktopFooterControls
                onPrevious={onPrevious}
                onNext={onNext}
                onTogglePlay={handleTogglePlay}
                isPlaying={isPlaying}
                volume={volume}
                onVolumeChange={changeVolume}
            />
        </div>
    );
};

export default DesktopImmersivePlayer;
