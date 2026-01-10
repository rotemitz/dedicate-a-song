import React, { useState, useEffect } from 'react';
import Header from './Header';
import DedicationCard from './DedicationCard';
import ImmersivePlayer from './ImmersivePlayer';

const DedicationsScreen = ({ dedications }) => {
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false);

    // Sync scroll when returning from player
    useEffect(() => {
        if (!showPlayer && currentCardIndex !== -1) {
            // Short delay to ensure display:none is removed
            setTimeout(() => {
                document.getElementById(`card-${currentCardIndex}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    }, [showPlayer, currentCardIndex]);

    const handleCardClick = (index) => {
        console.log('Card clicked encountered:', index);
        setCurrentCardIndex(index);
        setShowPlayer(true);
    };

    const handleNext = () => {
        if (currentCardIndex < dedications.length - 1) {
            setCurrentCardIndex(prev => prev + 1);
        } else {
            setShowPlayer(false);
            setCurrentCardIndex(-1);
        }
    };

    const handlePrevious = () => {
        if (currentCardIndex > 0) {
            setCurrentCardIndex(prev => prev - 1);
        }
    };

    return (
        <section id="dedications-screen" className="screen active">
            {/* Context Header - only show when NOT in player mode */}
            {!showPlayer && (
                <Header
                    autoplayEnabled={autoplayEnabled}
                    setAutoplayEnabled={setAutoplayEnabled}
                />
            )}

            {/* List View - Hidden when player is active */}
            <div className={`dedications-container ${showPlayer ? 'hidden' : ''}`} style={showPlayer ? { display: 'none' } : {}}>
                {dedications.map((dedication, index) => (
                    <div id={`card-${index}`} key={dedication.id}>
                        <DedicationCard
                            dedication={dedication}
                            index={index}
                            isNowPlaying={currentCardIndex === index && !showPlayer}
                            activeMediaType={null} // Disable inline auto-play logic
                            onPlay={() => handleCardClick(index)} // Launch player on interaction
                            onMediaEnded={() => { }} // Ignored for inline
                        />
                    </div>
                ))}
            </div>

            {/* Full Screen Player */}
            {showPlayer && currentCardIndex !== -1 && (
                <ImmersivePlayer
                    dedication={dedications[currentCardIndex]}
                    currentIndex={currentCardIndex}
                    totalCount={dedications.length}
                    onClose={() => setShowPlayer(false)}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            )}

            {!showPlayer && (
                <footer className="dedications-footer">
                    <p>Happy Birthday! 🎉</p>
                </footer>
            )}
        </section>
    );
};

export default DedicationsScreen;
