import { AudioEvent } from './audioTypes';
export declare class EventScheduler {
    private running;
    private eventCallback;
    private intensity;
    setIntensity(intensity: number): void;
    setEventCallback(callback: (event: AudioEvent) => Promise<void>): void;
    start(events: AudioEvent[]): Promise<void>;
    stop(): void;
    private scheduleNextEvent;
    private pickWeightedEvent;
}
//# sourceMappingURL=scheduler.d.ts.map