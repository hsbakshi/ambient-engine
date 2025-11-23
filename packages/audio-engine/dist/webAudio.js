import { EventScheduler } from './scheduler';
export class WebAudioEngine {
    constructor() {
        this.audioContext = null;
        this.baseLayerGains = new Map();
        this.baseLayerSources = new Map();
        this.audioBuffers = new Map();
        this.scheduler = new EventScheduler();
        this.soundscape = null;
        this.running = false;
        this.intensity = 0.7;
        this.assetUrls = new Map();
    }
    setAssetUrls(urls) {
        this.assetUrls = urls;
    }
    async init() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        // Load all audio buffers for the current soundscape
        if (this.soundscape) {
            await this.loadAllAudioBuffers();
        }
    }
    async loadAllAudioBuffers() {
        if (!this.soundscape || !this.audioContext)
            return;
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
                    }
                    catch (error) {
                        console.warn(`Failed to load audio: ${id}`, error);
                    }
                }
            }
        }
    }
    async fetchAndDecodeAudio(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        return this.audioContext.decodeAudioData(arrayBuffer);
    }
    async start() {
        if (this.running)
            return;
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
    playBaseLayer(layerId) {
        if (!this.audioContext)
            return;
        const buffer = this.audioBuffers.get(layerId);
        if (!buffer)
            return;
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
    async playEvent(eventId) {
        if (!this.audioContext)
            return;
        const buffer = this.audioBuffers.get(eventId);
        if (!buffer)
            return;
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
        source.start(0);
    }
    async stop() {
        this.running = false;
        this.scheduler.stop();
        // Stop base layers
        for (const source of this.baseLayerSources.values()) {
            source.stop();
        }
        this.baseLayerSources.clear();
        this.baseLayerGains.clear();
    }
    setOptions(options) {
        if (options.intensity !== undefined) {
            this.intensity = options.intensity;
            this.scheduler.setIntensity(this.intensity);
        }
    }
    async setSoundscape(soundscape) {
        this.soundscape = soundscape;
        await this.loadAllAudioBuffers();
    }
    isRunning() {
        return this.running;
    }
}
//# sourceMappingURL=webAudio.js.map