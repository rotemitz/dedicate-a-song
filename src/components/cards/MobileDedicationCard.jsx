import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CardWaveform from './CardWaveform';
import { useDedicationDuration } from '../../hooks/useMediaDuration';

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
    isNowPlaying,
    onPlay,
    layoutId
}) => {
    const hasMedia = dedication.voice_message || dedication.video_message;
    const isPaused = !isNowPlaying;
    const duration = useDedicationDuration(dedication);

    return (
        <motion.div
            layoutId={layoutId}
            onClick={onPlay}
            className={`
                bg-white rounded-[40px] p-5 cursor-pointer
                transition-all duration-300
                ${isNowPlaying
                    ? 'border-2 border-rose-gold-300 shadow-floating'
                    : 'border border-rose-gold-50 shadow-[0_10px_30px_rgba(212,144,123,0.1)] hover:shadow-floating hover:-translate-y-1'
                }
            `}
        >
            <div className="flex items-center gap-4">
                {/* Avatar with Play Overlay - 64px diameter */}
                <div className="relative flex-shrink-0">
                    <div className={`
                        w-16 h-16 rounded-full p-0.5
                        ${isNowPlaying
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
                            <AnimatePresence>
                                {isNowPlaying ? (
                                    <motion.div
                                        key="pause"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/30 flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-white text-2xl">
                                            pause
                                        </span>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="play"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 bg-black/20 flex items-center justify-center"
                                    >
                                        <span className="material-symbols-outlined text-white text-2xl">
                                            play_arrow
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
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
                    {/* Secondary Label - text-[10px], uppercase, tracking-widest, text-rose-gold-400 */}
                    {dedication.relationship && (
                        <p className="text-[10px] uppercase tracking-widest text-rose-gold-400 font-medium">
                            Dedicating...
                        </p>
                    )}

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

            {/* Expanded State - Now Playing Mini-Player */}
            <AnimatePresence>
                {isNowPlaying && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="mt-4 pt-4 border-t border-rose-gold-100">
                            {/* Waveform Visualization */}
                            <div className="bg-rose-gold-50/50 rounded-2xl p-4 border border-rose-gold-100/50">
                                <CardWaveform isPlaying={true} />

                                {/* Progress Scrubber */}
                                <div className="mt-3 space-y-1">
                                    <div className="w-full h-1.5 bg-rose-gold-200/50 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 rounded-full"
                                            initial={{ width: '0%' }}
                                            animate={{ width: '65%' }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                    <div className="flex justify-between text-[10px] font-bold text-rose-gold-400">
                                        <span>0:28</span>
                                        <span>{duration || '--:--'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Song Dedication Preview */}
                            {dedication.song && (
                                <div className="mt-3 flex items-center gap-3 p-3 bg-celebration-cream/80 rounded-xl border border-rose-gold-100/30">
                                    {dedication.song.album_art && (
                                        <img
                                            src={dedication.song.album_art}
                                            alt="Album Art"
                                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[9px] uppercase font-bold text-rose-gold-400 tracking-tight">
                                            Song Dedication
                                        </p>
                                        <p className="text-xs font-semibold text-celebration-charcoal truncate">
                                            {dedication.song.title} - {dedication.song.artist}
                                        </p>
                                    </div>
                                    <button className="text-rose-gold-500 hover:text-rose-gold-600 transition-colors">
                                        <span className="material-symbols-outlined text-xl">play_circle</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default MobileDedicationCard;
