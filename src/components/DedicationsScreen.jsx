import { useState, useEffect } from 'react';
import { MobileDedicationsScreen, DesktopDedicationsScreen } from './screens';

const DedicationsScreen = ({ dedications }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false);
    const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);

    // Viewport detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Sync scroll when returning from player
    useEffect(() => {
        if (!showPlayer && currentCardIndex !== -1) {
            setTimeout(() => {
                document.getElementById(`card-${currentCardIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [showPlayer, currentCardIndex]);

    const handleCardClick = (index) => {
        console.log('Card clicked:', index);
        setCurrentCardIndex(index);
        setLastPlayedIndex(index);
        setShowPlayer(true);
    };

    const handleNowListeningClick = () => {
        if (lastPlayedIndex >= 0) {
            setCurrentCardIndex(lastPlayedIndex);
            setShowPlayer(true);
        }
    };

    const handleNext = () => {
        if (currentCardIndex < dedications.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
            setLastPlayedIndex(currentCardIndex + 1);
        } else {
            setShowPlayer(false);
            setCurrentCardIndex(-1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
            setLastPlayedIndex(currentCardIndex - 1);
        }
    };

    const handleClosePlayer = () => {
        setShowPlayer(false);
    };

    // Common props for both variants
    const screenProps = {
        dedications,
        autoplayEnabled,
        setAutoplayEnabled,
        currentCardIndex,
        showPlayer,
        lastPlayedIndex,
        onCardClick: handleCardClick,
        onNowListeningClick: handleNowListeningClick,
        onNext: handleNext,
        onPrevious: handlePrevious,
        onClosePlayer: handleClosePlayer
    };

    if (isMobile) {
        return <MobileDedicationsScreen {...screenProps} />;
    }

    return <DesktopDedicationsScreen {...screenProps} />;
};

export default DedicationsScreen;
