import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    SegmentProgressBar,
    WaveformVisualizer,
    VinylRecord,
    TimelineSlider,
    PrimaryActionButton
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
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
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
    onSeek
}) => (
    <motion.div
        key="voice-phase"
        variants={contentTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center"
    >
        {/* Header */}
        <div className="text-center mt-10">
            <p className="text-sm uppercase tracking-widest text-rose-gold-500 font-medium mb-2">
                Voice Dedication
            </p>
            <h1 className="text-2xl font-serif text-celebration-charcoal">
                A message from <span className="italic">{dedication.name}</span>
            </h1>
        </div>

        {/* Hero Profile */}
        <div className="my-12 flex flex-col items-center">
            <motion.div
                className={`w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-floating ${isPlaying ? 'animate-soft-pulse' : ''}`}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
            >
                {dedication.video_message ? (
                    <video
                        src={dedication.video_message}
                        className="w-full h-full object-cover"
                        playsInline
                    />
                ) : (
                    <img
                        src={dedication.photo || 'assets/placeholder.png'}
                        alt={dedication.name}
                        className={`w-full h-full object-cover ${!isPlaying ? 'blur-sm grayscale' : ''} transition-all duration-500`}
                    />
                )}
            </motion.div>

            {/* Waveform */}
            <div className="mt-8">
                <WaveformVisualizer isPlaying={isPlaying} barCount={16} />
            </div>
        </div>

        {/* Play/Pause Button */}
        <PrimaryActionButton onClick={onTogglePlay}>
            <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
            </span>
        </PrimaryActionButton>

        {/* Skip to Song Button */}
        {dedication.song?.local_file && (
            <motion.div
                className="mt-6"
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
        <div className="w-full mt-auto mb-6">
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
        transition={{ duration: 0.4 }}
        className="flex-1 flex flex-col items-center"
    >
        {/* Header */}
        <div className="text-center mt-8">
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
                isPlaying={isPlaying}
                size="w-72 h-72"
            />
        </div>

        {/* Song Info */}
        <div className="text-center mb-6">
            <h2 className="text-3xl font-serif text-celebration-charcoal mb-1">
                {dedication.song?.title}
            </h2>
            <p className="text-lg text-rose-gold-600 font-sans">
                {dedication.song?.artist}
            </p>
        </div>

        {/* Play/Pause Button */}
        <PrimaryActionButton onClick={onTogglePlay}>
            <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                {isPlaying ? 'pause' : 'play_arrow'}
            </span>
        </PrimaryActionButton>

        {/* Timeline */}
        <div className="w-full mt-auto mb-6">
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
    const [mode, setMode] = useState('greeting');
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

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

    // Get active media ref
    const getActiveRef = () => {
        if (mode === 'greeting') {
            if (dedication.video_message) return videoRef.current;
            if (dedication.voice_message) return audioRef.current;
        }
        return songRef.current;
    };

    // Handle media playback sync
    useEffect(() => {
        const activeRef = getActiveRef();

        // Pause others
        [videoRef, audioRef, songRef].forEach(ref => {
            if (ref.current && ref.current !== activeRef) {
                ref.current.pause();
            }
        });

        if (isPlaying && activeRef) {
            activeRef.play().catch(e => console.error("Play error:", e));
        } else if (!isPlaying && activeRef) {
            activeRef.pause();
        }
    }, [mode, isPlaying, dedication]);

    // Progress loop
    useEffect(() => {
        const interval = setInterval(() => {
            const activeRef = getActiveRef();
            if (activeRef) {
                setProgress(activeRef.currentTime || 0);
                setDuration(activeRef.duration || 0);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [mode, dedication]);

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

    const handleSeek = (time) => {
        const activeRef = getActiveRef();
        if (activeRef) {
            activeRef.currentTime = time;
        }
    };

    const togglePlay = () => setIsPlaying(!isPlaying);
    const isGreeting = mode === 'greeting';

    return (
        <motion.div
            variants={pageTransition}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-[2000] min-h-screen w-full flex flex-col items-center bg-celebration-cream"
        >
            {/* Segment Progress Bar */}
            <SegmentProgressBar
                current={currentIndex}
                total={totalCount}
                progress={progress}
                duration={duration}
            />

            {/* Close Button */}
            <button
                className="absolute top-4 right-4 z-50 p-2 rounded-full bg-white/50 hover:bg-white/80 transition-colors shadow-premium"
                onClick={onClose}
            >
                <span className="material-symbols-outlined text-celebration-charcoal">close</span>
            </button>

            {/* Hidden Audio/Video Elements */}
            {dedication.video_message && (
                <video
                    ref={videoRef}
                    src={dedication.video_message}
                    className="hidden"
                    playsInline
                    onEnded={handleGreetingEnded}
                />
            )}
            {dedication.voice_message && (
                <audio
                    ref={audioRef}
                    src={dedication.voice_message}
                    onEnded={handleGreetingEnded}
                />
            )}
            {dedication.song?.local_file && (
                <audio
                    ref={songRef}
                    src={dedication.song.local_file}
                    onEnded={handleSongEnded}
                />
            )}

            {/* Phase Content */}
            <AnimatePresence mode="wait">
                {isGreeting ? (
                    <VoicePhaseView
                        key="voice"
                        dedication={dedication}
                        isPlaying={isPlaying}
                        progress={progress}
                        duration={duration}
                        onTogglePlay={togglePlay}
                        onSkipToSong={handleGreetingEnded}
                        onSeek={handleSeek}
                    />
                ) : (
                    <SongPhaseView
                        key="song"
                        dedication={dedication}
                        isPlaying={isPlaying}
                        progress={progress}
                        duration={duration}
                        onTogglePlay={togglePlay}
                        onSeek={handleSeek}
                    />
                )}
            </AnimatePresence>

            {/* Footer Navigation */}
            <FooterNavigation
                onPrevious={onPrevious}
                onNext={() => {
                    if (isGreeting) handleGreetingEnded();
                    else onNext();
                }}
                isGreeting={isGreeting}
            />
        </motion.div>
    );
};

export default MobileImmersivePlayer;
