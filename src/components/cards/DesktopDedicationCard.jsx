import React from 'react';
import CardWaveform from './CardWaveform';

/**
 * Desktop Dedication Card Component
 * Grid-based card layout for desktop view
 */
const DesktopDedicationCard = ({
    dedication,
    isNowPlaying,
    onPlay
}) => {
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

export default DesktopDedicationCard;
