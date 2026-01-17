import React, { useEffect, useState } from 'react';
import { DesktopImmersivePlayer, MobileImmersivePlayer } from './player';
import { useAudioPlayer } from '../context/AudioContext';

/**
 * ImmersivePlayer - Adaptive player that renders Desktop or Mobile version
 * based on viewport width. Uses the new "antigravity" design system with
 * rose gold and cream theme.
 * 
 * Uses global AudioContext for dedication data and playback state.
 */
const ImmersivePlayer = ({
    currentIndex = 0,
    totalCount = 1,
    eventTitle = "Birthday Wishes",
    onClose,
    onNext,
    onPrevious,
    // Fallback dedication prop (used if context is not set)
    dedication: dedicationProp,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // Use dedication from context as primary source
    const { currentDedication, currentDedicationIndex } = useAudioPlayer();

    // Use context dedication if available, otherwise fallback to prop
    const dedication = currentDedication || dedicationProp;
    const index = currentDedicationIndex >= 0 ? currentDedicationIndex : currentIndex;

    // Detect viewport size on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // If no dedication available, don't render
    if (!dedication) {
        return null;
    }

    // Common props for both players
    const playerProps = {
        dedication,
        currentIndex: index,
        totalCount,
        eventTitle,
        onClose,
        onNext,
        onPrevious,
    };

    if (isMobile) {
        return <MobileImmersivePlayer {...playerProps} />;
    }

    return <DesktopImmersivePlayer {...playerProps} />;
};

export default ImmersivePlayer;
