import React from 'react';

// Animated Waveform visual (reuses logic from WaveformVisualizer in PlayerComponents)
const CardWaveform = ({ isPlaying = false }) => {
    const barCount = 13;

    // Generate unique random animation parameters for each bar
    const barParams = React.useMemo(
        () => [...Array(barCount)].map(() => ({
            minHeight: Math.random() * 8 + 8,    // 8-16px min
            maxHeight: Math.random() * 16 + 24,  // 24-40px max
            duration: 0.3 + Math.random() * 0.4, // 0.3-0.7s duration
        })),
        [barCount]
    );

    return (
        <>
            {/* Inject keyframes dynamically */}
            <style>
                {barParams.map((params, i) => `
                    @keyframes card-waveform-bar-${i} {
                        0%, 100% { height: ${params.minHeight}px; }
                        50% { height: ${params.maxHeight}px; }
                    }
                `).join('\n')}
            </style>
            <div className="flex items-center justify-center gap-1 h-12">
                {barParams.map((params, i) => (
                    <div
                        key={i}
                        className="w-[3px] rounded-full bg-gradient-to-t from-rose-gold-700 to-rose-gold-500"
                        style={{
                            opacity: isPlaying ? 1 : 0.3,
                            animation: `card-waveform-bar-${i} ${params.duration}s ease-in-out infinite`,
                            animationDelay: `${i * 0.05}s`,
                            animationPlayState: isPlaying ? 'running' : 'paused',
                            transition: 'opacity 0.3s ease',
                            willChange: isPlaying ? 'height' : 'auto'
                        }}
                    />
                ))}
            </div>
        </>
    );
};

export default CardWaveform;
