import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardWaveform from './CardWaveform';
import { useDedicationDuration } from '../../hooks/useMediaDuration';

/**
 * Desktop Dedication Card Component
 * Grid-based card layout for desktop view
 *
 * Supports inline play mode with mini-player UI
 */
const DesktopDedicationCard = ({
    dedication,
    isNowPlaying,
    onPlay,
    // Inline play props
    isInlinePlaying = false,
    inlineProgress = 0,
    inlineDuration = 0,
    inlinePhase = 'greeting',
    onInlinePlay,
    onInlinePause,
    onOpenFullView
}) => {
    const hasMedia = dedication.voice_message || dedication.video_message;
    const mediaType = dedication.video_message ? 'video' : 'audio';
    const mediaIcon = dedication.video_message ? 'videocam' : 'mic';
    const duration = useDedicationDuration(dedication);
    const isPaused = !isNowPlaying && !isInlinePlaying;

    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleCardClick = (e) => {
        // Don't trigger if clicking on controls
        if (e.target.closest('.inline-controls')) return;

        // Use inline play if available, otherwise legacy immersive
        if (onInlinePlay) {
            onInlinePlay();
        } else if (onPlay) {
            onPlay();
        }
    };

    const handleKeyDown = (e) => {
        // Trigger play on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(e);
        }
    };

    return (
        <div
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${isInlinePlaying ? 'Pause' : 'Play'} dedication from ${dedication.name}${dedication.song ? ` - ${dedication.song.title}` : ''}`}
            aria-pressed={isInlinePlaying}
            className={`
                bg-white p-6 rounded-xl cursor-pointer transition-all duration-300
                ${(isNowPlaying || isInlinePlaying)
                    ? 'border-2 border-rose-gold-300 shadow-[0_20px_25px_-5px_rgba(151,78,90,0.2)]'
                    : 'border border-rose-gold-100 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(151,78,90,0.2)]'
                }
            `}
        >
            <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar with Badge */}
                <div className="relative">
                    <div className={`
                        w-24 h-24 rounded-full p-1
                        ${(isNowPlaying || isInlinePlaying)
                            ? 'border-2 border-rose-gold-300 bg-gradient-to-br from-rose-gold-300 to-rose-gold-500'
                            : 'border-2 border-rose-gold-200/50'
                        }
                    `}>
                        <div className="w-full h-full rounded-full overflow-hidden bg-center bg-no-repeat bg-cover border-2 border-white relative">
                            {dedication.photo ? (
                                <img
                                    src={dedication.photo}
                                    alt={dedication.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-rose-gold-300 to-rose-gold-500 flex items-center justify-center text-white text-2xl font-bold">
                                    {dedication.name.charAt(0)}
                                </div>
                            )}

                            {/* Play Overlay - only show when not playing */}
                            {!isInlinePlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-3xl">
                                        play_arrow
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* Media Type Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-rose-gold-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                        <span className="material-symbols-outlined text-sm">{mediaIcon}</span>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <p className="text-celebration-charcoal text-xl font-bold">
                        {dedication.name}
                    </p>
                    <p className={`text-rose-gold-600 text-sm font-medium transition-opacity duration-300 ${isPaused ? 'opacity-70' : 'opacity-100'}`}>
                        {mediaType === 'video' ? 'Video Message' : 'Audio Dedication'}
                        {duration && ` • ${duration}`}
                    </p>
                </div>

                {/* CTA Button - only when not inline playing */}
                {!isInlinePlaying && (
                    <button className="w-full py-3 bg-rose-gold-100 text-rose-gold-600 rounded-full font-bold hover:bg-rose-gold-200 transition-colors">
                        {mediaType === 'video' ? 'Watch Video' : 'Listen Now'}
                    </button>
                )}
            </div>

            {/* Expanded State - Inline Mini-Player */}
            <AnimatePresence>
                {isInlinePlaying && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden inline-controls"
                    >
                        <div className="mt-4 pt-4 border-t border-rose-gold-100">
                            {/* Info - changes based on phase */}
                            <div className="flex items-center gap-3 mb-4">
                                {inlinePhase === 'song' && dedication.song?.album_art && (
                                    <img
                                        src={dedication.song.album_art}
                                        alt={`${dedication.song.title} album art`}
                                        className="w-20 h-20 rounded-xl object-cover shadow-md"
                                    />
                                )}
                                <div className="flex-1 min-w-0 text-left">
                                    <p className="text-[10px] uppercase font-bold text-rose-gold-400 tracking-tight mb-1">
                                        {inlinePhase === 'greeting' ? 'Playing Dedication' : 'Now Playing'}
                                    </p>
                                    {inlinePhase === 'greeting' ? (
                                        <>
                                            <p className="text-base font-semibold text-celebration-charcoal truncate">
                                                Message from {dedication.name}
                                            </p>
                                            <p className="text-sm text-celebration-charcoal/60 truncate">
                                                {dedication.video_message ? 'Video Message' : 'Voice Message'}
                                            </p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-base font-semibold text-celebration-charcoal truncate">
                                                {dedication.song?.title}
                                            </p>
                                            <p className="text-sm text-celebration-charcoal/60 truncate">
                                                {dedication.song?.artist}
                                            </p>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Waveform Visualization */}
                            <div className="bg-rose-gold-50/50 rounded-2xl p-4 border border-rose-gold-100/50 mb-4">
                                <CardWaveform isPlaying={isInlinePlaying} />

                                {/* Progress Bar with Real Progress */}
                                <div className="mt-4 space-y-1.5">
                                    <div className="w-full h-2 bg-rose-gold-200/50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full transition-all duration-100"
                                            style={{ width: `${inlineDuration > 0 ? (inlineProgress / inlineDuration) * 100 : 0}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-xs font-bold text-rose-gold-400 tabular-nums">
                                        <span>{formatTime(inlineProgress)}</span>
                                        <span>{formatTime(inlineDuration)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Open Full View Button */}
                            {onOpenFullView && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onOpenFullView();
                                    }}
                                    className="w-full px-4 py-3 bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white rounded-full text-sm font-bold tracking-wide hover:shadow-md transition-all flex items-center justify-center gap-2"
                                    aria-label={`Open full player for ${dedication.name}'s dedication`}
                                >
                                    <span className="material-symbols-outlined text-base" aria-hidden="true">fullscreen</span>
                                    Open Full View
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DesktopDedicationCard;
