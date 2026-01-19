import React from 'react';
import MobileDedicationCard from './cards/MobileDedicationCard';
import DesktopDedicationCard from './cards/DesktopDedicationCard';

/**
 * DedicationCard - Main wrapper component
 *
 * Renders mobile or desktop card based on viewport.
 * Clicking opens the immersive player.
 */
const DedicationCard = ({
    dedication,
    index,
    isNowPlaying,
    onPlay,
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
                />
            </div>

            {/* Desktop Layout */}
            <div className="hidden md:block">
                <DesktopDedicationCard
                    dedication={dedication}
                    isNowPlaying={isNowPlaying}
                    onPlay={handlePlay}
                />
            </div>
        </>
    );
};

export default DedicationCard;
