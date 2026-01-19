import React, { useEffect, useState } from 'react';
import { DesktopImmersivePlayer, MobileImmersivePlayer } from './player';

/**
 * ImmersivePlayer - Adaptive player that renders Desktop or Mobile version
 * based on viewport width. Uses the new "antigravity" design system with
 * rose gold and cream theme.
 *
 * All playback state is now local to each player component.
 * This component just handles responsive switching.
 */
const ImmersivePlayer = ({
    dedication,
    currentIndex = 0,
    totalCount = 1,
    eventTitle = "Birthday Wishes",
    onClose,
    onNext,
    onPrevious,
}) => {
    // Initialize with correct value to avoid rendering wrong player first
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth < 768;
        }
        return false; // SSR fallback
    });

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
        currentIndex,
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
