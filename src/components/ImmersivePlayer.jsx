import React, { useState, useEffect, useRef } from 'react';

// -- Sub-Components (Defined Outside to prevent re-mounts) --

const GreetingPanel = ({
    dedication,
    videoRef,
    audioRef,
    isPlaying,
    isGreeting, // True if we are in greeting mode (affects visualizers)
    onEnded,
    onTogglePlay,
    progress,
    duration,
    desktopMode = false
}) => (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${desktopMode ? '' : 'px-6'}`}>
        {!desktopMode && (
            <div className="text-center mb-10 mt-12">
                <p className="text-sm font-medium tracking-[0.2em] text-[#B76E79]/80 uppercase mb-2">Voice Dedication</p>
                <h1 className="font-display text-2xl md:text-3xl leading-tight text-slate-900 dark:text-white">
                    A message from <span className="metallic-text italic font-semibold text-[#974e5a] dark:text-[#e7d0d4]">{dedication.name}</span>
                </h1>
            </div>
        )}

        {/* Visualizer Area */}
        <div className={`relative w-full ${desktopMode ? 'h-full' : 'aspect-square flex items-center justify-center mb-10'}`}>
            {dedication.video_message ? (
                <div className={`relative w-full h-full overflow-hidden ${desktopMode ? '' : 'rounded-full border-4 border-[#e7d0d4] shadow-2xl'}`}>
                    <video
                        ref={videoRef}
                        src={dedication.video_message}
                        className={`w-full h-full object-cover ${desktopMode ? 'opacity-90' : ''}`}
                        playsInline
                        onEnded={onEnded}
                        onClick={onTogglePlay}
                    />
                    {/* Overlay Label for Desktop */}
                    {desktopMode && (
                        <div className="absolute bottom-6 left-6 text-white drop-shadow-lg z-10">
                            <h2 className="text-sm font-semibold tracking-wide uppercase opacity-80">From</h2>
                            <p className="text-3xl font-bold">{dedication.name}</p>
                        </div>
                    )}
                    {/* Play overlay */}
                    {!isPlaying && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/30 cursor-pointer" onClick={onTogglePlay}>
                            <span className="material-symbols-outlined text-6xl text-white">play_circle</span>
                        </div>
                    )}
                </div>
            ) : (
                // Voice / Photo Mode
                <div className="relative w-full h-full flex items-center justify-center">
                    {/* Avatar */}
                    <div className={`relative ${desktopMode ? 'w-64 h-64' : 'w-[75%] aspect-square'} rounded-full overflow-hidden border-2 border-[#e7d0d4]/50 shadow-[0_0_30px_rgba(183,110,121,0.4)] ${isPlaying && isGreeting ? 'animate-soft-pulse' : ''}`}>
                        <img
                            src={dedication.photo || 'assets/placeholder.png'}
                            alt={dedication.name}
                            className={`w-full h-full object-cover ${!isPlaying ? 'blur-sm grayscale' : ''} transition-all duration-700`}
                        />
                        {/* Audio Element Hidden */}
                        <audio ref={audioRef} src={dedication.voice_message} onEnded={onEnded} />
                    </div>

                    {desktopMode && (
                        <div className="absolute bottom-6 left-6 text-white drop-shadow-lg z-10 mix-blend-difference">
                            <h2 className="text-sm font-semibold tracking-wide uppercase opacity-80">From</h2>
                            <p className="text-3xl font-bold">{dedication.name}</p>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* Waveform (Mobile Only or Overlay) */}
        {!desktopMode && !dedication.video_message && (
            <div className="flex flex-col items-center gap-4 mb-auto">
                <div className="flex items-center justify-center gap-[3px] h-12">
                    {[...Array(12)].map((_, i) => (
                        <div key={i} className={`w-1.5 rounded-full bg-gradient-to-t from-[#974e5a] to-[#e7d0d4] ${isPlaying && isGreeting ? 'animate-pulse' : 'opacity-40'}`} style={{ height: Math.random() * 20 + 20 + 'px', animationDelay: i * 0.1 + 's' }}></div>
                    ))}
                </div>
                <p className="text-[11px] font-bold tracking-widest text-[#B76E79]/60 uppercase">
                    {formatTime(progress)} / {formatTime(duration)}
                </p>
            </div>
        )}
    </div>
);

const VinylPanel = ({
    dedication,
    songRef,
    isPlaying,
    isGreeting, // If true, song is NOT playing (so vinyl should pause/reset visually?)
    onEnded,
    desktopMode = false
}) => (
    <div className={`relative w-full h-full flex flex-col items-center justify-center ${desktopMode ? '' : 'px-6'}`}>
        {!desktopMode && (
            <div className="text-center mb-6 mt-8">
                <h1 className="font-display text-2xl md:text-3xl leading-tight mb-1 text-slate-900 dark:text-white">
                    For My Lovely Wife –<br />
                    <span className="metallic-text italic font-semibold text-[#974e5a]">40th Birthday</span>
                </h1>
            </div>
        )}

        {/* Vinyl Visual */}
        <div className={`relative ${desktopMode ? 'w-80 h-80' : 'w-[85%] aspect-square'} flex items-center justify-center mb-8`}>
            {/* Disc */}
            <div className={`absolute inset-0 rounded-full bg-[#111] shadow-2xl flex items-center justify-center border-4 border-black/10 ring-1 ring-white/10 ${isPlaying && !isGreeting ? 'animate-spin-slow' : ''}`}>
                <div className="absolute inset-0 rounded-full opacity-40 bg-[radial-gradient(circle,transparent_30%,rgba(255,255,255,0.1)_31%,transparent_32%)]"></div>
                <div className="absolute inset-[20%] rounded-full opacity-20 bg-[radial-gradient(circle,transparent_30%,rgba(255,255,255,0.1)_31%,transparent_32%)]"></div>
                {/* Album Art center */}
                <div className="relative w-[35%] aspect-square rounded-full overflow-hidden border-2 border-white/10">
                    <img
                        src={dedication.song.album_art || dedication.photo || 'assets/placeholder.png'}
                        alt="Album Art"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>

            {/* Tone Arm */}
            <div className={`absolute top-0 right-0 w-1/2 h-full pointer-events-none transition-transform duration-500 origin-top-right ${isPlaying && !isGreeting ? 'rotate-[25deg]' : 'rotate-0'}`}>
                <div className="absolute top-4 right-6 w-3 h-32 bg-gray-300 rounded-full shadow-lg border border-white/20"></div>
                <div className="absolute top-[8rem] right-[2rem] w-8 h-12 bg-gray-700 rounded-md transform rotate-12"></div>
            </div>

            <audio ref={songRef} src={dedication.song.local_file} onEnded={onEnded} />
        </div>

        {/* Track Info */}
        <div className={`text-center space-y-4 ${desktopMode ? 'absolute bottom-6 right-6 text-right' : 'mb-auto'}`}>
            <div className="space-y-1">
                <p className={`text-xs font-bold tracking-widest uppercase ${desktopMode ? 'text-[#974e5a]' : 'text-[#B76E79]'}`}>Now Playing</p>
                <h2 className="font-display text-2xl font-semibold text-slate-900 dark:text-white">{dedication.song.title}</h2>
                <p className="text-[#974e5a]/70 italic">{dedication.song.artist}</p>
            </div>
        </div>
    </div>
);

const Controls = ({
    desktopMode = false,
    onPrevious,
    onNext,
    onTogglePlay,
    isPlaying,
    progress,
    duration,
    isGreeting,
    mediaRef // Active media ref for seeking
}) => (
    <div className={`${desktopMode ? 'glass-panel px-8 py-4 rounded-full flex items-center gap-10 shadow-xl border-white/40' : 'flex flex-col items-center gap-6 mt-8'}`}>
        {/* Progress (Desktop) */}
        {desktopMode && (
            <div className="hidden"></div>
        )}

        {/* Mobile Progress Bar */}
        {!desktopMode && (
            <div className="w-full px-6 mb-4">
                <div className="relative w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full cursor-pointer" onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const p = (e.clientX - rect.left) / rect.width;
                    if (mediaRef?.current && duration) {
                        mediaRef.current.currentTime = p * duration;
                    }
                }}>
                    <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-[#e7d0d4] to-[#974e5a] rounded-full" style={{ width: `${(progress / (duration || 1)) * 100}%` }}></div>
                </div>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                </div>
            </div>
        )}

        <div className={`flex items-center ${desktopMode ? 'gap-10' : 'gap-6 justify-between w-full px-12'}`}>
            {/* Previous */}
            <button onClick={onPrevious} className="text-[#974e5a] dark:text-[#e7d0d4] hover:text-[#B76E79] transition-colors">
                <span className="material-symbols-outlined !text-3xl">skip_previous</span>
            </button>

            {/* Play/Pause */}
            <button
                onClick={onTogglePlay}
                className={`flex items-center justify-center text-white shadow-lg shadow-[#B76E79]/30 hover:scale-105 transition-transform ${desktopMode ? 'w-16 h-16 bg-[#e8304f] rounded-full' : 'w-20 h-20 bg-[#e8304f] rounded-full'}`}
            >
                <span className="material-symbols-outlined !text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {isPlaying ? 'pause' : 'play_arrow'}
                </span>
            </button>

            {/* Next */}
            <button onClick={onNext} className="text-[#974e5a] dark:text-[#e7d0d4] hover:text-[#B76E79] transition-colors">
                <span className="material-symbols-outlined !text-3xl">skip_next</span>
            </button>
        </div>

        {!desktopMode && (
            <div className="flex justify-between w-full px-2 opacity-50 mt-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Previous</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{isGreeting ? 'Next: Song' : 'Next: Dedication'}</span>
            </div>
        )}
    </div>
);

// Helper
const formatTime = (time) => {
    if (!time || isNaN(time)) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? '0' + sec : sec}`;
};


const ImmersivePlayer = ({
    dedication,
    onClose,
    onNext,
    onPrevious,
}) => {
    const [mode, setMode] = useState('greeting'); // 'greeting' | 'song'
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    // Media Refs
    const videoRef = useRef(null);
    const audioRef = useRef(null);
    const songRef = useRef(null);

    // Determines initial mode based on content availability
    useEffect(() => {
        const hasGreeting = dedication.video_message || dedication.voice_message;
        const newMode = hasGreeting ? 'greeting' : 'song';
        setMode(newMode);
        setIsPlaying(true);
        setProgress(0);
        console.log("New dedication loaded:", dedication.name, "Mode:", newMode);
    }, [dedication]);

    // Lock Body Scroll
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
    }, []);

    // Handle Media Playback Sync
    useEffect(() => {
        console.log("Player Effect: mode=", mode, "isPlaying=", isPlaying);

        // Find Active Ref
        let activeRef = null;
        if (mode === 'greeting') {
            if (dedication.video_message) activeRef = videoRef.current;
            else if (dedication.voice_message) activeRef = audioRef.current;
        } else {
            if (dedication.song.local_file) activeRef = songRef.current;
        }

        // Pause others
        [videoRef, audioRef, songRef].forEach(ref => {
            if (ref.current && ref.current !== activeRef) {
                ref.current.pause();
            }
        });

        if (isPlaying && activeRef) {
            console.log("Attempting to play ref src:", activeRef.src);
            activeRef.play().catch(e => console.error("Play error:", e));
        } else if (!isPlaying && activeRef) {
            activeRef.pause();
        }
    }, [mode, isPlaying, dedication]);

    // Progress Loop
    useEffect(() => {
        const interval = setInterval(() => {
            let activeRef = null;
            if (mode === 'greeting') {
                if (dedication.video_message) activeRef = videoRef.current;
                else if (dedication.voice_message) activeRef = audioRef.current;
            } else {
                if (dedication.song.local_file) activeRef = songRef.current;
            }

            if (activeRef) {
                setProgress(activeRef.currentTime || 0);
                setDuration(activeRef.duration || 0);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [mode, dedication]);

    const handleGreetingEnded = () => {
        console.log("Greeting ended, checking for song...");
        if (dedication.song.local_file) {
            setMode('song');
            setIsPlaying(true);
        } else {
            onNext();
        }
    };

    const handleSongEnded = () => {
        onNext();
    };

    const togglePlay = () => setIsPlaying(!isPlaying);

    const isGreeting = mode === 'greeting';

    // Determine active ref for controls
    let currentMediaRef = songRef;
    if (isGreeting) {
        currentMediaRef = dedication.video_message ? videoRef : audioRef;
    }

    return (
        <div className="fixed inset-0 z-[2000] bg-[#FFF9F6] dark:bg-[#1A1616] overflow-hidden font-display">
            {/* Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F6] via-[#FDF2F0] to-[#B76E79]/20 dark:from-[#1A1616] dark:to-[#2D1F1F]"></div>

            <button className="absolute top-6 right-6 z-50 p-2 rounded-full bg-black/5 hover:bg-black/10 transition-colors" onClick={onClose}>
                <span className="material-symbols-outlined text-[#974e5a]">close</span>
            </button>

            {/* Mobile View */}
            <div className="md:hidden relative z-10 flex flex-col h-full py-6">
                {isGreeting ? (
                    <GreetingPanel
                        dedication={dedication}
                        videoRef={videoRef}
                        audioRef={audioRef}
                        isPlaying={isPlaying}
                        isGreeting={true}
                        onEnded={handleGreetingEnded}
                        onTogglePlay={togglePlay}
                        progress={progress}
                        duration={duration}
                    />
                ) : (
                    <VinylPanel
                        dedication={dedication}
                        songRef={songRef}
                        isPlaying={isPlaying}
                        isGreeting={false}
                        onEnded={handleSongEnded}
                    />
                )}
                <Controls
                    onPrevious={onPrevious}
                    onNext={() => {
                        if (isGreeting) handleGreetingEnded();
                        else onNext();
                    }}
                    onTogglePlay={togglePlay}
                    isPlaying={isPlaying}
                    progress={progress}
                    duration={duration}
                    isGreeting={isGreeting}
                    mediaRef={currentMediaRef}
                />
            </div>

            {/* Desktop View */}
            <div className="hidden md:flex relative z-10 flex-col h-full w-full p-8 gap-8">
                <div className="flex items-center justify-between px-2">
                    <p className="text-[#974e5a] text-xs font-semibold uppercase tracking-widest">Birthday Dedications</p>
                </div>

                <div className="flex-1 flex flex-row gap-8 overflow-hidden rounded-3xl bg-white/30 backdrop-blur-xl border border-white/20 shadow-2xl p-6">
                    <div className="flex-1 relative rounded-2xl overflow-hidden bg-black/5">
                        <GreetingPanel
                            desktopMode={true}
                            dedication={dedication}
                            videoRef={videoRef}
                            audioRef={audioRef}
                            isPlaying={isPlaying}
                            isGreeting={isGreeting}
                            onEnded={handleGreetingEnded}
                            onTogglePlay={togglePlay}
                        />
                    </div>
                    <div className="flex-1 relative rounded-2xl bg-white/40 border border-white/20 overflow-hidden">
                        <VinylPanel
                            desktopMode={true}
                            dedication={dedication}
                            songRef={songRef}
                            isPlaying={isPlaying}
                            isGreeting={isGreeting}
                            onEnded={handleSongEnded}
                        />
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <Controls
                        desktopMode={true}
                        onPrevious={onPrevious}
                        onNext={onNext}
                        onTogglePlay={togglePlay}
                        isPlaying={isPlaying}
                    />
                </div>
            </div>
        </div>
    );
};

export default ImmersivePlayer;
