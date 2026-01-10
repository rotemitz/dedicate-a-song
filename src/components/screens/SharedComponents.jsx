import { motion } from 'framer-motion';

/**
 * Floating Now Playing Component (Mobile Only)
 */
export const NowPlayingBar = ({ dedication, isPlaying = true, onOpen, onPlayPause, onSkip }) => {
    if (!dedication) return null;

    return (
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={onOpen}
            className="
                fixed left-6 right-6 z-50 cursor-pointer
                flex items-center p-3 h-16
                bg-white/90 backdrop-blur-md
                rounded-full shadow-floating
            "
            style={{ bottom: 'max(24px, env(safe-area-inset-bottom))' }}
        >
            {/* Rotating Record Icon */}
            <motion.div
                animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
                transition={isPlaying ? { duration: 3, repeat: Infinity, ease: "linear" } : {}}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-gold-400 to-rose-gold-600 flex items-center justify-center shadow-md flex-shrink-0"
            >
                <div className="w-3 h-3 rounded-full bg-white/90" />
            </motion.div>

            {/* Text Stack */}
            <div className="flex-1 min-w-0 ml-3">
                <p className="text-sm font-bold text-celebration-charcoal truncate">
                    {dedication.song?.title || `${dedication.name}'s Dedication`}
                </p>
                <p className="text-xs text-celebration-charcoal/60 truncate">
                    {dedication.song?.artist || dedication.name}
                </p>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-1 ml-2">
                <button
                    className="w-9 h-9 flex items-center justify-center text-rose-gold-500 hover:text-rose-gold-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onPlayPause?.(); }}
                    aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">
                        {isPlaying ? 'pause' : 'play_arrow'}
                    </span>
                </button>
                <button
                    className="w-9 h-9 flex items-center justify-center text-rose-gold-500 hover:text-rose-gold-600 transition-colors"
                    onClick={(e) => { e.stopPropagation(); onSkip?.(); }}
                    aria-label="Skip to next dedication"
                >
                    <span className="material-symbols-outlined text-2xl" aria-hidden="true">skip_next</span>
                </button>
            </div>
        </motion.div>
    );
};

/**
 * Section Divider Component
 */
export const SectionDivider = ({ title }) => (
    <div className="flex items-center justify-center gap-4 mb-8">
        <div className="h-[1px] flex-1 bg-rose-gold-200" />
        <h4 className="text-rose-gold-600 text-sm font-bold uppercase tracking-widest px-4 py-2">
            {title}
        </h4>
        <div className="h-[1px] flex-1 bg-rose-gold-200" />
    </div>
);

/**
 * Footer Quote Section (Desktop)
 */
export const FooterQuote = () => (
    <footer className="mt-24 pt-16 pb-20 border-t border-rose-gold-100/50 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-rose-gold-100 mb-6">
            <span className="material-symbols-outlined text-rose-gold-500">auto_fix_high</span>
        </div>
        <p className="text-rose-gold-600 font-serif italic text-xl">
            "A lifetime of memories, just beginning at 40."
        </p>
        <div className="mt-8 flex justify-center gap-4">
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
            <div className="w-2 h-2 rounded-full bg-rose-gold-200" />
        </div>
    </footer>
);

/**
 * Mobile Footer
 */
export const MobileFooter = () => (
    <footer className="text-center py-8 text-rose-gold-400">
        <p className="font-serif text-lg">Happy Birthday!</p>
    </footer>
);
