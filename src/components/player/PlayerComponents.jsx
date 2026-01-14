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
                            transition: 'opacity 0.3s ease',
                            willChange: isPlaying ? 'height' : 'auto'
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
            className={`${sizeClasses[size]} rounded-full overflow-hidden border-white/20 shadow-2xl isolate`}
            style={{ WebkitMaskImage: '-webkit-radial-gradient(white, black)' }}
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
// VINYL RECORD (Song Phase) - Record Player with Antigravity Tonearm
// Uses Framer Motion for smooth spring physics animations
// ============================================
export const VinylRecord = ({ albumArt, isPlaying, songTitle, size = 'w-72 h-72', onClick }) => {
    // Parse size for responsive container
    const sizeClasses = size.includes('md:') ? size : `${size} md:w-96 md:h-96`;

    return (
        <div className={`relative flex flex-col items-center justify-center p-8 ${onClick ? 'cursor-pointer' : ''}`} onClick={onClick}>
            {/* Container for the Record and Tonearm */}
            <div className={`relative ${sizeClasses}`}>

                {/* The Vinyl Record */}
                <motion.div
                    animate={{ rotate: isPlaying ? 360 : 0 }}
                    transition={{
                        repeat: isPlaying ? Infinity : 0,
                        duration: 4,
                        ease: "linear"
                    }}
                    className="relative w-full h-full rounded-full bg-[#121212] shadow-2xl flex items-center justify-center overflow-hidden border-[12px] border-[#1a1a1a]"
                    style={{
                        backgroundImage: `repeating-radial-gradient(circle, #1a1a1a 0%, #121212 2%, #1a1a1a 4%)`,
                    }}
                >
                    {/* Record Grooves (Subtle Gloss) */}
                    <div className="absolute inset-0 w-full h-full opacity-20 bg-[conic-gradient(from_0deg,transparent_0%,white_25%,transparent_50%,white_75%,transparent_100%)]" />

                    {/* Central Label (Album Art) */}
                    <div className="relative w-1/3 h-1/3 rounded-full bg-white border-4 border-[#121212] overflow-hidden z-10 shadow-inner">
                        {albumArt ? (
                            <img src={albumArt} alt={songTitle || 'Album Art'} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-rose-gold-200 flex items-center justify-center">
                                <span className="text-[10px] text-rose-gold-700 font-serif">SONG</span>
                            </div>
                        )}
                        {/* Center Hole */}
                        <div className="absolute inset-0 m-auto w-3 h-3 bg-[#121212] rounded-full shadow-inner" />
                    </div>
                </motion.div>

                {/* The Tonearm with Spring Physics */}
                <motion.div
                    initial={{ rotate: -35 }}
                    animate={{ rotate: isPlaying ? 15 : -35 }}
                    transition={{ type: "spring", stiffness: 50, damping: 15 }}
                    className="absolute -top-2 -right-2 w-1/2 h-full pointer-events-none z-20 origin-top-right"
                >
                    {/* Base of Tonearm */}
                    <div className="absolute top-0 right-4 w-10 h-10 bg-rose-gold-500 rounded-full border-4 border-white shadow-lg" />

                    {/* Arm Shaft */}
                    <div className="absolute top-5 right-7 w-1 h-40 bg-gradient-to-b from-rose-gold-500 to-rose-gold-300 rounded-full origin-top transform rotate-[15deg] shadow-sm">
                        {/* Needle Head */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-6 bg-rose-gold-600 rounded-sm transform -rotate-[15deg]">
                            <div className="w-0.5 h-2 bg-gray-400 mx-auto mt-4" />
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Shadow under the record for the "Floating" effect */}
            <div className="w-64 h-4 bg-black/10 blur-xl rounded-[100%] mt-8 animate-pulse" />
        </div>
    );
};

// ============================================
// INTERACTIVE PROGRESS BAR
// Reusable component with tap-to-seek and drag-to-scrub functionality
// ============================================
export const InteractiveProgressBar = ({
    progress,
    duration,
    onSeek,
    height = 'h-1',
    showThumb = true,
    className = ''
}) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [hoverPosition, setHoverPosition] = React.useState(null);
    const barRef = React.useRef(null);

    const percentage = duration > 0 ? (progress / duration) * 100 : 0;

    const calculateTimeFromPosition = (clientX) => {
        if (!barRef.current) return 0;
        const rect = barRef.current.getBoundingClientRect();
        const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
        return position * duration;
    };

    const handleSeek = (clientX) => {
        const time = calculateTimeFromPosition(clientX);
        onSeek?.(time);
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        handleSeek(e.clientX);
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            handleSeek(e.clientX);
        }
        // Update hover position for preview
        if (barRef.current && !isDragging) {
            const rect = barRef.current.getBoundingClientRect();
            const position = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
            setHoverPosition(position);
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleMouseLeave = () => {
        setHoverPosition(null);
    };

    const handleClick = (e) => {
        if (!isDragging) {
            handleSeek(e.clientX);
        }
    };

    // Touch event handlers
    const handleTouchStart = (e) => {
        setIsDragging(true);
        const touch = e.touches[0];
        handleSeek(touch.clientX);
    };

    const handleTouchMove = (e) => {
        if (isDragging) {
            const touch = e.touches[0];
            handleSeek(touch.clientX);
        }
    };

    const handleTouchEnd = () => {
        setIsDragging(false);
    };

    // Global mouse up listener when dragging
    React.useEffect(() => {
        if (isDragging) {
            const handleGlobalMouseMove = (e) => handleSeek(e.clientX);
            const handleGlobalMouseUp = () => setIsDragging(false);

            window.addEventListener('mousemove', handleGlobalMouseMove);
            window.addEventListener('mouseup', handleGlobalMouseUp);

            return () => {
                window.removeEventListener('mousemove', handleGlobalMouseMove);
                window.removeEventListener('mouseup', handleGlobalMouseUp);
            };
        }
    }, [isDragging, duration]);

    return (
        <div
            ref={barRef}
            className={`relative w-full ${height} bg-rose-gold-100 rounded-full cursor-pointer ${className}`}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handleClick}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            role="slider"
            aria-valuemin={0}
            aria-valuemax={duration}
            aria-valuenow={progress}
            tabIndex={0}
        >
            {/* Filled portion */}
            <div
                className="absolute left-0 top-0 h-full bg-rose-gold-500 rounded-full transition-all duration-75"
                style={{ width: `${percentage}%` }}
            />

            {/* Hover preview indicator */}
            {hoverPosition !== null && !isDragging && (
                <div
                    className="absolute top-1/2 -translate-y-1/2 w-0.5 h-4 bg-rose-gold-300 opacity-50"
                    style={{ left: `${hoverPosition * 100}%` }}
                />
            )}

            {/* Draggable thumb */}
            {showThumb && (
                <div
                    className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-white border-2 border-rose-gold-500 shadow-md transition-transform ${isDragging ? 'scale-125' : 'scale-100'
                        }`}
                    style={{ left: `calc(${percentage}% - 8px)` }}
                />
            )}
        </div>
    );
};

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

    return (
        <div className="w-full px-6">
            <InteractiveProgressBar
                progress={progress}
                duration={duration}
                onSeek={onSeek}
                height="h-1"
                showThumb={true}
            />
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
