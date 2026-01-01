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

        this.init();
    }

    init() {
        // Attach event listeners
        this.startButton.addEventListener('click', () => this.handleStart());

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
            this.renderDedications(data.dedications);
        } catch (error) {
            console.error('Error loading dedications:', error);
            this.renderDedications(this.getSampleDedications());
        }
    }

    renderDedications(dedications) {
        this.dedicationsContainer.innerHTML = dedications.map(d => this.createCard(d)).join('');
    }

    createCard(dedication) {
        const avatarHtml = dedication.photo
            ? `<img src="${dedication.photo}" alt="${dedication.name}" class="card-avatar">`
            : `<div class="card-avatar-placeholder">${this.getInitials(dedication.name)}</div>`;

        const voiceMessageHtml = dedication.voice_message
            ? `
                <div class="voice-message-section">
                    <div class="section-label">
                        <span>🎙️</span> Voice Message
                    </div>
                    <audio controls class="audio-player" preload="metadata">
                        <source src="${dedication.voice_message}" type="audio/mpeg">
                        Your browser does not support audio playback.
                    </audio>
                </div>
            ` : '';

        const songLinksHtml = this.createSongLinks(dedication.song);

        return `
            <article class="dedication-card">
                <header class="card-header">
                    ${avatarHtml}
                    <h2 class="card-name">${dedication.name}</h2>
                </header>
                
                ${voiceMessageHtml}
                
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

    createSongLinks(song) {
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
                <audio controls class="local-song-player" preload="metadata">
                    <source src="${song.local_file}" type="audio/mpeg">
                    Your browser does not support audio playback.
                </audio>
            `);
        }

        return links.length > 0 ? `<div class="song-links">${links.join('')}</div>` : '';
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
