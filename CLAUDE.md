# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A responsive Progressive Web App (PWA) for personalized birthday celebrations with video/voice greetings and song dedications. Built with React 19, Vite, Tailwind CSS v4, and Framer Motion. Features an "antigravity" design system with rose gold and cream theme.

## Development Commands

### Core Commands
```bash
npm install           # Install dependencies
npm run dev          # Start dev server at http://localhost:5173
npm run build        # Build for production (outputs to dist/)
npm run preview      # Preview production build locally
npm run lint         # Run ESLint
```

### No Test Suite
This project does not have a test suite configured. Do not attempt to run tests.

## Architecture

### Component Hierarchy

```
App.jsx (Main Controller)
├── WelcomeScreen (First-time visitors only)
│   └── Confetti effect on entry
└── DedicationsScreen (Main view)
    ├── Header (Sticky, collapses on scroll)
    ├── DedicationCard (Responsive wrapper)
    │   ├── MobileDedicationCard (< 768px)
    │   └── DesktopDedicationCard (≥ 768px)
    ├── NowPlayingBar (Mobile-only floating player)
    └── ImmersivePlayer (Full-screen media player)
        ├── MobileImmersivePlayer (< 768px)
        └── DesktopImmersivePlayer (≥ 768px)
```

### Key Architectural Patterns

1. **Responsive Component Strategy**: Components use separate implementations for mobile/desktop rather than conditional rendering. The `ImmersivePlayer` and `DedicationCard` components wrap responsive variants and switch based on viewport width (`< 768px` = mobile).

2. **Media Playback Sequencer**: The `ImmersivePlayer` handles a three-phase auto-play sequence:
   - Phase 1: Video message (if available) → Phase 2
   - Phase 2: Voice message (if available) → Phase 3
   - Phase 3: Dedicated song (always present) → Next dedication

3. **State Persistence**: Uses `localStorage` to track if visitor has seen the `WelcomeScreen` (`birthday_app_visited` key). Return visitors skip directly to dedications.

4. **Data Flow**:
   - `App.jsx` fetches `public/data/dedications.json` on mount
   - Dedications are sorted by `id` field
   - Data is passed down via props (no global state management)

### Component Organization

- `src/components/` - Top-level screens and wrappers
- `src/components/cards/` - Dedication card variants (Mobile/Desktop)
- `src/components/player/` - Immersive player variants and shared components
  - `PlayerComponents.jsx` - Reusable UI elements (SegmentProgressBar, WaveformVisualizer, AlbumArt, etc.)
  - Index files use named exports for clean imports

### Media Assets Structure

All media files live in `public/` and are referenced in `dedications.json`:

```json
{
  "id": 1,
  "name": "Friend Name",
  "photo": "assets/images/friend.jpg",         // Optional: Card photo
  "video_message": "assets/videos/friend.mp4", // Optional: Priority greeting
  "voice_message": "assets/recordings/friend.mp3", // Optional: Fallback greeting
  "song": {
    "title": "Song Title",
    "artist": "Artist Name",
    "spotify_url": "https://open.spotify.com/...", // External link
    "local_file": "songs/song.mp3",            // Required: Local audio
    "album_art": "songs/album.png"             // Optional: Album artwork
  }
}
```

## Styling System

### Tailwind CSS v4 Configuration

The project uses **Tailwind CSS v4** with custom theme tokens defined in `src/index.css` using the `@theme` directive. Do NOT edit `tailwind.config.js` for theme changes - it's legacy configuration kept for compatibility.

**Primary theme tokens** (edit in `src/index.css`):
- Colors: `--color-rose-gold-{50-700}`, `--color-celebration-cream`, `--color-celebration-charcoal`
- Shadows: `--shadow-floating`, `--shadow-premium`
- Fonts: `--font-display` (Playfair Display), `--font-sans` (Inter)

### Design System

- **Rose Gold & Cream Palette**: Primary brand is `rose-gold-500` (#D4907B) with `celebration-cream` (#FDF8F2) backgrounds
- **Glassmorphism**: Cards use `bg-white/90 backdrop-blur-md` for frosted glass effect
- **Floating Shadows**: `shadow-floating` creates "antigravity" card elevation
- **Typography**: Playfair Display for headings (`font-display`), Inter for body text (`font-sans`)
- **Animations**: Framer Motion for page transitions, CSS animations for waveforms and record spins

### Responsive Breakpoints

- Mobile: `< 768px` (single-column cards, bottom player bar)
- Desktop: `≥ 768px` (grid layout, sidebar player)

## Important Implementation Notes

### ESLint Configuration

Uses flat config format (`eslint.config.js`) with:
- React Hooks plugin (recommended rules)
- React Refresh plugin (Vite integration)
- Custom rule: Ignores unused vars starting with uppercase (e.g., React imports)

### Vite Configuration

Minimal setup in `vite.config.js`. For GitHub Pages deployment, set `base: '/repo-name/'` before building.

### Legacy Code

The `legacy_src/` directory contains the original vanilla JS implementation. It is not used in the current React build and should be ignored.

### Media Autoplay

Browsers block autoplay of audio/video until user interaction. The app handles this by:
1. Requiring a button click on `WelcomeScreen` before entering dedications
2. Using this interaction to enable autoplay for subsequent media

### Data Loading

Dedications are fetched from `public/data/dedications.json`. The `App.jsx` component shows a loading state until the fetch completes. If the fetch fails, it logs to console and continues with an empty array (graceful degradation).

## Common Workflows

### Adding a New Dedication

1. Add media files to appropriate `public/` subdirectories
2. Generate album art for the song (if not using Spotify artwork)
3. Add dedication object to `public/data/dedications.json`
4. Assign a unique `id` (used for sorting)

### Changing Theme Colors

1. Open `src/index.css`
2. Edit color tokens in the `@theme` block (lines 7-42)
3. For legacy components, also update `:root` CSS variables (lines 60+)

### Modifying Media Playback Sequence

The logic lives in `src/components/player/MobileImmersivePlayer.jsx` and `DesktopImmersivePlayer.jsx`. Both files implement the same three-phase state machine (`VOICE` → `SONG` → next dedication).

### Deploying to GitHub Pages

1. Update `base` in `vite.config.js` to match your repo name
2. Run `npm run build`
3. Deploy the `dist/` folder to GitHub Pages
