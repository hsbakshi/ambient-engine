# Ambient Seattle Soundscape Generator — Requirements

## 1. Functional Requirements

### 1.1 Core Experience

* Generate ambient, realistic, non-repeating soundscapes resembling Seattle’s South Lake Union.
* Mixed continuous loops and randomized natural events.
* Sound must feel alive and unpredictable.

### 1.2 Platforms

* iPhone app (Expo / React Native).
* Web app (React Native Web + Web Audio API).
* Identical experience across platforms.

### 1.3 Controls

* Start / Stop soundscape.
* Intensity slider controlling event frequency.
* Future options: per-layer volume, soundscape selector.

### 1.4 Soundscape Structure

* Base loops (continuous layers: wind, water, city hum).
* Event sounds (random, weighted: footsteps, bikes, seaplanes).
* Events include: weight, min/max delays, loop flag.

### 1.5 Non-Repetition

* Random selection, timing, volume, panning.
* Ensures no two sessions sound identical.

### 1.6 Assets

* Local bundled files for Expo.
* URL-accessible files for web.
* All audio loaded and cached on init.

### 1.7 User Interaction

* Web must require user gesture.
* iOS must keep audio running in background.

---

## 2. Technical Requirements

### 2.1 Architecture

Monorepo with workspaces:

```
root/
  package.json
  packages/
    audio-engine/
    mobile/
```

### 2.2 Shared Audio Engine

Implements `AudioEngine` interface:

* `init`, `start`, `stop`, `setOptions`, `setSoundscape`.
* Runtime platform detection.

#### 2.2.1 Scheduler

* Async loop.
* Weighted event picking.
* Random delay scaled by intensity.

#### 2.2.2 Web Audio Implementation

* Uses AudioContext, GainNode, StereoPannerNode.
* Preloads all buffers.
* Randomized gain/pan on each event.

#### 2.2.3 Expo Audio Implementation

* Uses expo-av.
* Looped base layers.
* Events loaded & unloaded dynamically.

### 2.3 Mobile App

* Uses Expo + expo-av.
* Background playback enabled.
* Minimal controls UI.

### 2.4 Web App

* React Native Web.
* Assets served from /public/assets.
* User gesture required to unlock audio.

### 2.5 Assets Pipeline

* Mobile: `packages/mobile/assets/*`.
* Web: `/public/assets/*`.
* Soundscape config references logical IDs.

### 2.6 Performance

* Single AudioContext.
* Seamless looping.
* Limit simultaneous events.

### 2.7 Reliability

* Handle backgrounding and suspended contexts.
* Preloading with graceful failures.

---

## 3. Non-Functional Requirements

### 3.1 Maintainability

* Shared engine must stay platform-agnostic.
* UI kept separate from audio logic.

### 3.2 Extensibility

* Easy to add new soundscapes.
* No changes needed to engine code.

### 3.3 Portability

* Android support can be added later.
* Web supports Chrome, Safari, Firefox.

### 3.4 Licensing

* All audio assets must be CC0, public domain, or original.

---

End of requirements.
