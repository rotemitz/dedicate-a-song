import React, { useEffect, useState } from 'react';
import { DesktopImmersivePlayer, MobileImmersivePlayer } from './player';

/**
 * ImmersivePlayer - Adaptive player that renders Desktop or Mobile version
 * based on viewport width. Uses the new "antigravity" design system with
 * rose gold and cream theme.
 */
const ImmersivePlayer = ({
    dedication,
    currentIndex = 0,
    totalCount = 1,
    eventTitle = "Birthday Dedications",
    onClose,
    onNext,
    onPrevious,
}) => {
    const [isMobile, setIsMobile] = useState(false);

    // Detect viewport size on mount and resize
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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
