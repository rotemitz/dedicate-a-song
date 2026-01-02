/**
 * Birthday Dedications App
 * Main application logic
 */

class BirthdayApp {
    constructor() {
        this.confetti = new ConfettiAnimation('confetti-canvas');
        this.welcomeScreen = document.getElementById('welcome-screen');
        this.dedicationsScreen = document.getElementById('dedications-screen');
        this.startButton = document.getElementById('start-button');
        this.dedicationsContainer = document.getElementById('dedications-container');
        this.autoplayToggle = document.getElementById('autoplay-toggle');

        // Autoplay state - enabled by default
        this.autoplayEnabled = true;
        this.currentCardIndex = 0;
        this.dedications = [];
        this.isPlaying = false;

        this.init();
    }

    init() {
        // Attach event listeners
        this.startButton.addEventListener('click', () => this.handleStart());

        // Autoplay toggle - sync initial state
        if (this.autoplayToggle) {
            this.autoplayToggle.checked = this.autoplayEnabled;
            this.autoplayToggle.addEventListener('change', (e) => {
                this.autoplayEnabled = e.target.checked;
                // Don't auto-start, just update the state
                // If turning off while playing, stop the auto-advance
                if (!this.autoplayEnabled) {
                    this.isPlaying = false;
                    document.querySelectorAll('.dedication-card').forEach(c => c.classList.remove('now-playing'));
                }
            });
        }

        // Preload dedications data
        this.loadDedications();
    }

    handleStart() {
        // Get button position for confetti origin
        const rect = this.startButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Trigger confetti!
        this.confetti.burst(x, y);

        // Disable button to prevent multiple clicks
        this.startButton.disabled = true;
        this.startButton.style.opacity = '0.7';

        // Transition to dedications screen after confetti starts
        setTimeout(() => {
            this.showDedications();
        }, 1500);
    }

    showDedications() {
        // Fade out welcome screen
        this.welcomeScreen.style.opacity = '0';

        setTimeout(() => {
            this.welcomeScreen.classList.remove('active');
            this.dedicationsScreen.classList.add('active');

            // Trigger fade in
            setTimeout(() => {
                this.dedicationsScreen.style.opacity = '1';
            }, 50);
        }, 500);
    }

    async loadDedications() {
        try {
            const response = await fetch('data/dedications.json');
            const data = await response.json();
            this.dedications = data.dedications;
            this.renderDedications(this.dedications);
        } catch (error) {
            console.error('Error loading dedications:', error);
            this.dedications = this.getSampleDedications();
            this.renderDedications(this.dedications);
        }
    }

    renderDedications(dedications) {
        this.dedicationsContainer.innerHTML = dedications.map((d, index) => this.createCard(d, index)).join('');
        this.attachMediaEventListeners();
    }

    createCard(dedication, index) {
        const avatarHtml = dedication.photo
            ? `<img src="${dedication.photo}" alt="${dedication.name}" class="card-avatar">`
            : `<div class="card-avatar-placeholder">${this.getInitials(dedication.name)}</div>`;

        // Determine if greeting is video or audio
        const greetingHtml = this.createGreetingHtml(dedication, index);

        const songLinksHtml = this.createSongLinks(dedication.song, index);

        return `
            <article class="dedication-card" data-card-index="${index}">
                <header class="card-header">
                    ${avatarHtml}
                    <h2 class="card-name">${dedication.name}</h2>
                </header>
                
                ${greetingHtml}
                
                ${dedication.song ? `
                    <div class="song-section">
                        <div class="section-label">
                            <span>🎵</span> Song Dedication
                        </div>
                        <div class="song-info">
                            <span class="song-icon">🎶</span>
                            <div class="song-details">
                                <div class="song-title">${dedication.song.title}</div>
                                <div class="song-artist">${dedication.song.artist}</div>
                            </div>
                        </div>
                        ${songLinksHtml}
                    </div>
                ` : ''}
            </article>
        `;
    }

