import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import Banner from '../Banner';
import FinaleCard from '../cards/FinaleCard';
import { MobileFooter } from './SharedComponents';

/**
 * MobileDedicationsScreen - Mobile layout for dedications list.
 * All playback is now handled in the ImmersivePlayer.
 * Cards are clickable to open the immersive player.
 */
const MobileDedicationsScreen = ({
    dedications,
    currentCardIndex,
    showPlayer,
    lastPlayedIndex,
    onBack,
    onCardClick,
    onNext,
    onPrevious,
    onClosePlayer,
    // Finale props
    finaleData,
    onFinaleClick
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
                    paddingBottom: '24px',
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

                    {/* Finale Card at the end */}
                    {finaleData && (
                        <FinaleCard finaleData={finaleData} onClick={onFinaleClick} />
                    )}
                </div>

                {/* Mobile Footer */}
                <MobileFooter />
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

export default MobileDedicationsScreen;
