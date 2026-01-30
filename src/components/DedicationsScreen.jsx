import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { MobileDedicationsScreen, DesktopDedicationsScreen } from './screens';
import CelebrationFinale from './CelebrationFinale';
import { useDedications } from '../contexts/DedicationsContext';
import { getSortFromUrl, getSavedSort, getDedicationIndexBySlug, normalizeDedicationName, getPlayerStateFromUrl } from '../lib/routingUtils';

/**
 * DedicationsScreen - Main screen that shows the list of dedications
 * Now with routing support for:
 * - URL-based sorting (/dedications?sort=emotional)
 * - Direct dedication links (/dedication/rotem)
 * - State persistence across refreshes
 */
const DedicationsScreen = () => {
    const navigate = useNavigate();
    const { name } = useParams(); // For /dedication/:name routes
    const [searchParams] = useSearchParams();
    const { getSortedDedications, finaleData } = useDedications();

    const [isMobile, setIsMobile] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const [showFinale, setShowFinale] = useState(false);
    const [playerIndex, setPlayerIndex] = useState(-1);
    const autoStartHandled = useRef(false);

    // Get sort order from URL or localStorage
    const sortType = getSortFromUrl(searchParams) || getSavedSort() || 'emotional';
    const dedications = getSortedDedications(sortType);

    // Viewport detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Handle direct dedication link (/dedication/:name)
    useEffect(() => {
        if (name && dedications.length > 0 && !autoStartHandled.current) {
            const index = getDedicationIndexBySlug(dedications, name);
            if (index >= 0) {
                autoStartHandled.current = true;
                setPlayerIndex(index);
                setShowPlayer(true);
            }
        }
    }, [name, dedications]);

    // Handle autoplay from sorting screen
    useEffect(() => {
        const autoplay = searchParams.get('autoplay') === 'true';
        if (autoplay && !autoStartHandled.current && dedications.length > 0) {
            autoStartHandled.current = true;
            setPlayerIndex(0);
            setShowPlayer(true);
        }
    }, [searchParams, dedications]);

    // Sync scroll when returning from player
    useEffect(() => {
        if (!showPlayer && playerIndex !== -1) {
            setTimeout(() => {
                document.getElementById(`card-${playerIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [showPlayer, playerIndex]);

    // Update URL when opening player for a specific dedication
    const updateUrlForDedication = (index) => {
        if (index >= 0 && dedications[index]) {
            const slug = normalizeDedicationName(dedications[index].name);
            // Update URL without triggering a re-render
            window.history.replaceState(null, '', `/dedicate-a-song/dedication/${slug}`);
        }
    };

    // Handle card click - open immersive player
    const handleCardClick = (index) => {
        setPlayerIndex(index);
        setShowPlayer(true);
        updateUrlForDedication(index);
    };

    // Handle "now listening" click
    const handleNowListeningClick = () => {
        if (playerIndex >= 0) {
            setShowPlayer(true);
            updateUrlForDedication(playerIndex);
        }
    };

    // Handle next dedication
    const handleNext = () => {
        if (playerIndex < dedications.length - 1) {
            const nextIndex = playerIndex + 1;
            setPlayerIndex(nextIndex);
            updateUrlForDedication(nextIndex);
        } else {
            // End of list - show finale if available, otherwise close player
            setShowPlayer(false);
            if (finaleData) {
                setShowFinale(true);
            }
            // Restore dedications URL
            navigate(`/dedications?sort=${sortType}`, { replace: true });
        }
    };

    // Handle previous dedication
    const handlePrevious = () => {
        if (playerIndex > 0) {
            const prevIndex = playerIndex - 1;
            setPlayerIndex(prevIndex);
            updateUrlForDedication(prevIndex);
        }
    };

    // Handle close player
    const handleClosePlayer = () => {
        setShowPlayer(false);
        // Return to dedications list
        navigate(`/dedications?sort=${sortType}`, { replace: true });
    };

    // Handle back button - go to sorting screen
    const handleBack = () => {
        navigate('/sorting');
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

    // Get initial player state from URL (greeting or song)
    const initialPlayerState = getPlayerStateFromUrl(searchParams);

    // Common props for both screen variants
    const screenProps = {
        dedications,
        currentCardIndex: playerIndex,
        showPlayer,
        lastPlayedIndex: playerIndex,
        onBack: handleBack,
        onCardClick: handleCardClick,
        onNowListeningClick: handleNowListeningClick,
        onNext: handleNext,
        onPrevious: handlePrevious,
        onClosePlayer: handleClosePlayer,
        // Current dedication for ImmersivePlayer
        currentDedication,
        initialPlayerState, // Pass initial state from URL
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
