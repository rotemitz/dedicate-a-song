import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardWaveform from './CardWaveform';
import InlinePlayer from './InlinePlayer';
import { useDedicationDuration } from '../../hooks/useMediaDuration';
import { InteractiveProgressBar } from '../player/PlayerComponents';

/**
 * Mobile Dedication Card Component
 * 
 * Specifications:
 * - Dimensions: p-5 (20px internal padding)
 * - Background: #FFFFFF
 * - Corner Radius: rounded-[40px]
 * - Shadow: shadow-[0_10px_30px_rgba(212,144,123,0.1)]
 * - Border: border border-rose-gold-50
 * 
 * Playback States:
 * - Paused: Play icon overlay on avatar, song details at opacity-70
 * - Playing: border-2 border-rose-gold-300, animated waveform, expanded view
 */
const MobileDedicationCard = ({
    dedication,
    isNowPlaying, // legacy - when playing in immersive player
    onPlay, // legacy - opens immersive player
    layoutId,
    // Inline play props
    isInlinePlaying = false,
    inlineProgress = 0,
    inlineDuration = 0,
    inlinePhase = 'greeting',
    onInlinePlay,
    onInlinePause,
    onInlineSeek,
    onOpenFullView
}) => {
    const hasMedia = dedication.voice_message || dedication.video_message;
    const isPaused = !isNowPlaying && !isInlinePlaying;
    const duration = useDedicationDuration(dedication);

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
        <motion.div
            layoutId={layoutId}
            layout
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-label={`${isInlinePlaying ? 'Pause' : 'Play'} dedication from ${dedication.name}${dedication.song ? ` - ${dedication.song.title}` : ''}`}
            aria-pressed={isInlinePlaying}
            style={{ willChange: 'transform' }}
            transition={{ layout: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
            className={`
                bg-white rounded-celebration cursor-pointer transition-all duration-300
                ${(isNowPlaying || isInlinePlaying)
                    ? 'border-2 border-rose-gold-300 shadow-floating'
                    : 'border border-rose-gold-50 shadow-[0_10px_30px_rgba(212,144,123,0.1)] hover:shadow-floating hover:-translate-y-1'
                }
            `}
        >
            <div className="flex items-center gap-4 p-5">
                {/* Avatar with Play Overlay - 64px diameter */}
                <div className="relative flex-shrink-0">
                    <div className={`
                        w-16 h-16 rounded-full p-0.5
                        ${(isNowPlaying || isInlinePlaying)
                            ? 'bg-gradient-to-br from-rose-gold-300 to-rose-gold-500'
                            : 'bg-rose-gold-100/50'
                        }
                    `}>
                        <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                            {dedication.photo ? (
                                <img
                                    src={dedication.photo}
                                    alt={dedication.name}
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-rose-gold-300 to-rose-gold-500 flex items-center justify-center text-white text-xl font-bold">
                                    {dedication.name.charAt(0)}
                                </div>
                            )}

                            {/* Play/Pause Overlay */}
                            {!isInlinePlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-2xl">
                                        play_arrow
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    {/* Name and Duration Row */}
                    <div className="flex items-baseline justify-between gap-2">
                        <h3 className="font-serif text-lg font-semibold text-celebration-charcoal truncate">
                            {dedication.name}
                        </h3>
                        {duration && (
                            <span className="text-[10px] font-medium text-rose-gold-400 tabular-nums flex-shrink-0">
                                {duration}
                            </span>
                        )}
                    </div>

                    {/* Song Info - slightly desaturated when paused */}
                    {dedication.song && (
                        <div className={`mt-2 flex items-center gap-2 transition-opacity duration-300 ${isPaused ? 'opacity-70' : 'opacity-100'}`}>
                            <span className="material-symbols-outlined text-rose-gold-500 text-sm flex-shrink-0">
                                music_note
                            </span>
                            <p className="text-[11px] font-medium text-celebration-charcoal/60 truncate italic">
                                "{dedication.song.title}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded State - Inline Mini-Player */}
            <AnimatePresence>
                {isInlinePlaying && (
                    <InlinePlayer
                        dedication={dedication}
                        isInlinePlaying={isInlinePlaying}
                        inlineProgress={inlineProgress}
                        inlineDuration={inlineDuration}
                        inlinePhase={inlinePhase}
                        onInlineSeek={onInlineSeek}
                        onOpenFullView={onOpenFullView}
                        variant="mobile"
                    />
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MobileDedicationCard;
