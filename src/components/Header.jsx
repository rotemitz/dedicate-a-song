import React, { useEffect, useState } from 'react';

const Header = ({ autoplayEnabled, setAutoplayEnabled, title = "Birthday Wishes" }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            if (scrollPos > 60) {
                setScrolled(true);
            } else if (scrollPos < 20) {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleBackToHome = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header
            className={`
                sticky top-0 z-50 w-full transition-all duration-300
                ${scrolled
                    ? 'bg-celebration-cream/95 backdrop-blur-md shadow-lg border-b border-rose-gold-200/50 py-3'
                    : 'bg-celebration-cream/80 backdrop-blur-md border-b border-rose-gold-100/30'
                }
            `}
        >
            {/* Desktop Layout */}
            <div className={`hidden md:flex items-center justify-between max-w-[1000px] mx-auto px-12 transition-all duration-300 ${scrolled ? 'py-3' : 'py-6'}`}>
                {/* Back Button */}
                <button
                    onClick={handleBackToHome}
                    className="flex items-center gap-2 text-rose-gold-600 hover:text-rose-gold-700 transition-colors focus:outline-none focus:ring-2 focus:ring-rose-gold-400 focus:ring-offset-2 rounded-lg px-2 py-1"
                    aria-label="Back to top"
                >
                    <span className="material-symbols-outlined" aria-hidden="true">chevron_left</span>
                    <span className="font-medium">Back to Top</span>
                </button>

                {/* Title */}
                <h2 className={`text-celebration-charcoal font-bold leading-tight tracking-tight text-center transition-all duration-300 ${scrolled ? 'text-lg' : 'text-xl'}`}>
                    {title}
                </h2>

                {/* Continuous Play Button */}
                <button
                    onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-gold-400 to-rose-gold-600 text-white px-4 py-2 rounded-full hover:shadow-lg shadow-md shadow-rose-gold-500/20 hover:shadow-rose-gold-500/30 transition-all"
                    aria-label={autoplayEnabled ? 'Disable continuous play' : 'Enable continuous play'}
                    aria-pressed={autoplayEnabled}
                >
                    <span className="material-symbols-outlined text-sm" aria-hidden="true">play_arrow</span>
                    <span className="text-sm font-bold tracking-wide">Continuous Play</span>
                </button>
            </div>

            {/* Mobile Layout */}
            <div className={`md:hidden flex justify-between items-center px-6 transition-all duration-300 ${scrolled ? 'pt-4 pb-3' : 'pt-12 pb-5'}`}>
                {/* Title Section */}
                <div className="space-y-0.5">
                    <h1 className={`font-serif font-bold leading-tight bg-gradient-to-r from-rose-gold-500 to-rose-gold-700 bg-clip-text text-transparent transition-all duration-300 ${scrolled ? 'text-xl' : 'text-2xl'}`}>
                        {title}
                    </h1>
                    {!scrolled && (
                        <p className="font-serif text-lg text-celebration-charcoal/60">
                            A collection of love
                        </p>
                    )}
                </div>

                {/* Toggle Section */}
                <div className="flex flex-col items-center gap-1.5">
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={autoplayEnabled}
                            onChange={(e) => setAutoplayEnabled(e.target.checked)}
                        />
                        <div
                            className={`
                                w-10 h-5 rounded-full transition-all
                                peer-focus:outline-none
                                after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                                after:bg-white after:border-gray-300 after:border after:rounded-full
                                after:h-4 after:w-4 after:transition-all
                                peer-checked:after:translate-x-5 peer-checked:after:border-white
                                ${autoplayEnabled
                                    ? 'bg-gradient-to-r from-rose-gold-300 to-rose-gold-500'
                                    : 'bg-gray-200'
                                }
                            `}
                        />
                    </label>
                    <span className="text-[8px] uppercase tracking-[0.15em] font-bold text-rose-gold-500">
                        Continuous Play
                    </span>
                </div>
            </div>
        </header>
    );
};

export default Header;
