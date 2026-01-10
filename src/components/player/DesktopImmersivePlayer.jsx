import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

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
                    className="h-1.5 flex-1 rounded-full overflow-hidden"
                    style={{ backgroundColor: 'rgba(229, 178, 163, 0.3)' }}
                >
                    {i < current ? (
                        // Completed segments
                        <div className="h-full w-full rounded-full bg-[#D4907B]" />
                    ) : i === current ? (
                        // Active segment with animated fill
                        <motion.div
                            className="h-full rounded-full bg-[#D4907B]"
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
            <h1 className="font-display text-xl text-slate-700">{eventTitle}</h1>
            <div className="flex items-center gap-6">
                <span className="font-display text-sm text-slate-500">
                    Segment {current + 1} of {total}
                </span>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-black/5 transition-colors"
                >
                    <span className="material-symbols-outlined text-[#D4907B]">close</span>
                </button>
            </div>
        </div>
    </div>
);

// ============================================
// GREETING CARD (Left - Dark)
// ============================================
const GreetingCard = ({
    dedication,
    videoRef,
    audioRef,
    isPlaying,
    isGreeting,
    onEnded,
    onTogglePlay
}) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative flex-1 bg-[#2D2D2D] overflow-hidden flex flex-col"
        style={{
            borderRadius: '80px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
            minHeight: '400px'
        }}
    >
        {/* Content Area */}
        <div className="flex-1 relative flex items-center justify-center p-10">
            {dedication.video_message ? (
                <div className="relative w-full h-full rounded-3xl overflow-hidden">
                    <video
                        ref={videoRef}
                        src={dedication.video_message}
                        className="w-full h-full object-cover"
                        playsInline
                        onEnded={onEnded}
                        onClick={onTogglePlay}
                    />
                    {/* Play Overlay */}
                    <AnimatePresence>
                        {!isPlaying && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 flex items-center justify-center bg-black/40 cursor-pointer"
                                onClick={onTogglePlay}
                            >
                                <span className="material-symbols-outlined text-white !text-8xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                                    play_circle
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            ) : dedication.voice_message ? (
                <div className="relative flex flex-col items-center justify-center gap-6">
                    {/* Avatar */}
                    <div className={`w-48 h-48 rounded-full overflow-hidden border-4 border-white/20 shadow-2xl ${isPlaying && isGreeting ? 'animate-soft-pulse' : ''}`}>
                        <img
                            src={dedication.photo || 'assets/placeholder.png'}
                            alt={dedication.name}
                            className={`w-full h-full object-cover ${!isPlaying ? 'blur-sm grayscale' : ''} transition-all duration-700`}
                        />
                    </div>
                    {/* Waveform visualization */}
                    <div className="flex items-center justify-center gap-1 h-12">
                        {[...Array(16)].map((_, i) => (
                            <div
                                key={i}
                                className={`w-1 rounded-full bg-gradient-to-t from-[#D4907B] to-[#E5B2A3] ${isPlaying && isGreeting ? 'animate-pulse' : 'opacity-30'}`}
                                style={{
                                    height: Math.random() * 24 + 12 + 'px',
                                    animationDelay: i * 0.08 + 's'
                                }}
                            />
                        ))}
                    </div>
                    <audio ref={audioRef} src={dedication.voice_message} onEnded={onEnded} />
                    {/* Clickable overlay for play */}
                    {!isPlaying && (
                        <div
                            className="absolute inset-0 flex items-center justify-center cursor-pointer"
                            onClick={onTogglePlay}
                        >
                            <span className="material-symbols-outlined text-white !text-8xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
                                play_circle
                            </span>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-white/50">
                    <span className="material-symbols-outlined !text-6xl mb-4">mic_off</span>
                    <p>No greeting available</p>
                </div>
            )}
        </div>

        {/* From Label - Bottom Left */}
        <div className="absolute bottom-8 left-10 text-white z-10">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-60 font-sans mb-1">From</p>
            <h2 className="text-3xl font-bold font-display">{dedication.name}</h2>
        </div>
    </motion.div>
);

// ============================================
// VINYL/MUSIC CARD (Right - Light)
// ============================================
const VinylCard = ({
    dedication,
    songRef,
    isPlaying,
    isGreeting,
    onEnded
}) => (
    <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="relative flex-1 bg-[#FFFBF5] overflow-hidden flex flex-col items-center justify-center"
        style={{
            borderRadius: '80px',
            boxShadow: '0 20px 50px rgba(0,0,0,0.08)',
            minHeight: '400px'
        }}
    >
        {/* Vinyl Container */}
        <div className="relative w-80 h-80 flex items-center justify-center">
            {/* Vinyl Disc */}
            <div
                className={`absolute inset-0 rounded-full bg-[#111] shadow-2xl flex items-center justify-center border-4 border-black/10 ${isPlaying && !isGreeting ? 'animate-spin-slow' : ''}`}
                style={{
                    background: 'radial-gradient(circle at 50% 50%, #333 0%, #111 30%, #1a1a1a 60%, #0a0a0a 100%)'
                }}
            >
                {/* Vinyl grooves */}
                <div className="absolute inset-4 rounded-full border border-white/5" />
                <div className="absolute inset-8 rounded-full border border-white/5" />
                <div className="absolute inset-12 rounded-full border border-white/5" />
                <div className="absolute inset-16 rounded-full border border-white/5" />
                <div className="absolute inset-20 rounded-full border border-white/5" />

                {/* Center Label / Album Art */}
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-black/30 shadow-inner">
                    <img
                        src={dedication.song?.album_art || dedication.photo || 'assets/placeholder.png'}
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                    {/* Center hole */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-black/80" />
                    </div>
                </div>
            </div>

            {/* Tonearm */}
            <div
                className="absolute -top-2 -right-8 w-32 h-40 pointer-events-none transition-transform duration-700 origin-top-right"
                style={{
                    transform: isPlaying && !isGreeting ? 'rotate(28deg)' : 'rotate(0deg)'
                }}
            >
                {/* Arm base */}
                <div className="absolute top-0 right-0 w-6 h-6 rounded-full bg-gray-400 shadow-lg" />
                {/* Arm shaft */}
                <div className="absolute top-3 right-2 w-2 h-28 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full shadow-md origin-top" style={{ transform: 'rotate(-15deg)' }} />
                {/* Headshell */}
                <div className="absolute top-28 right-[-8px] w-3 h-8 bg-gray-600 rounded-sm shadow-md origin-top" style={{ transform: 'rotate(-15deg)' }} />
            </div>

            <audio ref={songRef} src={dedication.song?.local_file} onEnded={onEnded} />
        </div>

        {/* Now Playing Info - Bottom Center */}
        <div className="absolute bottom-8 left-0 right-0 text-center px-8">
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-[#D4907B] font-sans mb-2">Now Playing</p>
            <h2 className="text-2xl font-semibold font-display text-slate-800 mb-1">{dedication.song?.title}</h2>
            <p className="text-[#D4907B]/80 italic font-sans">{dedication.song?.artist}</p>
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
                className="text-[#D4907B] hover:text-[#9F3E50] transition-colors p-2"
            >
                <span className="material-symbols-outlined !text-3xl">skip_previous</span>
            </button>

            {/* Play/Pause FAB */}
            <button
                onClick={onTogglePlay}
                className="w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg hover:scale-105 transition-transform"
                style={{
                    background: 'linear-gradient(135deg, #E5B2A3 0%, #D4907B 100%)',
                    boxShadow: '0 8px 24px rgba(212, 144, 123, 0.4)'
                }}
            >
                <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </button>

            {/* Next */}
            <button
                onClick={onNext}
                className="text-[#D4907B] hover:text-[#9F3E50] transition-colors p-2"
            >
                <span className="material-symbols-outlined !text-3xl">skip_next</span>
            </button>

            {/* Divider */}
            <div className="w-px h-10 bg-slate-300/50 mx-4" />

            {/* Volume Control */}
            <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-[#D4907B] !text-2xl">
                    {volume === 0 ? 'volume_off' : volume < 0.5 ? 'volume_down' : 'volume_up'}
                </span>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                    className="w-28 h-1.5 rounded-full appearance-none cursor-pointer"
                    style={{
                        background: `linear-gradient(to right, #D4907B 0%, #D4907B ${volume * 100}%, rgba(212, 144, 123, 0.2) ${volume * 100}%, rgba(212, 144, 123, 0.2) 100%)`
                    }}
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
    eventTitle = "Birthday Dedications",
    onClose,
    onNext,
    onPrevious,
}) => {
    const [mode, setMode] = useState('greeting');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);
    const [volume, setVolume] = useState(1);

    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const songRef = useRef(null);

    // Determine initial mode
    useEffect(() => {
        const hasGreeting = dedication.video_message || dedication.voice_message;
        const newMode = hasGreeting ? 'greeting' : 'song';
        setMode(newMode);
        setIsPlaying(true);
        setProgress(0);
    }, [dedication]);

    // Lock body scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Handle media playback sync
    useEffect(() => {
        let activeRef = null;
        if (mode === 'greeting') {
            if (dedication.video_message) activeRef = videoRef.current;
            else if (dedication.voice_message) activeRef = audioRef.current;
        } else {
            if (dedication.song?.local_file) activeRef = songRef.current;
        }

        // Pause others
        [videoRef, audioRef, songRef].forEach(ref => {
            if (ref.current && ref.current !== activeRef) {
                ref.current.pause();
            }
        });

        if (isPlaying && activeRef) {
            activeRef.volume = volume;
            activeRef.play().catch(e => console.error("Play error:", e));
        } else if (!isPlaying && activeRef) {
            activeRef.pause();
        }
    }, [mode, isPlaying, dedication, volume]);

    // Progress loop
    useEffect(() => {
        const interval = setInterval(() => {
            let activeRef = null;
            if (mode === 'greeting') {
                if (dedication.video_message) activeRef = videoRef.current;
                else if (dedication.voice_message) activeRef = audioRef.current;
            } else {
                if (dedication.song?.local_file) activeRef = songRef.current;
            }

            if (activeRef) {
                setProgress(activeRef.currentTime || 0);
                setDuration(activeRef.duration || 0);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [mode, dedication]);

    // Volume sync
    useEffect(() => {
        [videoRef, audioRef, songRef].forEach(ref => {
            if (ref.current) ref.current.volume = volume;
        });
    }, [volume]);

    const handleGreetingEnded = () => {
        if (dedication.song?.local_file) {
            setMode('song');
            setIsPlaying(true);
        } else {
            onNext();
        }
    };

    const handleSongEnded = () => {
        onNext();
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const isGreeting = mode === 'greeting';

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
                progress={progress}
                duration={duration}
                onClose={onClose}
            />

            {/* Hero Section - Split Cards */}
            <div className="flex-1 flex items-center justify-center px-8 py-4">
                <div className="w-full max-w-6xl flex gap-10 h-full max-h-[600px]">
                    <GreetingCard
                        dedication={dedication}
                        videoRef={videoRef}
                        audioRef={audioRef}
                        isPlaying={isPlaying}
                        isGreeting={isGreeting}
                        onEnded={handleGreetingEnded}
                        onTogglePlay={togglePlay}
                    />
                    <VinylCard
                        dedication={dedication}
                        songRef={songRef}
                        isPlaying={isPlaying}
                        isGreeting={isGreeting}
                        onEnded={handleSongEnded}
                    />
                </div>
            </div>

            {/* Footer Controls */}
            <DesktopFooterControls
                onPrevious={onPrevious}
                onNext={onNext}
                onTogglePlay={togglePlay}
                isPlaying={isPlaying}
                volume={volume}
                onVolumeChange={setVolume}
            />
        </div>
    );
};

export default DesktopImmersivePlayer;
