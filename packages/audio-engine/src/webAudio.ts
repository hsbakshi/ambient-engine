import { AudioEngine, AudioEngineOptions, Soundscape } from './audioTypes';
import { EventScheduler } from './scheduler';

export class WebAudioEngine implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private baseLayerElements: Map<string, HTMLAudioElement> = new Map();
  private eventSources: AudioBufferSourceNode[] = [];
  private audioBuffers: Map<string, AudioBuffer> = new Map();
  private scheduler: EventScheduler = new EventScheduler();
  private soundscape: Soundscape | null = null;
  private running = false;
  private intensity = 0.7;
  private assetUrls: Map<string, string> = new Map();

  setAssetUrls(urls: Map<string, string>) {
    this.assetUrls = urls;
  }

  async init(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Load event audio buffers (base layers use HTML5 audio)
    if (this.soundscape) {
      await this.loadEventAudioBuffers();
    }
  }

  private async loadEventAudioBuffers(): Promise<void> {
    if (!this.soundscape || !this.audioContext) return;

    const eventIds = this.soundscape.events.map(e => e.id);

    for (const id of eventIds) {
      if (!this.audioBuffers.has(id)) {
        const url = this.assetUrls.get(id);
        if (url) {
          try {
            const buffer = await this.fetchAndDecodeAudio(url);
            this.audioBuffers.set(id, buffer);
          } catch (error) {
            console.warn(`Failed to load audio: ${id}`, error);
          }
        }
      }
    }
  }

  private async fetchAndDecodeAudio(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext!.decodeAudioData(arrayBuffer);
  }

  async start(): Promise<void> {
    if (this.running) return;

    this.running = true;

    // Start base layers SYNCHRONOUSLY first (must happen in user interaction context on iOS)
    if (this.soundscape) {
      for (const baseLayer of this.soundscape.baseLayers) {
        this.playBaseLayer(baseLayer.id);
      }
    }

    // iOS audio session setup for loudspeaker support (iOS 17+)
    if (typeof window !== 'undefined' && (navigator as any).audioSession) {
      try {
        // Set audio session type to playback so audio respects loudspeaker
        // instead of mute switch (iOS 17+)
        (navigator as any).audioSession.type = 'playback';
      } catch (e) {
        console.debug('Audio session configuration not available');
      }
    }

    // Resume context if suspended (required by browsers)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    // Setup event scheduler (can be async)
    if (this.soundscape) {
      this.scheduler.setIntensity(this.intensity);
      this.scheduler.setEventCallback((event) => this.playEvent(event.id));
      await this.scheduler.start(this.soundscape.events);
    }
  }

  private playBaseLayer(layerId: string): void {
    const url = this.assetUrls.get(layerId);
    if (!url) return;

    // Use HTML5 audio element for base layers (better iOS support)
    const audio = new Audio();
    audio.src = url;
    audio.loop = true;
    audio.volume = 0.3; // Base layer volume

    // Play must be called synchronously within user interaction context on iOS
    try {
      // Using play() return Promise, ignore rejection
      audio.play()?.catch(() => {
        // Silently continue if play fails initially
      });
    } catch (error) {
      console.warn(`Failed to play base layer ${layerId}:`, error);
    }

    this.baseLayerElements.set(layerId, audio);
  }

  private async playEvent(eventId: string): Promise<void> {
    if (!this.audioContext || !this.running) return;

    const buffer = this.audioBuffers.get(eventId);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;

    // Randomize gain (volume)
    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.4 + Math.random() * 0.4; // Volume between 0.4 and 0.8

    // Randomize panning
    const pannerNode = this.audioContext.createStereoPanner();
    pannerNode.pan.value = (Math.random() - 0.5) * 2; // Pan between -1 and 1

    source.connect(gainNode);
    gainNode.connect(pannerNode);
    pannerNode.connect(this.audioContext.destination);

    this.eventSources.push(source);
    source.start(0);

    // Remove source from tracking when it ends
    source.onended = () => {
      this.eventSources = this.eventSources.filter(s => s !== source);
    };
  }

  async stop(): Promise<void> {
    this.running = false;
    this.scheduler.stop();

    // Stop base layer audio elements
    for (const audio of this.baseLayerElements.values()) {
      audio.pause();
      audio.currentTime = 0;
    }
    this.baseLayerElements.clear();

    // Stop all event sounds
    for (const source of this.eventSources) {
      try {
        source.stop();
      } catch (e) {
        // Source may have already ended naturally
      }
    }
    this.eventSources = [];
  }

  setOptions(options: AudioEngineOptions): void {
    if (options.intensity !== undefined) {
      this.intensity = options.intensity;
      this.scheduler.setIntensity(this.intensity);
    }
  }

  async setSoundscape(soundscape: Soundscape): Promise<void> {
    this.soundscape = soundscape;
    await this.loadEventAudioBuffers();
  }

  isRunning(): boolean {
    return this.running;
  }
}
