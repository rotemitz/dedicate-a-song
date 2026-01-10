import React, { useEffect, useState } from 'react';

const Header = ({ autoplayEnabled, setAutoplayEnabled }) => {
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

    return (
        <header
            className={`
                sticky top-0 z-50 w-full transition-all duration-300
                border-b border-rose-gold-100/50
                ${scrolled
                    ? 'bg-celebration-cream/80 backdrop-blur-md'
                    : 'bg-celebration-cream/80 backdrop-blur-md'
                }
            `}
        >
            {/* Desktop Layout */}
            <div
                className="hidden md:flex items-center justify-between py-4 md:py-6"
                style={{
                    maxWidth: '1000px',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    paddingLeft: '48px',
                    paddingRight: '48px'
                }}
            >
                {/* Back Button */}
                <button className="flex items-center gap-2 text-rose-gold-600 hover:text-rose-gold-700 transition-colors">
                    <span className="material-symbols-outlined">chevron_left</span>
                    <span className="font-medium">Back to Home</span>
                </button>

                {/* Title */}
                <h2 className="text-celebration-charcoal text-lg md:text-xl font-bold leading-tight tracking-tight text-center">
                    For Your 40th
                </h2>

                {/* Continuous Play Button */}
                <button
                    onClick={() => setAutoplayEnabled(!autoplayEnabled)}
                    className="flex items-center gap-2 bg-gradient-to-r from-rose-gold-400 to-rose-gold-600 text-white px-4 py-2 rounded-full hover:shadow-lg shadow-md shadow-rose-gold-500/20 hover:shadow-rose-gold-500/30 transition-all"
                >
                    <span className="material-symbols-outlined text-sm">play_arrow</span>
                    <span className="text-sm font-bold tracking-wide">Continuous Play</span>
                </button>
            </div>

            {/* Mobile Layout */}
            <div
                className="md:hidden flex justify-between items-center"
                style={{ paddingTop: '48px', paddingLeft: '24px', paddingRight: '24px', paddingBottom: '20px' }}
            >
                {/* Title Section */}
                <div className="space-y-0.5">
                    <h1
                        className="font-serif text-2xl font-bold leading-tight"
                        style={{
                            background: 'linear-gradient(135deg, #D4907B 0%, #955444 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}
                    >
                        Birthday Dedications
                    </h1>
                    <p className="font-serif text-lg text-celebration-charcoal/60">
                        for your 40th
                    </p>
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
