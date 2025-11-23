import { AudioEngine, AudioEngineOptions, Soundscape } from './audioTypes';
export declare class ExpoAudioEngine implements AudioEngine {
    private soundObjects;
    private scheduler;
    private soundscape;
    private running;
    private intensity;
    init(): Promise<void>;
    start(): Promise<void>;
    private playBaseLayer;
    private playEvent;
    private getAssetSource;
    stop(): Promise<void>;
    setOptions(options: AudioEngineOptions): void;
    setSoundscape(soundscape: Soundscape): Promise<void>;
    isRunning(): boolean;
}
//# sourceMappingURL=expoAudio.d.ts.map