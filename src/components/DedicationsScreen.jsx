import { useState, useEffect } from 'react';
import { MobileDedicationsScreen, DesktopDedicationsScreen } from './screens';
import { useAudioPlayer } from '../context/AudioContext';

const DedicationsScreen = ({ dedications }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [showPlayer, setShowPlayer] = useState(false);

    // Use global audio context
    const {
        currentDedication,
        currentDedicationIndex,
        isPlaying,
        currentTime,
        duration,
        phase,
        loadDedication,
        togglePlay,
        pause,
        skipToSong,
        stop,
        setOnDedicationEnd,
    } = useAudioPlayer();

    // Viewport detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Register dedication end handler
    useEffect(() => {
        setOnDedicationEnd(() => {
            // When a dedication ends, move to next or close player
            if (currentDedicationIndex < dedications.length - 1) {
                // Load next dedication
                loadDedication(dedications[currentDedicationIndex + 1], currentDedicationIndex + 1);
            } else {
                // End of list
                if (showPlayer) {
                    setShowPlayer(false);
                }
            }
        });
    }, [currentDedicationIndex, dedications, showPlayer, loadDedication, setOnDedicationEnd]);

    // Sync scroll when returning from player
    useEffect(() => {
        if (!showPlayer && currentDedicationIndex !== -1) {
            setTimeout(() => {
                document.getElementById(`card-${currentDedicationIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [showPlayer, currentDedicationIndex]);

    // Inline play handlers - now using global context
    const handleInlinePlay = (index) => {
        const dedication = dedications[index];
        console.log('[handleInlinePlay] Called with index:', index, 'currentDedicationIndex:', currentDedicationIndex, 'isPlaying:', isPlaying);
        if (!dedication) {
            console.log('[handleInlinePlay] No dedication found at index', index);
            return;
        }

        // If clicking same card, toggle play/pause
        if (currentDedicationIndex === index) {
            console.log('[handleInlinePlay] Same card - toggling play/pause');
            togglePlay();
            return;
        }

        // Start playing new dedication
        console.log('[handleInlinePlay] New card - loading dedication:', dedication.name);
        loadDedication(dedication, index);
    };

    const handleInlinePause = () => {
        pause();
    };

    const handleInlineSkip = () => {
        // If in greeting phase, skip to song
        if (phase === 'greeting') {
            skipToSong();
            return;
        }

        // Skip to next dedication
        const nextIndex = currentDedicationIndex + 1;
        if (nextIndex < dedications.length) {
            loadDedication(dedications[nextIndex], nextIndex);
        } else {
            stop();
        }
    };

    const handleOpenFullView = (index) => {
        // If different dedication, load it first
        if (currentDedicationIndex !== index) {
            loadDedication(dedications[index], index);
        }
        // Open immersive player
        setShowPlayer(true);
    };

    const handleCardClick = (index) => {
        // Open immersive player
        handleOpenFullView(index);
    };

    const handleNowListeningClick = () => {
        if (currentDedicationIndex >= 0) {
            setShowPlayer(true);
        }
    };

    const handleNext = () => {
        if (currentDedicationIndex < dedications.length - 1) {
            loadDedication(dedications[currentDedicationIndex + 1], currentDedicationIndex + 1);
        } else {
            setShowPlayer(false);
        }
    };

    const handlePrevious = () => {
        if (currentDedicationIndex > 0) {
            loadDedication(dedications[currentDedicationIndex - 1], currentDedicationIndex - 1);
        }
    };

    const handleClosePlayer = () => {
        setShowPlayer(false);
    };

    // Map global state to props expected by screens
    const inlinePlayingIndex = currentDedicationIndex;
    const inlineProgress = currentTime;
    const inlineDuration = duration;
    const inlineIsPlaying = isPlaying;
    const inlinePhase = phase;
    const lastPlayedIndex = currentDedicationIndex;
    const currentCardIndex = currentDedicationIndex;

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
        onClosePlayer: handleClosePlayer,
        // Inline play props
        inlinePlayingIndex,
        inlineProgress,
        inlineDuration,
        inlineIsPlaying,
        inlinePhase,
        onInlinePlay: handleInlinePlay,
        onInlinePause: handleInlinePause,
        onInlineSkip: handleInlineSkip,
        onOpenFullView: handleOpenFullView
    };

    return (
        <>
            {isMobile ? (
                <MobileDedicationsScreen {...screenProps} />
            ) : (
                <DesktopDedicationsScreen {...screenProps} />
            )}
        </>
    );
};

export default DedicationsScreen;