    createGreetingHtml(dedication, index) {
        // Video greeting takes priority
        if (dedication.video_message) {
            return `
                <div class="greeting-section video-greeting">
                    <div class="section-label">
                        <span>🎬</span> Video Message
                    </div>
                    <video controls class="video-player greeting-media" data-card-index="${index}" preload="metadata" playsinline>
                        <source src="${dedication.video_message}" type="video/mp4">
                        Your browser does not support video playback.
                    </video>
                </div>
            `;
        }

        // Fall back to voice message
        if (dedication.voice_message) {
            return `
                <div class="greeting-section voice-greeting">
                    <div class="section-label">
                        <span>🎙️</span> Voice Message
                    </div>
                    <audio controls class="audio-player greeting-media" data-card-index="${index}" preload="metadata">
                        <source src="${dedication.voice_message}" type="audio/mpeg">
                        Your browser does not support audio playback.
                    </audio>
                </div>
            `;
        }

        return '';
    }

    createSongLinks(song, index) {
        if (!song) return '';

        const links = [];

        if (song.spotify_url) {
            links.push(`
                <a href="${song.spotify_url}" target="_blank" rel="noopener noreferrer" class="song-link spotify">
                    <span>▶️</span> Play on Spotify
                </a>
            `);
        }

        if (song.local_file) {
            links.push(`
                <audio controls class="local-song-player song-media" data-card-index="${index}" preload="metadata">
                    <source src="${song.local_file}" type="audio/mpeg">
                    Your browser does not support audio playback.
                </audio>
            `);
        }

        return links.length > 0 ? `<div class="song-links">${links.join('')}</div>` : '';
    }

    attachMediaEventListeners() {
        // Listen for greeting media ended events
        document.querySelectorAll('.greeting-media').forEach(media => {
            media.addEventListener('ended', (e) => {
                const cardIndex = parseInt(e.target.dataset.cardIndex);
                if (this.autoplayEnabled && this.isPlaying) {
                    this.onGreetingEnded(cardIndex);
                }
                // Reset the media to beginning with a nice transition
                this.resetMediaElement(e.target);
            });
        });

        // Listen for song media ended events
        document.querySelectorAll('.song-media').forEach(media => {
            media.addEventListener('ended', (e) => {
                const cardIndex = parseInt(e.target.dataset.cardIndex);
                if (this.autoplayEnabled && this.isPlaying) {
                    this.onSongEnded(cardIndex);
                }
                // Reset the media to beginning with a nice transition
                this.resetMediaElement(e.target);
            });
        });

        // Card click listener - clicking on the card (not on media controls) starts the full sequence
        document.querySelectorAll('.dedication-card').forEach(card => {
            card.addEventListener('click', (e) => {
                // Only trigger if not clicking on audio/video controls directly
                if (e.target.tagName === 'AUDIO' || e.target.tagName === 'VIDEO' ||
                    e.target.closest('audio') || e.target.closest('video') ||
                    e.target.tagName === 'A') {
                    return;
                }

                const cardIndex = parseInt(card.dataset.cardIndex);
                if (this.autoplayEnabled) {
                    this.playCard(cardIndex);
                }
            });
        });

        // Stop event propagation on media elements to prevent card click when using controls
        document.querySelectorAll('audio, video').forEach(media => {
            media.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        });

        // Pause other media when one starts playing
        document.querySelectorAll('audio, video').forEach(media => {
            media.addEventListener('play', (e) => {
                this.pauseAllMediaExcept(e.target);

                // If we're in autoplay mode (isPlaying), update the highlight
                // This happens when card was clicked or when auto-advancing
                if (this.autoplayEnabled && this.isPlaying && e.target.dataset.cardIndex !== undefined) {
                    const cardIndex = parseInt(e.target.dataset.cardIndex);
                    this.currentCardIndex = cardIndex;

                    // Update card highlighting
                    document.querySelectorAll('.dedication-card').forEach(c => c.classList.remove('now-playing'));
                    const card = document.querySelector(`[data-card-index="${cardIndex}"]`);
                    if (card) {
                        card.classList.add('now-playing');
                    }
                }
                // If user clicks a specific play button directly (not in autoplay mode),
                // just play that media without enabling autoplay sequence
            });
        });
    }

    pauseAllMediaExcept(exceptElement) {
        document.querySelectorAll('audio, video').forEach(media => {
            if (media !== exceptElement && !media.paused) {
                media.pause();
            }
        });
    }

