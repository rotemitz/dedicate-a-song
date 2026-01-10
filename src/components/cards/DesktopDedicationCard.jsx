import React from 'react';
import CardWaveform from './CardWaveform';
import { useDedicationDuration } from '../../hooks/useMediaDuration';

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
    const duration = useDedicationDuration(dedication);

    return (
        <div
            onClick={onPlay}
            className="bg-white p-6 rounded-xl cursor-pointer border border-rose-gold-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_25px_-5px_rgba(151,78,90,0.2)]"
        >
            <div className="flex flex-col items-center text-center gap-4">
                {/* Avatar with Badge */}
                <div className="relative">
                    <div className="w-24 h-24 rounded-full border-2 border-rose-gold-200/50 p-1">
                        <div className="w-full h-full rounded-full overflow-hidden bg-center bg-no-repeat bg-cover">
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
                    <div className="absolute -bottom-2 -right-2 bg-rose-gold-600 text-white w-8 h-8 rounded-full flex items-center justify-center border-4 border-white">
                        <span className="material-symbols-outlined text-sm">{mediaIcon}</span>
                    </div>
                </div>

                {/* Info */}
                <div>
                    <p className="text-celebration-charcoal text-xl font-bold">
                        {dedication.name}
                    </p>
                    <p className="text-rose-gold-600 text-sm font-medium">
                        {mediaType === 'video' ? 'Video Message' : 'Audio Dedication'}
                        {duration && ` • ${duration}`}
                    </p>
                </div>

                {/* Waveform Visual */}
                <div className="w-full h-12 my-2">
                    <CardWaveform isPlaying={isNowPlaying} />
                </div>

                {/* CTA Button */}
                <button className="w-full py-3 bg-rose-gold-100 text-rose-gold-600 rounded-full font-bold hover:bg-rose-gold-200 transition-colors">
                    {mediaType === 'video' ? 'Watch Video' : 'Listen Now'}
                </button>
            </div>
        </div>
    );
};

export default DesktopDedicationCard;
