# Dedicate a Song - Birthday Celebration Site 🎂

A responsive, interactive Progressive Web App (PWA) built with **React** and **Vite** for creating personalized birthday greetings with video messages and song dedications.

## Features ✨

*   **Video & Voice Greetings**: Prioritizes video messages, falling back to voice clips.
*   **Media Autoplay Sequencer**: Automatically plays greetings followed by the dedicated song, then advances to the next card.
*   **Smart Sticky Header**: Collapses smoothly on scroll for maximum screen real estate on mobile.
*   **Confetti Celebration**: Interactive confetti burst on the welcome screen.
*   **Responsive Design**: Mobile-first glassmorphism UI that scales up to a grid on desktop.
*   **Persistent State**: Remembers if a visitor has already seen the intro to skip it on return visits.

## Tech Stack 🛠️

*   **Core**: React 18, Vite
*   **Styling**: Vanilla CSS (Variables, Glassmorphism, Flexbox/Grid)
*   **Effects**: `canvas-confetti`
*   **Deployment**: GitHub Pages

## Project Structure 📂

```
dedicate-a-song/
├── public/                 # Static assets served at root
│   ├── assets/             # Media files (images, recordings, videos)
│   ├── data/               # dedications.json
│   └── songs/              # Local MP3 files
├── src/
│   ├── components/         # React components
│   │   ├── DedicationCard.jsx
│   │   ├── DedicationsScreen.jsx
│   │   ├── Header.jsx
│   │   └── WelcomeScreen.jsx
│   ├── App.jsx             # Main controller
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
└── index.html              # App entry HTML
```

## Getting Started 🚀

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Start local development server**:
    ```bash
    npm run dev
    ```
    The app will basically run at `http://localhost:5173`.

3.  **Build for production**:
    ```bash
    npm run build
    ```

## Customization 🎨

### Adding Dedications
Edit `public/data/dedications.json`:
```json
{
  "id": 1,
  "name": "Friend Name",
  "photo": "assets/images/friend.jpg",
  "video_message": "assets/videos/friend.mp4", // Optional (priority)
  "voice_message": "assets/recordings/friend.mp3", // Optional (fallback)
  "song": {
    "title": "Song Title",
    "artist": "Artist Name",
    "spotify_url": "https://...",
    "local_file": "songs/song.mp3"
  }
}
```

### Changing Colors
Edit `src/index.css` and modify the `:root` variables:
```css
:root {
    --color-primary: #e85d75;
    --color-accent: #f9a825;
}
```

## Deployment 🌍

To deploy to GitHub Pages:

1.  Update `vite.config.js` to set the base path (if not at domain root):
    ```js
    export default defineConfig({
      base: '/dedicate-a-song/',
      plugins: [react()],
    })
    ```
2.  Run the build:
    ```bash
    npm run build
    ```
3.  Deploy the `dist` folder.
