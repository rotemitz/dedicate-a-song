import React from 'react';
import { motion } from 'framer-motion';

// ============================================
// SEGMENT PROGRESS BAR
// ============================================
export const SegmentProgressBar = ({ current, total, progress, duration }) => {
    const segmentProgress = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div className="flex w-full px-6 gap-2 mt-4">
            {Array.from({ length: total }).map((_, i) => (
                <div
                    key={i}
                    className="h-1 flex-1 rounded-full bg-rose-gold-100"
                >
                    {i < current ? (
                        <div className="h-full w-full rounded-full bg-rose-gold-500" />
                    ) : i === current ? (
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
// WAVEFORM VISUALIZER (Voice Phase)
// Uses CSS animations for dynamic height animation
// ============================================
export const WaveformVisualizer = ({ isPlaying, barCount = 16 }) => {
    // Generate unique random animation parameters for each bar
    const barParams = React.useMemo(
        () => [...Array(barCount)].map(() => ({
            minHeight: Math.random() * 8 + 8,    // 8-16px min
            maxHeight: Math.random() * 16 + 24,  // 24-40px max
            duration: 0.3 + Math.random() * 0.4, // 0.3-0.7s duration
        })),
        [barCount]
    );

    return (
        <>
            {/* Inject keyframes dynamically */}
            <style>
                {barParams.map((params, i) => `
                    @keyframes waveform-bar-${i} {
                        0%, 100% { height: ${params.minHeight}px; }
                        50% { height: ${params.maxHeight}px; }
                    }
                `).join('\n')}
            </style>
            <div className="flex items-center justify-center gap-1 h-12">
                {barParams.map((params, i) => (
                    <div
                        key={i}
                        className="w-1 rounded-full bg-gradient-to-t from-rose-gold-500 to-rose-gold-300"
                        style={{
                            height: isPlaying ? undefined : `${(params.minHeight + params.maxHeight) / 2}px`,
                            opacity: isPlaying ? 1 : 0.3,
                            animation: isPlaying
                                ? `waveform-bar-${i} ${params.duration}s ease-in-out infinite`
                                : 'none',
                            animationDelay: `${i * 0.05}s`,
                            transition: 'opacity 0.3s ease'
                        }}
                    />
                ))}
            </div>
        </>
    );
};

// ============================================
// DEDICATION AVATAR
// Reusable avatar component for player views
// ============================================
export const DedicationAvatar = ({
    src,
    alt,
    isPlaying = false,
    size = 'large'
}) => {
    // Size configurations
    const sizeClasses = {
        large: 'w-48 h-48 md:w-64 md:h-64 border-4',
        small: 'w-16 h-16 border-2'
    };

    return (
        <div
            className={`${sizeClasses[size]} rounded-full overflow-hidden border-white/20 shadow-2xl`}
        >
            <img
                src={src || 'assets/placeholder.png'}
                alt={alt}
                className={`w-full h-full object-cover transition-all duration-500 ${!isPlaying ? 'blur-sm' : ''}`}
            />
        </div>
    );
};

// ============================================
// VINYL RECORD (Song Phase)
// ============================================
export const VinylRecord = ({ albumArt, isPlaying, size = 'w-72 h-72' }) => (
    <div className={`relative ${size} flex items-center justify-center`}>
        {/* Record Disc */}
        <div
            className={`absolute inset-0 rounded-full bg-black shadow-2xl flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}
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
            <div className="relative w-20 h-20 rounded-sm overflow-hidden shadow-inner">
                <img
                    src={albumArt || 'assets/placeholder.png'}
                    alt="Album Art"
                    className="w-full h-full object-cover"
                />
                {/* Center hole */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-black/80" />
                </div>
            </div>
        </div>

        {/* Tonearm */}
        <div
            className="absolute -top-2 -right-8 w-32 h-40 pointer-events-none transition-transform duration-700 origin-top-right"
            style={{
                transform: isPlaying ? 'rotate(28deg)' : 'rotate(0deg)'
            }}
        >
            <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-gray-400 shadow-lg" />
            <div className="absolute top-2.5 right-1.5 w-1.5 h-24 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full shadow-md origin-top" style={{ transform: 'rotate(-15deg)' }} />
            <div className="absolute top-24 right-[-6px] w-2 h-6 bg-gray-600 rounded-sm shadow-md origin-top" style={{ transform: 'rotate(-15deg)' }} />
        </div>
    </div>
);

// ============================================
// TIMELINE SLIDER
// ============================================
export const TimelineSlider = ({ progress, duration, onSeek }) => {
    const formatTime = (time) => {
        if (!time || isNaN(time)) return "0:00";
        const min = Math.floor(time / 60);
        const sec = Math.floor(time % 60);
        return `${min}:${sec < 10 ? '0' + sec : sec}`;
    };

    const percentage = duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div className="w-full px-6">
            <div
                className="relative w-full h-1 bg-rose-gold-100 rounded-full cursor-pointer"
                onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = (e.clientX - rect.left) / rect.width;
                    onSeek(p * duration);
                }}
            >
                <div
                    className="absolute left-0 top-0 h-full bg-rose-gold-500 rounded-full"
                    style={{ width: `${percentage}%` }}
                />
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-rose-gold-500 shadow-md"
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            </div>
            <div className="flex justify-between mt-2">
                <span className="text-[10px] text-rose-gold-400">{formatTime(progress)}</span>
                <span className="text-[10px] text-rose-gold-400">{formatTime(duration)}</span>
            </div>
        </div>
    );
};

// ============================================
// PRIMARY ACTION BUTTON
// ============================================
export const PrimaryActionButton = ({ children, onClick, variant = 'play' }) => {
    if (variant === 'skip') {
        return (
            <button
                onClick={onClick}
                className="w-64 h-14 rounded-full bg-rose-gradient text-white font-medium flex items-center justify-center gap-2 shadow-floating hover:scale-105 transition-transform"
            >
                {children}
            </button>
        );
    }

    return (
        <button
            onClick={onClick}
            className="w-20 h-20 rounded-full bg-celebration-charcoal text-white shadow-lg flex items-center justify-center hover:scale-105 transition-transform"
        >
            {children}
        </button>
    );
};
