import { motion } from 'framer-motion';

const FinaleCard = ({ finaleData, onClick }) => {
    if (!finaleData) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            onClick={onClick}
            className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-gold-400 via-rose-gold-500 to-rose-gold-600 shadow-premium cursor-pointer hover:shadow-floating transition-shadow"
        >
            {/* Decorative background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-10">
                    🎉
                </div>
            </div>

            {/* Content */}
            <div className="relative p-6 md:p-8 flex flex-col items-center text-center">
                {/* Play icon */}
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg">
                    <span className="material-symbols-outlined text-white text-3xl md:text-4xl">
                        play_arrow
                    </span>
                </div>

                {/* Title */}
                <h3 className="font-display text-2xl md:text-3xl font-bold text-white mb-2">
                    {finaleData.title}
                </h3>

                {/* Subtitle */}
                <p className="font-sans text-white/80 text-base md:text-lg">
                    {finaleData.subtitle}
                </p>

                {/* Watch video hint */}
                <div className="mt-4 flex items-center gap-2 text-white/70 text-sm">
                    <span className="material-symbols-outlined text-lg">videocam</span>
                    <span>צפה בסרטון הסיום</span>
                </div>
            </div>
        </motion.div>
    );
};

export default FinaleCard;
