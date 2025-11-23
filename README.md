# Ambient Seattle Soundscape Generator

A cross-platform ambient soundscape generator for Seattle's South Lake Union, with iOS/Android (Expo) and web support.

## Project Structure

```
packages/
  audio-engine/          # Shared audio engine (platform-agnostic)
    src/
      audioTypes.ts      # Core interfaces and types
      engine.ts          # Factory function for creating engines
      scheduler.ts       # Event scheduling and weighted picking
      webAudio.ts        # Web Audio API implementation
      expoAudio.ts       # Expo Audio implementation
      soundscapeConfig.ts # Soundscape definitions
  mobile/                # Expo app (iOS/Android)
    App.tsx              # Main mobile component
    components/
      Controls.tsx       # UI controls component
  web/                   # React web app
    public/
      index.html         # Web entry point
      assets/            # Audio asset files (to be added)
    src/
      index.tsx          # React root
      App.tsx            # Main web component
      App.css            # Web app styles
      components/
        Controls.tsx     # Reusable controls component
```

## Getting Started

### Requirements

- **Node.js 16+** (workspaces require npm 7+)
- **npm 7+** (or yarn, pnpm)

### Installation

```bash
# Install all dependencies
npm install

# The workspaces will automatically install dependencies in each package
```

### Development

**Web App:**
```bash
cd packages/web
npm run dev
```

The web app will start on `http://localhost:3000`

**Mobile App (Expo):**
```bash
cd packages/mobile
npm start
```

Then select your platform:
- Press `i` for iOS
- Press `a` for Android
- Press `w` for web

### Adding Audio Assets

The web app expects audio files at `packages/web/public/assets/`:
- `wind1.mp3` - Continuous wind sound (Available from [Internet Archive SSE Library WIND](https://archive.org/details/SSE_Library_WIND/))
- `water.mp3` - Water/rain ambient sound
- `hum.mp3` - City hum ambient sound
- `footsteps.mp3` - Random footstep event
- `bikes.mp3` - Bike passing event
- `seaplanes.mp3` - Seaplane flying event

For the mobile app, place audio files at `packages/mobile/assets/` with the same names.

**Audio Requirements:**
- Format: MP3
- License: CC0, Public Domain, or Original (as per requirements)
- Estimated length: 2-5 seconds for events, continuous loops for base layers

### Key Features

- **Non-Repeating Soundscapes**: Randomized timing, volume, and panning ensure no two sessions sound identical
- **Intensity Control**: Adjustable slider controls event frequency (0.1 to 1.0)
- **Cross-Platform**: Identical experience across web, iOS, and Android
- **Background Playback**: iOS app continues playing when backgrounded
- **Web Gesture Requirement**: Web version requires user interaction to unlock audio (browser policy)

## Architecture Overview

### Audio Engine Interface

All implementations follow the `AudioEngine` interface:

```typescript
interface AudioEngine {
  init(): Promise<void>;           // Initialize audio context/resources
  start(): Promise<void>;          // Start playing soundscape
  stop(): Promise<void>;           // Stop all audio
  setOptions(options: AudioEngineOptions): void;
  setSoundscape(soundscape: Soundscape): Promise<void>;
  isRunning(): boolean;
}
```

### Event Scheduling

The `EventScheduler` class:
- Picks random events using weighted probability
- Calculates delays based on event's min/max delay range
- Scales delays by intensity setting (higher intensity = more frequent events)
- Randomizes volume and panning on each play

### Implementation Details

**Web Audio (`webAudio.ts`):**
- Uses Web Audio API (AudioContext, GainNode, StereoPannerNode)
- Preloads all audio buffers on init
- Implements seamless looping for base layers
- Handles browser audio context suspension/resumption

**Expo Audio (`expoAudio.ts`):**
- Uses expo-av for compatibility with iOS/Android
- Configures background audio mode for iOS
- Dynamically loads/unloads event sounds to manage memory
- Supports sound randomization

## Development Notes

### Adding New Soundscapes

1. Create a new soundscape config in `packages/audio-engine/src/soundscapeConfig.ts`:
```typescript
export const MY_SOUNDSCAPE: Soundscape = {
  id: 'my-id',
  name: 'My Soundscape',
  baseLayers: [
    { id: 'sound1', name: 'Sound 1' },
    { id: 'sound2', name: 'Sound 2' },
  ],
  events: [
    {
      id: 'event1',
      name: 'Event 1',
      weight: 0.5,
      minDelay: 5000,
      maxDelay: 15000,
    },
  ],
};
```

2. Add corresponding audio files to both:
   - `packages/web/public/assets/`
   - `packages/mobile/assets/`

3. Update the audio source maps in engine implementations to include new IDs

### Building for Production

**Web:**
```bash
cd packages/web
npm run build
```

Outputs to `packages/web/build/`

**Mobile:**
```bash
cd packages/mobile
eas build --platform ios  # For iOS
eas build --platform android  # For Android
```

Requires Expo Account and EAS CLI.

## Browser Support

- Chrome 14+
- Safari 12+
- Firefox 25+
- Edge 12+

All modern browsers with Web Audio API support.

## License

See LICENSE file for details. All audio assets must be CC0, Public Domain, or Original.
