import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import Banner from '../Banner';
import FinaleCard from '../cards/FinaleCard';
import { FooterQuote } from './SharedComponents';

/**
 * DesktopDedicationsScreen - Desktop layout for dedications grid.
 * All playback is now handled in the ImmersivePlayer.
 * Cards are clickable to open the immersive player.
 */
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
    // Finale props
    finaleData,
    onFinaleClick
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
                            />
                        </div>
                    ))}

                    {/* Finale Card at the end */}
                    {finaleData && (
                        <div className="min-w-0">
                            <FinaleCard finaleData={finaleData} onClick={onFinaleClick} />
                        </div>
                    )}
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
