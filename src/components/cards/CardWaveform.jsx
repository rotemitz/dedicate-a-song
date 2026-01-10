import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Animated Waveform for playing state
const CardWaveform = ({ isPlaying }) => {
    const bars = [4, 8, 6, 10, 7, 9, 5, 8, 12, 7, 10, 6, 9, 11, 5, 8, 10, 7, 4];

    return (
        <div className="flex items-end justify-center gap-[2px] h-8">
            {bars.map((height, i) => (
                <motion.div
                    key={i}
                    className="w-[2px] rounded-full bg-gradient-to-t from-rose-gold-600 to-rose-gold-400"
                    initial={{ height: 4 }}
                    animate={isPlaying ? {
                        height: [height * 2, height * 4, height * 2, height * 3, height * 2],
                    } : { height: height * 2 }}
                    transition={isPlaying ? {
                        duration: 0.8 + Math.random() * 0.4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: i * 0.05,
                    } : { duration: 0.3 }}
                />
            ))}
        </div>
    );
};

export default CardWaveform;
