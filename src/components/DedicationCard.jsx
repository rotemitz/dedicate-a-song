import React, { useRef, useEffect } from 'react';
import MobileDedicationCard from './cards/MobileDedicationCard';
import DesktopDedicationCard from './cards/DesktopDedicationCard';

/**
 * DedicationCard - Main wrapper component
 * 
 * Renders mobile or desktop card based on viewport,
 * handles audio/video playback logic
 */
const DedicationCard = ({
    dedication,
    index,
    isNowPlaying,
    activeMediaType,
    onPlay,
    onMediaEnded,
    // Inline play props
    isInlinePlaying,
    inlineProgress,
    inlineDuration,
    inlinePhase,
    onInlinePlay,
    onInlinePause,
    onOpenFullView
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

    const handlePlay = () => {
        onPlay(index);
    };

    return (
        <>
            {/* Mobile Layout */}
            <div className="md:hidden">
                <MobileDedicationCard
                    dedication={dedication}
                    isNowPlaying={isNowPlaying}
                    onPlay={handlePlay}
                    layoutId={`card-${dedication.id}`}
                    // Inline play props
                    isInlinePlaying={isInlinePlaying}
                    inlineProgress={inlineProgress}
                    inlineDuration={inlineDuration}
                    onInlinePlay={onInlinePlay}
                    onInlinePause={onInlinePause}
                    onOpenFullView={onOpenFullView}
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                <DesktopDedicationCard
                    dedication={dedication}
                    isNowPlaying={isNowPlaying}
                    onPlay={handlePlay}
                    // Inline play props
                    isInlinePlaying={isInlinePlaying}
                    inlineProgress={inlineProgress}
                    inlineDuration={inlineDuration}
                    inlinePhase={inlinePhase}
                    onInlinePlay={onInlinePlay}
                    onInlinePause={onInlinePause}
                    onOpenFullView={onOpenFullView}
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
