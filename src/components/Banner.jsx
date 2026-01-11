import { motion } from 'framer-motion';

const Banner = ({ onBack }) => {
    return (
        <header className="w-full bg-celebration-cream pt-4 pb-6 px-6 md:px-14 md:pt-8 md:pb-10">
            <div className="max-w-full mx-auto px-6 md:px-12 relative">
                {/* Back button - top right */}
                <motion.button
                    onClick={onBack}
                    className="absolute top-0 right-0 flex items-center gap-1.5 text-rose-gold-400 hover:text-rose-gold-600 transition-colors group"
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <span className="text-sm font-medium opacity-80 group-hover:opacity-100">Greetings 🎉</span>
                    <span className="material-symbols-outlined text-lg">arrow_upward</span>
                </motion.button>

                {/* Banner content */}
                <div className="text-left md:text-center">
                    <h1 className="font-serif text-rose-gold-500 text-2xl md:text-4xl lg:text-5xl font-semibold italic tracking-tight">
                        Birthday Wishes
                    </h1>
                    <p className="text-celebration-charcoal/50 text-base md:text-xl lg:text-2xl mt-1 md:mt-2 font-light">
                        for your 40th
                    </p>

                    {/* Desktop subtitle - adds more presence */}
                    <p className="hidden text-rose-gold-400/80 md:block text-sm lg:text-base mt-4">
                        A collection of heartfelt messages and songs from the people who love you most
                    </p>
                </div>
            </div>
        </header>
    );
};

export default Banner;
