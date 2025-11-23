import { Audio } from 'expo-av';
import { EventScheduler } from './scheduler';
export class ExpoAudioEngine {
    constructor() {
        this.soundObjects = new Map();
        this.scheduler = new EventScheduler();
        this.soundscape = null;
        this.running = false;
        this.intensity = 0.7;
    }
    async init() {
        // Configure audio mode for background playback on iOS
        await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: false,
        });
    }
    async start() {
        if (this.running)
            return;
        this.running = true;
        // Start base layers
        if (this.soundscape) {
            for (const baseLayer of this.soundscape.baseLayers) {
                await this.playBaseLayer(baseLayer.id);
            }
            // Setup event scheduler
            this.scheduler.setIntensity(this.intensity);
            this.scheduler.setEventCallback((event) => this.playEvent(event.id));
            await this.scheduler.start(this.soundscape.events);
        }
    }
    async playBaseLayer(layerId) {
        try {
            const sound = new Audio.Sound();
            // Use require() for bundled assets in Expo
            const assetSource = this.getAssetSource(layerId);
            await sound.loadAsync(assetSource);
            await sound.setIsLoopingAsync(true);
            await sound.playAsync();
            this.soundObjects.set(`base-${layerId}`, sound);
        }
        catch (error) {
            console.warn(`Failed to play base layer: ${layerId}`, error);
        }
    }
    async playEvent(eventId) {
        try {
            const sound = new Audio.Sound();
            const assetSource = this.getAssetSource(eventId);
            await sound.loadAsync(assetSource);
            // Randomize volume
            const volume = 0.4 + Math.random() * 0.4;
            await sound.setVolumeAsync(volume);
            await sound.playAsync();
            // Clean up after playback
            setTimeout(() => {
                sound.unloadAsync();
                this.soundObjects.delete(`event-${eventId}`);
            }, 3000);
        }
        catch (error) {
            console.warn(`Failed to play event: ${eventId}`, error);
        }
    }
    getAssetSource(id) {
        // Map logical IDs to actual asset files
        const assetMap = {
            wind1: require('../assets/wind1.mp3'),
            water: require('../assets/water.mp3'),
            hum: require('../assets/hum.mp3'),
            footsteps: require('../assets/footsteps.mp3'),
            bikes: require('../assets/bikes.mp3'),
            seaplanes: require('../assets/seaplanes.mp3'),
        };
        return assetMap[id] || null;
    }
    async stop() {
        this.running = false;
        this.scheduler.stop();
        // Stop all sounds
        for (const sound of this.soundObjects.values()) {
            try {
                await sound.stopAsync();
                await sound.unloadAsync();
            }
            catch (error) {
                console.warn('Error stopping sound', error);
            }
        }
        this.soundObjects.clear();
    }
    setOptions(options) {
        if (options.intensity !== undefined) {
            this.intensity = options.intensity;
            this.scheduler.setIntensity(this.intensity);
        }
    }
    async setSoundscape(soundscape) {
        this.soundscape = soundscape;
    }
    isRunning() {
        return this.running;
    }
}
//# sourceMappingURL=expoAudio.js.map