import { AnimatePresence } from 'framer-motion';
import Header from '../Header';
import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import { NowPlayingBar, MobileFooter } from './SharedComponents';

const MobileDedicationsScreen = ({
    dedications,
    autoplayEnabled,
    setAutoplayEnabled,
    currentCardIndex,
    showPlayer,
    lastPlayedIndex,
    onCardClick,
    onNowListeningClick,
    onNext,
    onPrevious,
    onClosePlayer
}) => {
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
                style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '8px',
                    paddingBottom: '112px',
                    ...(showPlayer ? { display: 'none' } : {})
                }}
            >
                {/* Mobile: Vertical list */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {dedications.map((dedication, index) => (
                        <div id={`card-${index}`} key={dedication.id}>
                            <DedicationCard
                                dedication={dedication}
                                index={index}
                                isNowPlaying={lastPlayedIndex === index && !showPlayer}
                                activeMediaType={null}
                                onPlay={() => onCardClick(index)}
                                onMediaEnded={() => { }}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Footer */}
                <MobileFooter />
            </main>

            {/* Floating Now Playing Bar */}
            <AnimatePresence>
                {!showPlayer && lastPlayedIndex >= 0 && (
                    <NowPlayingBar
                        key="now-playing"
                        dedication={dedications[lastPlayedIndex]}
                        isPlaying={true}
                        onOpen={onNowListeningClick}
                        onSkip={onNext}
                    />
                )}
            </AnimatePresence>

            {/* Full Screen Player */}
            {showPlayer && currentCardIndex !== -1 && (
                <ImmersivePlayer
                    dedication={dedications[currentCardIndex]}
                    currentIndex={currentCardIndex}
                    totalCount={dedications.length}
                    onClose={onClosePlayer}
                    onNext={onNext}
                    onPrevious={onPrevious}
                />
            )}
        </section>
    );
};

export default MobileDedicationsScreen;
