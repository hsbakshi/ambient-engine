import { AudioEngine, AudioEngineOptions, Soundscape } from './audioTypes';
export declare class WebAudioEngine implements AudioEngine {
    private audioContext;
    private baseLayerGains;
    private baseLayerSources;
    private audioBuffers;
    private scheduler;
    private soundscape;
    private running;
    private intensity;
    private assetUrls;
    setAssetUrls(urls: Map<string, string>): void;
    init(): Promise<void>;
    private loadAllAudioBuffers;
    private fetchAndDecodeAudio;
    start(): Promise<void>;
    private playBaseLayer;
    private playEvent;
    stop(): Promise<void>;
    setOptions(options: AudioEngineOptions): void;
    setSoundscape(soundscape: Soundscape): Promise<void>;
    isRunning(): boolean;
}
//# sourceMappingURL=webAudio.d.ts.map