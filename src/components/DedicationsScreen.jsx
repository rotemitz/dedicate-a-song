import React, { useState, useEffect } from 'react';
import Header from './Header';
import DedicationCard from './DedicationCard';

const DedicationsScreen = ({ dedications }) => {
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1); // -1 means nothing playing automatically

    // State to orchestrate which media on the card is playing
    // 'greeting' | 'song' | null
    const [activeMediaType, setActiveMediaType] = useState(null);

    // Play flow logic
    const handleMediaEnded = (cardIndex, mediaType) => {
        if (!autoplayEnabled) return;

        // Sequence: Greeting -> Song -> Next Card
        const currentCard = dedications[cardIndex];
        const hasSong = !!currentCard.song.local_file;

        if (mediaType === 'greeting') {
            if (hasSong) {
                // Determine layout time for smoother transition? 
                // Just switch state
                setActiveMediaType('song');
            } else {
                advanceToNextCard();
            }
        } else if (mediaType === 'song') {
            advanceToNextCard();
        }
    };

    const advanceToNextCard = () => {
        const nextIndex = currentCardIndex + 1;
        if (nextIndex < dedications.length) {
            setCurrentCardIndex(nextIndex);

            // Check what the next card has
            const nextCard = dedications[nextIndex];
            const hasGreeting = nextCard.voice_message || nextCard.video_message;
            if (hasGreeting) {
                setActiveMediaType('greeting');
            } else if (nextCard.song.local_file) {
                setActiveMediaType('song');
            } else {
                // Card has no media?? skip or just highlight?
                // Just highlight for a few seconds then move on?
                // For now, let's assume valid data or just stop.
                setTimeout(() => advanceToNextCard(), 3000);
                setActiveMediaType(null);
            }

            // Scroll into view
            scrollToCard(nextIndex);

        } else {
            // End of playlist
            setCurrentCardIndex(-1);
            setActiveMediaType(null);
        }
    };

    const scrollToCard = (index) => {
        // We can use refs or ID
        const el = document.getElementById(`card-${index}`);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    // Handle manual play interaction
    const handleCardPlay = (index, specificMedia) => {
        // If user clicks a card or play button, we update our "Now Playing" tracking
        // But if they clicked specific media, we don't necessarily want to force the sequence logic *unless* autoplay is on.

        setCurrentCardIndex(index);

        // If manual click, we might not set activeMediaType immediately if the user just pressed play on the native control.
        // The native control plays itself. We just want to highlight the card.
        // However, if they clicked the *Card* body (start sequence), we want to start the greeting.

        if (!specificMedia) {
            // Card body click -> Start Sequence
            const card = dedications[index];
            if (card.voice_message || card.video_message) {
                setActiveMediaType('greeting');
            } else {
                setActiveMediaType('song');
            }
        } else {
            // User clicked play on a specific audio/video element
            // We just update highlight, but we let the element play itself.
            // We can sync our state to match what they played so the sequence continues after it ends.
            setActiveMediaType(specificMedia);
        }
    };

    // We need a mechanism to trigger .play() on the child when state changes.
    // This is skipped here; handled inside DedicationCard via props effect?
    // Actually DedicationCard receiving `shouldPlay={true}` is better.

    return (
        <section id="dedications-screen" className="screen active">
            <Header
                autoplayEnabled={autoplayEnabled}
                setAutoplayEnabled={setAutoplayEnabled}
            />

            <div className="dedications-container">
                {dedications.map((dedication, index) => (
                    <div id={`card-${index}`} key={dedication.id}>
                        <DedicationCard
                            dedication={dedication}
                            index={index}
                            isNowPlaying={currentCardIndex === index}
                            activeMediaType={currentCardIndex === index ? activeMediaType : null}
                            onPlay={(idx, media) => handleCardPlay(idx, media)}
                            onMediaEnded={(media) => handleMediaEnded(index, media)}
                        />
                    </div>
                ))}
            </div>

            <footer className="dedications-footer">
                <p>Happy Birthday! 🎉</p>
            </footer>
        </section>
    );
};

export default DedicationsScreen;
