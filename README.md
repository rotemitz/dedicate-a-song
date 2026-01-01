# 🎂 Tal's 40th Birthday Dedication Website

A special birthday gift website where friends and family share voice messages and song dedications.

## Quick Start

1. **Add Your Content:**
   - Place voice recordings (MP3/WAV) in `assets/recordings/`
   - Place photos (optional) in `assets/images/`
   - Place local song MP3s (optional) in `songs/`
   - Edit `data/dedications.json` with the actual dedications

2. **Test Locally:**
   ```bash
   # Using Python (macOS has this built-in)
   python3 -m http.server 8000
   # Then open: http://localhost:8000
   ```

3. **Deploy to GitHub Pages:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   gh repo create dedicate-a-song --public --push
   # Then enable GitHub Pages in Settings > Pages > Source: main branch
   ```

## Adding Dedications

Edit `data/dedications.json`:

```json
{
    "id": 1,
    "name": "Person's Name",
    "photo": "assets/images/person.jpg",      // or null
    "voice_message": "assets/recordings/person.mp3",
    "song": {
        "title": "Song Title",
        "artist": "Artist Name",
        "spotify_url": "https://open.spotify.com/track/...",  // or null
        "local_file": "songs/song.mp3"                        // or null
    }
}
```

## Customizing Colors

Open `css/styles.css` and edit the CSS variables at the top:

```css
:root {
    --color-primary: #e85d75;      /* Main accent color */
    --color-accent: #f9a825;       /* Secondary color */
    --gradient-welcome: linear-gradient(...);  /* Background */
}
```

## Project Structure

```
├── index.html              # Main page
├── css/styles.css          # Styling (colors at top)
├── js/
│   ├── app.js              # Main logic
│   └── confetti.js         # Celebration animation
├── data/dedications.json   # Your dedication data
├── assets/
│   ├── images/             # Photos (optional)
│   └── recordings/         # Voice messages
└── songs/                  # Local MP3s (optional)
```

Made with ❤️
