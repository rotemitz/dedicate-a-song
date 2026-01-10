import { useState, useEffect, useRef } from 'react';
import { MobileDedicationsScreen, DesktopDedicationsScreen } from './screens';

const DedicationsScreen = ({ dedications }) => {
    const [isMobile, setIsMobile] = useState(false);
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false);
    const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);

    // Inline play state
    const [inlinePlayingIndex, setInlinePlayingIndex] = useState(-1);
    const [inlineProgress, setInlineProgress] = useState(0);
    const [inlineDuration, setInlineDuration] = useState(0);
    const [inlineIsPlaying, setInlineIsPlaying] = useState(false);
    const [inlinePhase, setInlinePhase] = useState('greeting'); // 'greeting' or 'song'
    const inlineAudioRef = useRef(null);

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

    // Inline play handlers
    const handleInlinePlay = (index) => {
        const dedication = dedications[index];
        if (!dedication?.song?.local_file) return;

        // If clicking same card, toggle play/pause
        if (inlinePlayingIndex === index) {
            if (inlineIsPlaying) {
                inlineAudioRef.current?.pause();
                setInlineIsPlaying(false);
            } else {
                inlineAudioRef.current?.play();
                setInlineIsPlaying(true);
            }
            return;
        }

        // Start playing new card - check for greeting first
        setInlinePlayingIndex(index);
        setLastPlayedIndex(index);
        setInlineIsPlaying(true);
        setInlineProgress(0);

        const hasGreeting = dedication.video_message || dedication.voice_message;
        const startPhase = hasGreeting ? 'greeting' : 'song';
        setInlinePhase(startPhase);

        // Load and play audio (greeting or song)
        if (inlineAudioRef.current) {
            if (startPhase === 'greeting') {
                // Play greeting audio (from video or voice message)
                inlineAudioRef.current.src = dedication.video_message || dedication.voice_message;
            } else {
                inlineAudioRef.current.src = dedication.song.local_file;
            }
            inlineAudioRef.current.load();
            inlineAudioRef.current.play().catch(e => console.error("Inline play error:", e));
        }
    };

    const handleInlineGreetingEnded = () => {
        // Transition from greeting to song
        const dedication = dedications[inlinePlayingIndex];
        if (dedication?.song?.local_file && inlinePhase === 'greeting') {
            setInlinePhase('song');
            setInlineProgress(0);
            if (inlineAudioRef.current) {
                inlineAudioRef.current.src = dedication.song.local_file;
                inlineAudioRef.current.load();
                inlineAudioRef.current.play().catch(e => console.error("Inline play error:", e));
            }
        } else {
            // No song after greeting, skip to next
            handleInlineSkip();
        }
    };

    const handleInlinePause = () => {
        inlineAudioRef.current?.pause();
        setInlineIsPlaying(false);
    };

    const handleInlineSkip = () => {
        // If in greeting phase, skip to song
        if (inlinePhase === 'greeting') {
            const dedication = dedications[inlinePlayingIndex];
            if (dedication?.song?.local_file) {
                handleInlineGreetingEnded();
                return;
            }
        }

        // Skip to next dedication
        const nextIndex = inlinePlayingIndex + 1;
        if (nextIndex < dedications.length) {
            handleInlinePlay(nextIndex);
        } else {
            setInlinePlayingIndex(-1);
            setInlineIsPlaying(false);
            setInlinePhase('greeting');
        }
    };

    const handleOpenFullView = (index) => {
        // Stop inline playback
        inlineAudioRef.current?.pause();
        setInlinePlayingIndex(-1);
        setInlineIsPlaying(false);

        // Open immersive player
        setCurrentCardIndex(index);
        setLastPlayedIndex(index);
        setShowPlayer(true);
    };

    const handleCardClick = (index) => {
        // For backward compatibility, open immersive player directly
        // This will be overridden by inline play in updated cards
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

    // Inline audio progress tracking
    useEffect(() => {
        const audio = inlineAudioRef.current;
        if (!audio) return;

        const updateProgress = () => {
            setInlineProgress(audio.currentTime || 0);
            setInlineDuration(audio.duration || 0);
        };

        const handleEnded = () => {
            if (inlinePhase === 'greeting') {
                handleInlineGreetingEnded();
            } else {
                handleInlineSkip();
            }
        };

        audio.addEventListener('timeupdate', updateProgress);
        audio.addEventListener('loadedmetadata', updateProgress);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', updateProgress);
            audio.removeEventListener('loadedmetadata', updateProgress);
            audio.removeEventListener('ended', handleEnded);
        };
    }, [inlinePlayingIndex, inlinePhase]);

    // Pause inline playback when immersive player opens
    useEffect(() => {
        if (showPlayer && inlinePlayingIndex !== -1) {
            inlineAudioRef.current?.pause();
            setInlineIsPlaying(false);
        }
    }, [showPlayer]);

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
            {/* Hidden audio element for inline playback */}
            <audio ref={inlineAudioRef} />

            {isMobile ? (
                <MobileDedicationsScreen {...screenProps} />
            ) : (
                <DesktopDedicationsScreen {...screenProps} />
            )}
        </>
    );
};

export default DedicationsScreen;
