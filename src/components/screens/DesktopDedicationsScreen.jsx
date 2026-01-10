import Header from '../Header';
import DedicationCard from '../DedicationCard';
import ImmersivePlayer from '../ImmersivePlayer';
import { SectionDivider, FooterQuote } from './SharedComponents';

const DesktopDedicationsScreen = ({
    dedications,
    autoplayEnabled,
    setAutoplayEnabled,
    currentCardIndex,
    showPlayer,
    lastPlayedIndex,
    onCardClick,
    onClosePlayer,
    onNext,
    onPrevious
}) => {
    return (
        <section id="dedications-screen" className="min-h-screen w-full bg-celebration-cream">
            {/* Header - only show when NOT in player mode */}
            {!showPlayer && (
                <Header
                    autoplayEnabled={autoplayEnabled}
                    setAutoplayEnabled={setAutoplayEnabled}
                />
            )}

            {/* Main Content Area */}
            <main
                className={`py-12 ${showPlayer ? 'hidden' : ''}`}
                style={{
                    maxWidth: '1000px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: '48px',
                    paddingRight: '48px',
                    ...(showPlayer ? { display: 'none' } : {})
                }}
            >
                {/* Desktop Headline Section */}
                <section className="mb-12">
                    <h1 className="text-celebration-charcoal tracking-tight text-4xl lg:text-5xl font-bold leading-tight text-center pb-3 font-serif">
                        A Collection of Love
                    </h1>
                    <p className="text-rose-gold-600 text-center text-lg max-w-2xl mx-auto">
                        Celebrating four decades of your beautiful light. Heartfelt messages from the people who cherish you most.
                    </p>
                </section>

                {/* Section Divider */}
                <SectionDivider title="Rose Gold Audio Tracks" />

                {/* Cards Grid */}
                <div className="grid grid-cols-2 xl:grid-cols-3 gap-8 lg:gap-10">
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
