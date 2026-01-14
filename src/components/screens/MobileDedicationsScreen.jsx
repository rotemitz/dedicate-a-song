import { AnimatePresence } from 'framer-motion';
import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import Banner from '../Banner';
import { NowPlayingBar, MobileFooter } from './SharedComponents';

const MobileDedicationsScreen = ({
    dedications,
    currentCardIndex,
    showPlayer,
    lastPlayedIndex,
    onBack,
    onCardClick,
    onNowListeningClick,
    onNext,
    onPrevious,
    onClosePlayer,
    // Inline play props
    inlinePlayingIndex,
    inlineProgress,
    inlineDuration,
    inlineIsPlaying,
    inlinePhase,
    onInlinePlay,
    onInlinePause,
    onInlineSeek,
    onInlineSkip,
    onOpenFullView
}) => {
    return (
        <section id="dedications-screen" className="min-h-screen min-h-dvh bg-celebration-cream">
            {/* Banner - only show when NOT in player mode */}
            {!showPlayer && <Banner onBack={onBack} />}

            {/* Main Content Area */}
            <main
                className={`${showPlayer ? 'hidden' : ''}`}
                style={{
                    paddingLeft: '24px',
                    paddingRight: '24px',
                    paddingTop: '0px',
                    paddingBottom: inlinePlayingIndex >= 0 ? '112px' : '24px',
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
                                // Inline play props
                                isInlinePlaying={inlinePlayingIndex === index && inlineIsPlaying}
                                inlineProgress={inlineProgress}
                                inlineDuration={inlineDuration}
                                inlinePhase={inlinePhase}
                                onInlinePlay={() => onInlinePlay(index)}
                                onInlinePause={onInlinePause}
                                onInlineSeek={onInlineSeek}
                                onOpenFullView={() => onOpenFullView(index)}
                            />
                        </div>
                    ))}
                </div>

                {/* Mobile Footer */}
                <MobileFooter />
            </main>

            {/* Floating Now Playing Bar (for inline playback) */}
            <AnimatePresence>
                {!showPlayer && inlinePlayingIndex >= 0 && (
                    <NowPlayingBar
                        key="now-playing"
                        dedication={dedications[inlinePlayingIndex]}
                        isPlaying={inlineIsPlaying}
                        onPlayPause={() => inlineIsPlaying ? onInlinePause() : onInlinePlay(inlinePlayingIndex)}
                        onSkip={onInlineSkip}
                        onOpen={() => onOpenFullView(inlinePlayingIndex)}
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