    resetMediaElement(mediaElement) {
        // Add a smooth transition effect
        const originalOpacity = mediaElement.style.opacity || '1';

        // Fade out
        mediaElement.style.transition = 'opacity 0.3s ease';
        mediaElement.style.opacity = '0.5';

        // Reset to beginning after a short delay
        setTimeout(() => {
            mediaElement.currentTime = 0;
            mediaElement.load(); // Reload to ensure clean state

            // Fade back in
            setTimeout(() => {
                mediaElement.style.opacity = originalOpacity;
            }, 100);
        }, 200);
    }

    startAutoplay() {
        if (this.dedications.length === 0) return;

        this.isPlaying = true;
        this.currentCardIndex = 0;
        this.playCard(this.currentCardIndex);
    }

    playCard(index) {
        if (index >= this.dedications.length) {
            // All cards played
            this.isPlaying = false;
            this.showAutoplayComplete();
            return;
        }

        this.currentCardIndex = index;
        const card = document.querySelector(`[data-card-index="${index}"]`);

        if (card) {
            // Scroll card into view
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Highlight current card
            document.querySelectorAll('.dedication-card').forEach(c => c.classList.remove('now-playing'));
            card.classList.add('now-playing');

            // Play greeting media first
            const greetingMedia = card.querySelector('.greeting-media');
            if (greetingMedia) {
                setTimeout(() => {
                    this.pauseAllMediaExcept(greetingMedia);
                    greetingMedia.play().catch(err => {
                        console.log('Autoplay blocked, moving to next:', err);
                        this.onGreetingEnded(index);
                    });
                }, 500);
            } else {
                // No greeting, try song
                this.onGreetingEnded(index);
            }
        }
    }

    onGreetingEnded(cardIndex) {
        const card = document.querySelector(`[data-card-index="${cardIndex}"]`);
        if (!card) return;

        // Try to play the song
        const songMedia = card.querySelector('.song-media');
        if (songMedia) {
            setTimeout(() => {
                this.pauseAllMediaExcept(songMedia);
                songMedia.play().catch(err => {
                    console.log('Song autoplay blocked:', err);
                    this.onSongEnded(cardIndex);
                });
            }, 300);
        } else {
            // No local song, move to next card
            this.moveToNextCard(cardIndex);
        }
    }

    onSongEnded(cardIndex) {
        this.moveToNextCard(cardIndex);
    }

    moveToNextCard(currentIndex) {
        const nextIndex = currentIndex + 1;

        // Remove highlight from current card
        const currentCard = document.querySelector(`[data-card-index="${currentIndex}"]`);
        if (currentCard) {
            currentCard.classList.remove('now-playing');
        }

        if (nextIndex < this.dedications.length && this.autoplayEnabled) {
            setTimeout(() => {
                this.playCard(nextIndex);
            }, 1000); // 1 second pause between cards
        } else {
            this.isPlaying = false;
            if (this.autoplayEnabled) {
                this.showAutoplayComplete();
            }
        }
    }

    showAutoplayComplete() {
        // Optional: Show a message or reset
        console.log('Autoplay complete!');
    }

    getInitials(name) {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    }

    // Sample dedications for testing when JSON is not loaded
    getSampleDedications() {
        return [
            {
                id: 1,
                name: "Mom & Dad",
                photo: null,
                voice_message: null,
                song: {
                    title: "You Are the Sunshine of My Life",
                    artist: "Stevie Wonder",
                    spotify_url: "https://open.spotify.com/track/2jXETnkWV6aX1Qp2V4gTfg",
                    local_file: null
                }
            },
            {
                id: 2,
                name: "Sarah",
                photo: null,
                voice_message: null,
                song: {
                    title: "Dancing Queen",
                    artist: "ABBA",
                    spotify_url: "https://open.spotify.com/track/0GjEhVFGZW8afUYGChu3Rr",
                    local_file: null
                }
            },
            {
                id: 3,
                name: "David",
                photo: null,
                voice_message: null,
                song: {
                    title: "Happy Birthday",
                    artist: "Stevie Wonder",
                    spotify_url: "https://open.spotify.com/track/4xrIdPlDtvlJCR21p77Qj9",
                    local_file: null
                }
            }
        ];
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new BirthdayApp();
});
