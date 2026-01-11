import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import Banner from '../Banner';
import { FooterQuote } from './SharedComponents';

const DesktopDedicationsScreen = ({
    dedications,
    currentCardIndex,
    showPlayer,
    lastPlayedIndex,
    onBack,
    onCardClick,
    onClosePlayer,
    onNext,
    onPrevious,
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
        <section id="dedications-screen" className="min-h-screen w-full bg-celebration-cream">
            {/* Banner - only show when NOT in player mode */}
            {!showPlayer && <Banner onBack={onBack} />}

            {/* Main Content Area */}
            <main
                className={`pb-12 mx-auto px-12 max-w-[1300px] xl:max-w-full flex flex-col items-center ${showPlayer ? 'hidden' : ''}`}
            >
                {/* Cards Grid */}
                <div className="w-full grid grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
                    {dedications.map((dedication, index) => (
                        <div id={`card-${index}`} key={dedication.id} className="min-w-0">
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

                {/* Desktop Footer Quote */}
                <FooterQuote />
            </main>

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

export default DesktopDedicationsScreen;
