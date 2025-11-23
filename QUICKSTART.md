# Quick Start Guide

## What's Been Built

✓ Complete monorepo structure with:
- **Audio Engine**: Shared, platform-agnostic audio engine with Web Audio and Expo implementations
- **Web App**: React-based web application with Intensity slider and Start/Stop controls
- **Mobile App**: Expo app structure (ready for audio assets)
- **Full TypeScript support** with proper configuration

## Project Structure Summary

```
audio-engine/          # Shared audio engine
├── audioTypes.ts      # Core interfaces (AudioEngine, Soundscape, AudioEvent)
├── engine.ts          # Factory that creates Web or Expo engine
├── scheduler.ts       # Weighted event picking + delay calculation
├── webAudio.ts        # Web Audio API implementation
├── expoAudio.ts       # Expo Audio implementation
└── soundscapeConfig.ts # SLU soundscape definition

web/                   # Web app (React + React Scripts)
├── public/
│   ├── index.html     # Entry point
│   └── assets/        # Audio files go here (wind.mp3, water.mp3, etc)
└── src/
    ├── App.tsx        # Main app component
    ├── App.css        # Styles
    └── components/Controls.tsx  # Reusable controls

mobile/                # Expo app (iOS/Android)
├── App.tsx            # Main app
└── components/Controls.tsx  # Mobile controls
```

## To Get the Web Version Running

### 1. Add Audio Files

The app needs audio files. You can either:

**Option A: Use free audio from freesound.org, Internet Archive, or similar**
- Download CC0-licensed or Public Domain MP3 files
- Place them in: `packages/web/public/assets/`
- Required files:
  - `wind1.mp3` (base layer) — From [Internet Archive SSE Library](https://archive.org/details/SSE_Library_WIND/): "Light wind with metal squeaks; sign or porch"
  - `water.mp3` (base layer)
  - `hum.mp3` (base layer)
  - `footsteps.mp3` (event)
  - `bikes.mp3` (event)
  - `seaplanes.mp3` (event)

**Option B: Generate/Record Your Own**
- Record or generate 2-5 second audio clips
- Convert to MP3 format
- Place in `packages/web/public/assets/`

### 2. Install Dependencies

```bash
# Make sure you have Node 16+ and npm 7+
npm install

# Then install web app dependencies
cd packages/web
npm install
```

### 3. Start the Web App

```bash
cd packages/web
npm run dev
```

The app will open at `http://localhost:3000`

### 4. Test It

1. Click "Start" button (required for web audio)
2. You should hear the base layers (wind, water, hum) playing continuously
3. Move the Intensity slider to change how often events play
4. Click "Stop" to stop playback

## What Each Component Does

### Audio Engine Layer

**WebAudioEngine** (web/webAudio.ts):
- Uses Web Audio API (AudioContext, GainNode, StereoPanner)
- Preloads all audio buffers on init
- Randomizes volume (0.4-0.8) and pan (-1 to 1) on each event
- Handles audio context suspension (browser requirement)

**ExpoAudioEngine** (mobile/expoAudio.ts):
- Uses expo-av for iOS/Android compatibility
- Supports background playback on iOS
- Dynamic loading/unloading of event sounds

**Scheduler** (scheduler.ts):
- Picks random events using weighted probability
- Calculates delays: `baseDelay / (0.5 + intensity * 1.5)`
- Higher intensity = shorter delays between events

### UI Controls (web/src/components/Controls.tsx)

- **Start/Stop Button**: Toggles playback
- **Intensity Slider**: 0.1 to 1.0 (controls event frequency)
- Responsive design with gradient styling

## The Soundscape

**South Lake Union (SLU_Soundscape)**:
- **Base Layers** (continuous, looping):
  - Wind (wind1.mp3 - light wind with metal squeaks from Internet Archive SSE Library)
  - Water (rain/water sounds)
  - City Hum (urban background)

- **Events** (random, weighted):
  - Footsteps: 30% weight, 5-15s delays
  - Bikes: 25% weight, 8-20s delays
  - Seaplanes: 15% weight, 20-45s delays

Event frequency is inversely proportional to intensity:
- Low intensity (0.1): ~20-40s between events
- High intensity (1.0): ~5-10s between events

## Important Notes

### Web Audio Requirements
- Requires user gesture (click) to start audio (browser policy)
- Works in all modern browsers (Chrome, Safari, Firefox, Edge)
- Only works over HTTPS in production (HTTP for localhost)

### Mobile Setup
The mobile app structure is ready but needs:
1. Audio files in `packages/mobile/assets/`
2. Installation of Expo CLI: `npm install -g expo-cli`
3. Then run: `cd packages/mobile && npm start`

### Adding New Soundscapes

Create new soundscape config in `audio-engine/src/soundscapeConfig.ts`:
```typescript
export const NEW_SOUNDSCAPE: Soundscape = {
  id: 'new',
  name: 'New Place',
  baseLayers: [
    { id: 'layer1', name: 'Layer 1' },
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

Then add audio files and update the asset URL maps in both engines.

## Next Steps

1. **Add Audio Files** - This is the main blocker for testing
2. **Test Web Version** - Verify controls work and audio plays
3. **Add More Soundscapes** - Create new soundscape configs
4. **Set Up Mobile** - Install Expo and test on iOS/Android
5. **Production Build** - Run `npm run build` in web package

## Troubleshooting

**"Audio context is suspended"**
- Click the start button (browser requirement)

**"Failed to load audio" in console**
- Check that MP3 files exist at `packages/web/public/assets/`
- Check browser console for 404 errors

**Module not found errors**
- Run `npm install` in the root directory
- Run `npm install` in `packages/web` directory

**Node version too old**
- Install Node 16+ from nodejs.org
- npm 7+ is required for workspaces

## File Locations

Key files for the web version:
- App logic: `packages/web/src/App.tsx`
- Controls: `packages/web/src/components/Controls.tsx`
- Audio engine: `packages/audio-engine/src/`
- Audio files: `packages/web/public/assets/`

You can now start by adding audio files and running the dev server!
