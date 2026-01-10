import React, { useEffect, useState } from 'react';

const Header = ({ autoplayEnabled, setAutoplayEnabled }) => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPos = window.scrollY;
            // Hysteresis to prevent jitter
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
        <header className={`dedications-header ${scrolled ? 'scrolled' : ''}`}>
            <div className="header-main-row">
                <h1>🎂 Birthday Wishes for <span className="highlight-name">Tal</span></h1>

                {/* Autoplay Toggle */}
                <div className="autoplay-control">
                    <label className="autoplay-label" htmlFor="autoplay-toggle">
                        <span className="autoplay-icon">▶️</span>
                        <span>Autoplay</span>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                id="autoplay-toggle"
                                className="toggle-input"
                                checked={autoplayEnabled}
                                onChange={(e) => setAutoplayEnabled(e.target.checked)}
                            />
                            <span className="toggle-slider"></span>
                        </div>
                    </label>
                </div>
            </div>
            <p className="dedications-intro">Scroll through messages from your loved ones</p>
        </header>
    );
};

export default Header;
