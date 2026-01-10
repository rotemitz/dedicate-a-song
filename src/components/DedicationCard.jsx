import React, { useRef, useEffect, useState } from 'react';

// Waveform visualization for active cards
const CardWaveform = ({ isPlaying }) => {
    const bars = [4, 8, 6, 10, 7, 9, 5, 8, 12, 7, 10, 6, 9, 11, 5, 8, 10, 7, 4];

    return (
        <div className="flex items-end justify-center gap-[3px] h-12 px-2">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className={`
                        w-[3px] rounded-full transition-all duration-300
                        bg-gradient-to-t from-rose-gold-600 to-rose-gold-400
                        ${isPlaying ? 'animate-pulse' : ''}
                    `}
                    style={{
                        height: `${height * 4}px`,
                        animationDelay: `${i * 50}ms`,
                    }}
                />
            ))}
        </div>
    );
};

// Mobile compact card layout
const MobileCard = ({ dedication, isNowPlaying, onPlay }) => {
    const hasMedia = dedication.voice_message || dedication.video_message;
    const mediaIcon = dedication.video_message ? 'videocam' : 'mic';

    return (
        <div
            onClick={onPlay}
            className={`
                bg-white rounded-[2rem] p-4 cursor-pointer
                border transition-all duration-300
                ${isNowPlaying
                    ? 'border-rose-gold-400 shadow-floating ring-2 ring-rose-gold-200'
                    : 'border-rose-gold-100/50 shadow-premium hover:shadow-floating hover:-translate-y-1'
                }
            `}
        >
            <div className="flex items-center gap-4">
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                    <div className={`
                        w-16 h-16 rounded-full p-0.5
                        ${isNowPlaying
                            ? 'bg-gradient-to-br from-rose-gold-300 to-rose-gold-500'
                            : 'bg-rose-gold-200/50'
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
                            {isNowPlaying && (
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-white text-2xl">
                                        pause
                                    </span>
                                </div>
                            )}
                            {!isNowPlaying && (
                                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
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
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="font-serif text-lg font-bold text-celebration-charcoal">
                                {dedication.name}
                            </h3>
                            {dedication.relationship && (
                                <p className="text-[10px] uppercase tracking-wider text-rose-gold-500 font-bold">
                                    {dedication.relationship}
                                </p>
                            )}
                        </div>
                        <span className="text-[10px] font-medium text-celebration-charcoal/40">
                            {dedication.duration || '0:45'}
                        </span>
                    </div>

                    {/* Song Info */}
                    {dedication.song && (
                        <div className="mt-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-rose-gold-500 text-sm">
                                music_note
                            </span>
                            <p className="text-[11px] font-medium text-celebration-charcoal/60 truncate italic">
                                "{dedication.song.title}"
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Expanded State - Waveform (only for active card) */}
            {isNowPlaying && (
                <div className="mt-4 pt-4 border-t border-rose-gold-100">
                    <div className="bg-rose-gold-50/50 rounded-2xl p-4 border border-rose-gold-100/50">
                        <CardWaveform isPlaying={true} />
                        <div className="mt-3 space-y-1">
                            <div className="w-full h-1 bg-rose-gold-200/50 rounded-full overflow-hidden">
                                <div className="w-[65%] h-full bg-gradient-to-r from-rose-gold-300 to-rose-gold-500" />
                            </div>
                            <div className="flex justify-between text-[10px] font-bold text-rose-gold-400">
                                <span>0:28</span>
                                <span>0:45</span>
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
                            <button className="text-rose-gold-500">
                                <span className="material-symbols-outlined text-xl">play_circle</span>
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

// Desktop grid card layout
const DesktopCard = ({ dedication, isNowPlaying, onPlay }) => {
    const hasMedia = dedication.voice_message || dedication.video_message;
    const mediaType = dedication.video_message ? 'video' : 'audio';
    const mediaIcon = dedication.video_message ? 'videocam' : 'mic';

    return (
        <div
            onClick={onPlay}
            className={`
                bg-white p-6 rounded-xl cursor-pointer
                border transition-all duration-300
                hover:-translate-y-2 hover:shadow-floating
                ${isNowPlaying
                    ? 'border-rose-gold-400 shadow-floating'
                    : 'border-rose-gold-100/50 shadow-premium'
                }
            `}
        >
            <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar with Badge */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-rose-gold-200 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden">
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
                        </div>
                    </div>
                    {/* Media Type Badge */}
                    <div className="absolute -bottom-2 -right-2 bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white shadow-md">
                        <span className="material-symbols-outlined text-sm">{mediaIcon}</span>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <p className="text-celebration-charcoal text-xl font-bold">
                        {dedication.name}
                    </p>
                    <p className="text-rose-gold-500 text-sm font-medium">
                        {mediaType === 'video' ? 'Video Message' : 'Audio Dedication'}
                        {dedication.duration && ` • ${dedication.duration}`}
                    </p>
                </div>

                {/* Waveform Visual */}
                <div className={`w-full ${isNowPlaying ? 'opacity-100' : 'opacity-40'}`}>
                    <CardWaveform isPlaying={isNowPlaying} />
                </div>

                {/* CTA Button */}
                <button
                    className={`
                        w-full py-3 rounded-full font-bold transition-colors
                        ${isNowPlaying
                            ? 'bg-gradient-to-r from-rose-gold-400 to-rose-gold-600 text-white'
                            : 'bg-rose-gold-100 text-rose-gold-600 hover:bg-rose-gold-200'
                        }
                    `}
                >
                    {mediaType === 'video' ? 'Watch Video' : 'Listen Now'}
                </button>
            </div>
        </div>
    );
};

const DedicationCard = ({
    dedication,
    index,
    isNowPlaying,
    activeMediaType,
    onPlay,
    onMediaEnded
}) => {
    const greetingRef = useRef(null);
    const audioRef = useRef(null);

    useEffect(() => {
        if (!isNowPlaying) {
            if (greetingRef.current) {
                greetingRef.current.pause();
                greetingRef.current.currentTime = 0;
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            return;
        }

        if (activeMediaType === 'greeting') {
            if (greetingRef.current) greetingRef.current.play().catch(e => console.log('Autoplay prevented:', e));
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        } else if (activeMediaType === 'song') {
            if (audioRef.current) audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
            if (greetingRef.current) {
                greetingRef.current.pause();
                greetingRef.current.currentTime = 0;
            }
        }
    }, [isNowPlaying, activeMediaType]);

    const handleCardClick = (e) => {
        if (['AUDIO', 'VIDEO', 'A', 'BUTTON', 'INPUT'].includes(e.target.tagName)) return;
        onPlay(index);
    };

    return (
        <>
            {/* Mobile Layout */}
            <div className="md:hidden">
                <MobileCard
                    dedication={dedication}
                    isNowPlaying={isNowPlaying}
                    onPlay={() => onPlay(index)}
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                <DesktopCard
                    dedication={dedication}
                    isNowPlaying={isNowPlaying}
                    onPlay={() => onPlay(index)}
                />
            </div>

            {/* Hidden Audio/Video elements for playback control */}
            {dedication.video_message && (
                <video
                    ref={greetingRef}
                    src={dedication.video_message}
                    className="hidden"
                    playsInline
                    onEnded={() => onMediaEnded('greeting')}
                />
            )}
            {dedication.voice_message && !dedication.video_message && (
                <audio
                    ref={greetingRef}
                    src={dedication.voice_message}
                    onEnded={() => onMediaEnded('greeting')}
                />
            )}
            {dedication.song?.local_file && (
                <audio
                    ref={audioRef}
                    src={dedication.song.local_file}
                    onEnded={() => onMediaEnded('song')}
                />
            )}
        </>
    );
};

export default DedicationCard;
