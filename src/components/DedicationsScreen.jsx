import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from './Header';
import DedicationCard from './DedicationCard';
import ImmersivePlayer from './ImmersivePlayer';


/**
 * Floating Now Playing Component (Mobile Only)
 * 
 * Spec:
 * - Position: fixed bottom-6 left-6 right-6
 * - Layout: flex items-center p-3 h-16 bg-white/90 backdrop-blur-md rounded-full shadow-floating
 * - Elements:
 *   - Small rotating record icon (40px diameter) on the left
 *   - Text stack: Song title (14px Bold) / Artist (12px Regular)
 *   - Controls: Play/Pause and Skip icons in rose-gold-500
 */
const NowPlayingBar = ({ dedication, isPlaying = true, onOpen, onPlayPause, onSkip }) => {
    if (!dedication) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={onOpen}
            className="
                md:hidden fixed bottom-6 left-6 right-6 z-50 cursor-pointer
                flex items-center p-3 h-16
                bg-white/90 backdrop-blur-md
                rounded-full shadow-floating
            "
        >
            {/* Rotating Record Icon - 40px diameter */}
            <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 flex items-center justify-center shadow-md flex-shrink-0"
            >
                <div className="w-3 h-3 rounded-full bg-white/90" />
            </motion.div>

            {/* Text Stack - Song title (14px Bold) / Artist (12px Regular) */}
            <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-bold text-celebration-charcoal truncate">
                    {dedication.song?.title || `${dedication.name}'s Dedication`}
                </p>
                <p className="text-xs text-celebration-charcoal/60 truncate">
                    {dedication.song?.artist || dedication.name}
                </p>
            </div>

            {/* Controls - Play/Pause and Skip in rose-gold-500 */}
            <div className="flex items-center gap-1 ml-2">
                <button
                    className="w-9 h-9 flex items-center justify-center text-rose-gold-500 hover:text-rose-gold-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onPlayPause?.(); }}
                >
                    <span className="material-symbols-outlined text-2xl">
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
                <button
                    className="w-9 h-9 flex items-center justify-center text-rose-gold-500 hover:text-rose-gold-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onSkip?.(); }}
                >
                    <span className="material-symbols-outlined text-2xl">skip_next</span>
                </button>
            </div>
        </motion.div>
    );
};

// Section Divider Component
const SectionDivider = ({ title }) => (
    <div className="flex items-center justify-center gap-4 my-8">
        <div className="h-[1px] flex-1 bg-rose-gold-200/50" />
        <h4 className="text-rose-gold-500 text-xs font-bold uppercase tracking-widest px-4 py-2">
            {title}
        </h4>
        <div className="h-[1px] flex-1 bg-rose-gold-200/50" />
    </div>
);

// Footer Quote Section (Desktop)
const FooterQuote = () => (
    <footer className="hidden md:block mt-20 border-t border-rose-gold-100 pt-12 pb-24 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-gold-100 mb-6">
            <span className="material-symbols-outlined text-rose-gold-500">auto_fix_high</span>
        </div>
        <p className="text-rose-gold-600 font-serif italic text-xl">
            "A lifetime of memories, just beginning at 40."
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
        </div>
    </footer>
);

const DedicationsScreen = ({ dedications }) => {
    const [autoplayEnabled, setAutoplayEnabled] = useState(true);
    const [currentCardIndex, setCurrentCardIndex] = useState(-1);
    const [showPlayer, setShowPlayer] = useState(false);
    const [lastPlayedIndex, setLastPlayedIndex] = useState(-1);

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

    return (
        <section id="dedications-screen" className="min-h-screen bg-celebration-cream">
            {/* Header - only show when NOT in player mode */}
            {!showPlayer && (
                <Header
                    autoplayEnabled={autoplayEnabled}
                    setAutoplayEnabled={setAutoplayEnabled}
                />
            )}

            {/* Main Content Area */}
            <main
                className={`${showPlayer ? 'hidden' : ''}`}
                style={showPlayer ? { display: 'none' } : {}}
            >
                {/* Desktop Headline Section */}
                <section className="hidden md:block max-w-7xl mx-auto px-4 pt-8 pb-4">
                    <h1 className="text-celebration-charcoal tracking-tight text-4xl lg:text-5xl font-bold leading-tight text-center pb-3 font-serif">
                        A Collection of Love
                    </h1>
                    <p className="text-rose-gold-600 text-center text-lg max-w-2xl mx-auto">
                        Celebrating four decades of your beautiful light. Heartfelt messages from the people who cherish you most.
                    </p>
                </section>

                {/* Section Divider */}
                <div className="max-w-7xl mx-auto px-4">
                    <SectionDivider title="Rose Gold Audio Tracks" />
                </div>

                {/* Cards Container */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 pb-32">
                    {/* Mobile: Vertical list */}
                    <div className="md:hidden space-y-4 px-2">
                        {dedications.map((dedication, index) => (
                            <div id={`card-${index}`} key={dedication.id}>
                                <DedicationCard
                                    dedication={dedication}
                                    index={index}
                                    isNowPlaying={lastPlayedIndex === index && !showPlayer}
                                    activeMediaType={null}
                                    onPlay={() => handleCardClick(index)}
                                    onMediaEnded={() => { }}
                                />
                            </div>
                        ))}
                    </div>

                    {/* Desktop: Grid layout */}
                    <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {dedications.map((dedication, index) => (
                            <div id={`card-${index}`} key={dedication.id}>
                                <DedicationCard
                                    dedication={dedication}
                                    index={index}
                                    isNowPlaying={lastPlayedIndex === index && !showPlayer}
                                    activeMediaType={null}
                                    onPlay={() => handleCardClick(index)}
                                    onMediaEnded={() => { }}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer Quote (Desktop) */}
                <div className="max-w-7xl mx-auto px-4">
                    <FooterQuote />
                </div>

                {/* Mobile Footer */}
                <footer className="md:hidden text-center py-8 text-rose-gold-400">
                    <p className="font-serif text-lg">Happy Birthday! 🎉</p>
                </footer>
            </main>

            {/* Floating Now Playing Bar (Mobile Only) */}
            <AnimatePresence>
                {!showPlayer && lastPlayedIndex >= 0 && (
                    <NowPlayingBar
                        key="now-playing"
                        dedication={dedications[lastPlayedIndex]}
                        isPlaying={true}
                        onOpen={handleNowListeningClick}
                        onSkip={handleNext}
                    />
                )}
            </AnimatePresence>

            {/* Full Screen Player */}
            {showPlayer && currentCardIndex !== -1 && (
                <ImmersivePlayer
                    dedication={dedications[currentCardIndex]}
                    currentIndex={currentCardIndex}
                    totalCount={dedications.length}
                    onClose={handleClosePlayer}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                />
            )}
        </section>
    );
};

export default DedicationsScreen;
