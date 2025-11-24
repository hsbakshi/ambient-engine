import { AudioEngine, AudioEngineOptions, Soundscape } from './audioTypes';
import { EventScheduler } from './scheduler';

export class WebAudioEngine implements AudioEngine {
  private audioContext: AudioContext | null = null;
  private baseLayerGains: Map<string, GainNode> = new Map();
  private baseLayerSources: Map<string, AudioBufferSourceNode> = new Map();
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

    // Load all audio buffers for the current soundscape
    if (this.soundscape) {
      await this.loadAllAudioBuffers();
    }
  }

  private async loadAllAudioBuffers(): Promise<void> {
    if (!this.soundscape || !this.audioContext) return;

    const allIds = [
      ...this.soundscape.baseLayers.map(l => l.id),
      ...this.soundscape.events.map(e => e.id),
    ];

    for (const id of allIds) {
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

    // Resume context if suspended (required by browsers)
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    this.running = true;

    // Start base layers
    if (this.soundscape) {
      for (const baseLayer of this.soundscape.baseLayers) {
        this.playBaseLayer(baseLayer.id);
      }

      // Setup event scheduler
      this.scheduler.setIntensity(this.intensity);
      this.scheduler.setEventCallback((event) => this.playEvent(event.id));
      await this.scheduler.start(this.soundscape.events);
    }
  }

  private playBaseLayer(layerId: string): void {
    if (!this.audioContext) return;

    const buffer = this.audioBuffers.get(layerId);
    if (!buffer) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.start(0);

    const gainNode = this.audioContext.createGain();
    gainNode.gain.value = 0.3; // Base layer volume
    source.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    this.baseLayerGains.set(layerId, gainNode);
    this.baseLayerSources.set(layerId, source);
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

    // Stop base layers
    for (const source of this.baseLayerSources.values()) {
      source.stop();
    }
    this.baseLayerSources.clear();
    this.baseLayerGains.clear();

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
    await this.loadAllAudioBuffers();
  }

  isRunning(): boolean {
    return this.running;
  }
}
