import { useState, useEffect, useRef } from 'react';
import { MobileDedicationsScreen, DesktopDedicationsScreen } from './screens';
import CelebrationFinale from './CelebrationFinale';

/**
 * DedicationsScreen - Main screen that shows the list of dedications
 * and manages which dedication is currently selected/playing.
 *
 * All playback is now handled locally in the ImmersivePlayer components.
 * This component just tracks:
 * - Which dedication is selected (playerIndex)
 * - Whether the immersive player is visible (showPlayer)
 */
const DedicationsScreen = ({ dedications, finaleData, onBack, autoStartPlayer, onAutoStartHandled }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [showFinale, setShowFinale] = useState(false);
    const [playerIndex, setPlayerIndex] = useState(-1);
    const autoStartHandled = useRef(false);

    // Viewport detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Auto-start player when autoStartPlayer prop is true
    useEffect(() => {
        if (autoStartPlayer && !autoStartHandled.current && dedications.length > 0) {
            autoStartHandled.current = true;
            // Open player with first dedication
            setPlayerIndex(0);
            setShowPlayer(true);
            // Notify parent that auto-start has been handled
            if (onAutoStartHandled) {
                onAutoStartHandled();
            }
        }
    }, [autoStartPlayer, dedications, onAutoStartHandled]);

    // Sync scroll when returning from player
    useEffect(() => {
        if (!showPlayer && playerIndex !== -1) {
            setTimeout(() => {
                document.getElementById(`card-${playerIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [showPlayer, playerIndex]);

    // Handle card click - open immersive player
    const handleCardClick = (index) => {
        setPlayerIndex(index);
        setShowPlayer(true);
    };

    // Handle "now listening" click
    const handleNowListeningClick = () => {
        if (playerIndex >= 0) {
            setShowPlayer(true);
        }
    };

    // Handle next dedication
    const handleNext = () => {
        if (playerIndex < dedications.length - 1) {
            setPlayerIndex(playerIndex + 1);
        } else {
            // End of list - show finale if available, otherwise close player
            setShowPlayer(false);
            if (finaleData) {
                setShowFinale(true);
            }
        }
    };

    // Handle previous dedication
    const handlePrevious = () => {
        if (playerIndex > 0) {
            setPlayerIndex(playerIndex - 1);
        }
    };

    // Handle close player
    const handleClosePlayer = () => {
        setShowPlayer(false);
    };

    // Handle finale
    const handleCloseFinale = () => {
        setShowFinale(false);
    };

    const handleReplayFinale = () => {
        // Replay is handled internally by CelebrationFinale
    };

    const handleFinaleClick = () => {
        setShowFinale(true);
    };

    // Get current dedication
    const currentDedication = playerIndex >= 0 ? dedications[playerIndex] : null;

    // Common props for both screen variants
    const screenProps = {
        dedications,
        currentCardIndex: playerIndex,
        showPlayer,
        lastPlayedIndex: playerIndex,
        onBack,
        onCardClick: handleCardClick,
        onNowListeningClick: handleNowListeningClick,
        onNext: handleNext,
        onPrevious: handlePrevious,
        onClosePlayer: handleClosePlayer,
        // Current dedication for ImmersivePlayer
        currentDedication,
        // Finale props
        finaleData,
        onFinaleClick: handleFinaleClick
    };

    // Show finale page if active
    if (showFinale && finaleData) {
        return (
            <CelebrationFinale
                finaleData={finaleData}
                onClose={handleCloseFinale}
                onReplay={handleReplayFinale}
            />
        );
    }

    return isMobile ? (
        <MobileDedicationsScreen {...screenProps} />
    ) : (
        <DesktopDedicationsScreen {...screenProps} />
    );
};

export default DedicationsScreen;
