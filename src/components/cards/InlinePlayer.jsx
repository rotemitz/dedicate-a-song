import React from 'react';
import { motion } from 'framer-motion';
import CardWaveform from './CardWaveform';
import { InteractiveProgressBar } from '../player/PlayerComponents';

/**
 * Shared Inline Player Component
 * Used by both MobileDedicationCard and DesktopDedicationCard
 */
const InlinePlayer = ({
    dedication,
    isInlinePlaying,
    inlineProgress,
    inlineDuration,
    inlinePhase,
    onInlineSeek,
    onOpenFullView,
    variant = 'mobile' // 'mobile' or 'desktop'
}) => {
    // Format time helper
    const formatTime = (seconds) => {
        if (!seconds || isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const isDesktop = variant === 'desktop';
    const paddingClass = isDesktop ? 'px-6 pb-6' : 'px-5 pb-5';

    return (
        <motion.div
            initial={{ opacity: 0, scaleY: 0.8 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0.9 }}
            transition={{
                duration: 0.2,
                ease: [0.4, 0, 0.2, 1],
                opacity: { duration: 0.15 }
            }}
            style={{ originY: 0, willChange: 'transform, opacity' }}
            className={`overflow-hidden inline-controls ${paddingClass}`}
        >
            <div className="mt-4 pt-4 border-t border-rose-gold-100 flex flex-col gap-4">
                {/* Info Section */}
                <div className={`flex items-center gap-3 ${isDesktop ? 'text-left' : ''}`}>
                    {inlinePhase === 'song' && dedication.song?.album_art && (
                        <img
                            src={dedication.song.album_art}
                            alt={`${dedication.song.title} album art`}
                            className={`${isDesktop ? 'w-20 h-20' : 'w-16 h-16'} rounded-xl object-cover shadow-md`}
                        />
                    )}
                    <div className="flex-1 min-w-0">
                        <p className="text-[10px] uppercase font-bold text-rose-gold-400 tracking-tight mb-1">
                            {inlinePhase === 'greeting' ? 'Playing Dedication' : 'Now Playing'}
                        </p>
                        {inlinePhase === 'greeting' ? (
                            <>
                                <p className={`${isDesktop ? 'text-base' : 'text-sm'} font-semibold text-celebration-charcoal truncate`}>
                                    Message from {dedication.name}
                                </p>
                                <p className={`${isDesktop ? 'text-sm' : 'text-xs'} text-celebration-charcoal/60 truncate`}>
                                    {dedication.video_message ? 'Video Message' : 'Voice Message'}
                                </p>
                            </>
                        ) : (
                            <>
                                <p className={`${isDesktop ? 'text-base' : 'text-sm'} font-semibold text-celebration-charcoal truncate`}>
                                    {dedication.song?.title}
                                </p>
                                <p className={`${isDesktop ? 'text-sm' : 'text-xs'} text-celebration-charcoal/60 truncate`}>
                                    {dedication.song?.artist}
                                </p>
                            </>
                        )}
                    </div>
                </div>

                {/* Waveform visualization box */}
                <div className={`${isDesktop ? 'p-4' : 'p-3'} bg-rose-gold-50/50 rounded-2xl border border-rose-gold-100/50`}>
                    <CardWaveform isPlaying={isInlinePlaying} />

                    {/* Interactive Progress Bar */}
                    <div className={`${isDesktop ? 'mt-4' : 'mt-3'} space-y-1.5`}>
                        <InteractiveProgressBar
                            progress={inlineProgress}
                            duration={inlineDuration}
                            onSeek={onInlineSeek}
                            height={isDesktop ? 'h-2' : 'h-1.5'}
                            showThumb={false}
                        />
                        <div className={`flex justify-between ${isDesktop ? 'text-xs' : 'text-[10px]'} font-bold text-rose-gold-400 tabular-nums`}>
                            <span>{formatTime(inlineProgress)}</span>
                            <span>{formatTime(inlineDuration)}</span>
                        </div>
                    </div>
                </div>

                {/* Full View Action */}
                {onOpenFullView && (
                    <div className={isDesktop ? '' : 'flex justify-center'}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onOpenFullView();
                            }}
                            className={`
                                ${isDesktop ? 'w-full py-3 text-sm' : 'px-4 py-2 text-[10px]'} 
                                bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white rounded-full font-bold tracking-wide hover:shadow-md transition-all flex items-center justify-center gap-2
                            `}
                            aria-label={`Open full player for ${dedication.name}'s dedication`}
                        >
                            <span className="material-symbols-outlined text-base" aria-hidden="true">fullscreen</span>
                            Open Full View
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default InlinePlayer;
