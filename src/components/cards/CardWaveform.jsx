import React from 'react';

// Static Waveform visual (matches Stitch design)
const CardWaveform = () => {
    // Heights in px matching the Stitch design pattern
    const bars = [16, 32, 48, 40, 24, 32, 48, 40, 16, 32, 44, 36, 20];

    return (
        <div className="flex items-center justify-center gap-1 h-full">
            {bars.map((height, i) => (
                <div
                    key={i}
                    className="w-[3px] rounded-full bg-gradient-to-t from-rose-gold-700 to-rose-gold-500"
                    style={{ height: `${height}px` }}
                />
            ))}
        </div>
    );
};

export default CardWaveform;
