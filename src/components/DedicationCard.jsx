import React, { useRef, useEffect } from 'react';

const DedicationCard = ({
    dedication,
    index,
    isNowPlaying,
    activeMediaType, // 'greeting' | 'song' | null
    onPlay,
    onMediaEnded
}) => {
    const greetingRef = useRef(null);
    const audioRef = useRef(null);

    // React to changes in activeMediaType (orchestrated by parent)
    useEffect(() => {
        if (!isNowPlaying) {
            // Pause everything if we lost focus
            if (greetingRef.current) {
                greetingRef.current.pause();
                greetingRef.current.currentTime = 0;
            }
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
            return;
        }

        // If we ARE now playing, check what part should play
        if (activeMediaType === 'greeting') {
            if (greetingRef.current) greetingRef.current.play().catch(e => console.log('Autoplay prevented:', e));
            // Stop song
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = 0;
            }
        } else if (activeMediaType === 'song') {
            if (audioRef.current) audioRef.current.play().catch(e => console.log('Autoplay prevented:', e));
            // Stop greeting
            if (greetingRef.current) {
                greetingRef.current.pause();
                greetingRef.current.currentTime = 0;
            }
        }

    }, [isNowPlaying, activeMediaType]);

    const handleCardClick = (e) => {
        // Ignore clicks on controls
        if (['AUDIO', 'VIDEO', 'A', 'BUTTON', 'INPUT'].includes(e.target.tagName)) return;

        // Tell parent to focus this card and start sequence (no specific media passed = start from top)
        onPlay(index);
    };

    return (
        <div
            className={`dedication-card ${isNowPlaying ? 'now-playing' : ''}`}
            onClick={handleCardClick}
            // Stagger animation based on index
            style={{ animationDelay: `${0.1 * (index + 1)}s` }}
        >
            <div className="card-header">
                {dedication.photo ? (
                    <img src={dedication.photo} alt={dedication.name} className="card-avatar" loading="lazy" />
                ) : (
                    <div className="card-avatar-placeholder">
                        {dedication.name.charAt(0)}
                    </div>
                )}
                <h3 className="card-name">{dedication.name}</h3>
            </div>

            {/* Greeting Section */}
            {(dedication.voice_message || dedication.video_message) && (
                <div className="greeting-section">
                    <div className="section-label">
                        <span>{dedication.video_message ? '🎬 Video Message' : '🎤 Voice Message'}</span>
                    </div>
                    {dedication.video_message ? (
                        <video
                            ref={greetingRef}
                            src={dedication.video_message}
                            className="video-player"
                            controls
                            controlsList="nodownload"
                            playsInline
                            // Stop propagation so card click doesn't refire logic
                            onClick={(e) => e.stopPropagation()}
                            onPlay={(e) => { e.stopPropagation(); onPlay(index, 'greeting'); }}
                            onEnded={() => onMediaEnded('greeting')}
                        />
                    ) : (
                        <audio
                            ref={greetingRef}
                            src={dedication.voice_message}
                            className="audio-player"
                            controls
                            controlsList="nodownload"
                            onClick={(e) => e.stopPropagation()}
                            onPlay={(e) => { e.stopPropagation(); onPlay(index, 'greeting'); }}
                            onEnded={() => onMediaEnded('greeting')}
                        />
                    )}
                </div>
            )}

            {/* Song Section */}
            <div className="song-section">
                <div className="section-label">
                    <span>🎵 Song Dedication</span>
                </div>
                <div className="song-info">
                    <div className="song-details">
                        <div className="song-title">{dedication.song.title}</div>
                        <div className="song-artist">{dedication.song.artist}</div>
                    </div>
                </div>

                {dedication.song.local_file && (
                    <audio
                        ref={audioRef}
                        src={dedication.song.local_file}
                        className="local-song-player"
                        controls
                        controlsList="nodownload"
                        onClick={(e) => e.stopPropagation()}
                        onPlay={(e) => { e.stopPropagation(); onPlay(index, 'song'); }}
                        onEnded={() => onMediaEnded('song')}
                    />
                )}

                <div className="song-links">
                    {dedication.song.spotify_url && (
                        <a
                            href={dedication.song.spotify_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="song-link spotify"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <span>Play on Spotify</span>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DedicationCard;
