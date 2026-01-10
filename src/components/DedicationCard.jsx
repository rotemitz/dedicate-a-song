import React from 'react';
import MobileDedicationCard from './cards/MobileDedicationCard';
import DesktopDedicationCard from './cards/DesktopDedicationCard';

/**
 * DedicationCard - Main wrapper component
 * 
 * Renders mobile or desktop card based on viewport.
 * Audio playback is now managed globally via AudioContext.
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

            {/* Audio elements removed - now managed globally via AudioContext */}
        </>
    );
};

export default DedicationCard;
