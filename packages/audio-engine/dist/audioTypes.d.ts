export interface AudioEvent {
    id: string;
    name: string;
    weight: number;
    minDelay: number;
    maxDelay: number;
    loop?: boolean;
}
export interface Soundscape {
    id: string;
    name: string;
    baseLayers: {
        id: string;
        name: string;
        volume?: number;
    }[];
    events: AudioEvent[];
}
export interface AudioEngineOptions {
    intensity?: number;
}
export interface AudioEngine {
    init(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
    setOptions(options: AudioEngineOptions): void;
    setSoundscape(soundscape: Soundscape): Promise<void>;
    isRunning(): boolean;
}
//# sourceMappingURL=audioTypes.d.ts.map