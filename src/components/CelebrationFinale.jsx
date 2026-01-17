import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

const CelebrationFinale = ({ finaleData, onClose, onReplay }) => {
    const videoRef = useRef(null);
    const [isVideoEnded, setIsVideoEnded] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(true);

    // Lock scroll and trigger confetti on mount
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';

        // Trigger celebratory confetti burst
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0, y: 0.7 },
                colors: ['#D4907B', '#F5C7B8', '#FDF8F2', '#FFD700']
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1, y: 0.7 },
                colors: ['#D4907B', '#F5C7B8', '#FDF8F2', '#FFD700']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();

        return () => {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        };
    }, []);

    const handleVideoEnd = () => {
        setIsVideoEnded(true);
    };

    const handleVideoLoaded = () => {
        setIsVideoLoading(false);
    };

    const handleReplay = () => {
        setIsVideoEnded(false);
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(e => console.error("Replay error:", e));
        }
        onReplay?.();
    };

    const handleClose = () => {
        if (videoRef.current) {
            videoRef.current.pause();
        }
        onClose();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-gradient-to-b from-celebration-cream via-rose-gold-50 to-rose-gold-100 flex flex-col items-center justify-center"
        >
            {/* Close button */}
            <button
                onClick={handleClose}
                className="absolute top-4 right-4 md:top-6 md:right-6 z-10 w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm shadow-floating flex items-center justify-center text-celebration-charcoal hover:bg-white transition-colors"
                aria-label="Close"
            >
                <span className="material-symbols-outlined text-xl">close</span>
            </button>

            {/* Main content container */}
            <div className="w-full max-w-4xl px-4 md:px-8 flex flex-col items-center">
                {/* Video container - adapts to video orientation */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="relative rounded-2xl md:rounded-3xl overflow-hidden shadow-premium mb-6 md:mb-8"
                >
                    {isVideoLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-celebration-charcoal rounded-2xl md:rounded-3xl">
                            <div className="w-12 h-12 rounded-full border-4 border-rose-gold-200 border-t-rose-gold-500 animate-spin" />
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        src={finaleData.video}
                        className="max-h-[60vh] md:max-h-[65vh] w-auto mx-auto rounded-2xl md:rounded-3xl"
                        autoPlay
                        playsInline
                        onEnded={handleVideoEnd}
                        onLoadedData={handleVideoLoaded}
                    />

                    {/* Replay overlay when video ends */}
                    {isVideoEnded && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute inset-0 bg-celebration-charcoal/60 rounded-2xl md:rounded-3xl flex items-center justify-center"
                        >
                            <button
                                onClick={handleReplay}
                                className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 shadow-floating flex items-center justify-center hover:scale-105 transition-transform"
                            >
                                <span className="material-symbols-outlined text-rose-gold-500 text-3xl md:text-4xl">replay</span>
                            </button>
                        </motion.div>
                    )}
                </motion.div>

                {/* Title and subtitle */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="text-center mb-8"
                >
                    <h1 className="font-display text-3xl md:text-5xl font-bold text-celebration-charcoal mb-2 md:mb-3">
                        {finaleData.title}
                    </h1>
                    <p className="font-sans text-lg md:text-xl text-rose-gold-600">
                        {finaleData.subtitle}
                    </p>
                </motion.div>

                {/* Action buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-3 md:gap-4 w-full max-w-md"
                >
                    <button
                        onClick={handleReplay}
                        className="flex-1 px-6 py-3 md:py-4 bg-gradient-to-r from-rose-gold-400 to-rose-gold-500 text-white rounded-full font-bold shadow-floating hover:shadow-premium transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">replay</span>
                        <span>צפה שוב</span>
                    </button>
                    <button
                        onClick={handleClose}
                        className="flex-1 px-6 py-3 md:py-4 bg-white/80 backdrop-blur-sm text-celebration-charcoal rounded-full font-bold shadow-floating hover:bg-white transition-all flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-outlined text-xl">arrow_back</span>
                        <span>חזרה להקדשות</span>
                    </button>
                </motion.div>
            </div>

            {/* Decorative sparkles */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[10%] animate-pulse">
                    <span className="text-2xl md:text-3xl opacity-60">✨</span>
                </div>
                <div className="absolute top-[15%] right-[15%] animate-pulse delay-300">
                    <span className="text-xl md:text-2xl opacity-50">✨</span>
                </div>
                <div className="absolute bottom-[20%] left-[20%] animate-pulse delay-500">
                    <span className="text-xl md:text-2xl opacity-40">✨</span>
                </div>
                <div className="absolute bottom-[25%] right-[10%] animate-pulse delay-700">
                    <span className="text-2xl md:text-3xl opacity-50">✨</span>
                </div>
            </div>
        </motion.div>
    );
};

export default CelebrationFinale;
