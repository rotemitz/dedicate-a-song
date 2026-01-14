import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';

const WelcomeScreen = ({ onStart }) => {
    // Lock scroll on welcome screen
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    // Twinkle effect (handled by CSS, but we can enhance if needed)

    const handleStart = (e) => {
        // Get button position for confetti origin
        const button = e.currentTarget;
        const rect = button.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;

        // Trigger confetti!
        const count = 200;
        const defaults = {
            origin: { x, y }
        };

        function fire(particleRatio, opts) {
            confetti({
                ...defaults,
                ...opts,
                particleCount: Math.floor(count * particleRatio)
            });
        }

        fire(0.25, {
            spread: 26,
            startVelocity: 55,
        });
        fire(0.2, {
            spread: 60,
        });
        fire(0.35, {
            spread: 100,
            decay: 0.91,
            scalar: 0.8
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 25,
            decay: 0.92,
            scalar: 1.2
        });
        fire(0.1, {
            spread: 120,
            startVelocity: 45,
        });

        onStart();
    };

    return (
        <section id="welcome-screen" className="screen active">
            <div className="welcome-content">
                <div className="sparkle-container">
                    <span className="sparkle">✨</span>
                    <span className="sparkle">✨</span>
                    <span className="sparkle">✨</span>
                </div>
                <h1 className="welcome-title">Happy 40th Birthday</h1>
                <h2 className="welcome-name">Tal</h2>
                <p className="welcome-subtitle">A collection of love, wishes & music<br />from those who cherish you most</p>
                <button
                    id="start-button"
                    className="start-button"
                    onClick={handleStart}
                >
                    <span className="button-text">Start Here</span>
                    <span className="button-icon">→</span>
                </button>
            </div>
            <div className="welcome-footer">
                Made with ❤️ for you
            </div>
        </section>
    );
};

export default WelcomeScreen;
