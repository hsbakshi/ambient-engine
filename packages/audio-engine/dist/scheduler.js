export class EventScheduler {
    constructor() {
        this.running = false;
        this.eventCallback = null;
        this.intensity = 0.5;
    }
    setIntensity(intensity) {
        this.intensity = Math.max(0.1, Math.min(1, intensity));
    }
    setEventCallback(callback) {
        this.eventCallback = callback;
    }
    async start(events) {
        this.running = true;
        this.scheduleNextEvent(events);
    }
    stop() {
        this.running = false;
    }
    scheduleNextEvent(events) {
        if (!this.running || !this.eventCallback)
            return;
        // Pick a random event based on weights
        const selectedEvent = this.pickWeightedEvent(events);
        if (!selectedEvent) {
            this.scheduleNextEvent(events);
            return;
        }
        // Calculate delay scaled by intensity (higher intensity = shorter delays)
        const delayRange = selectedEvent.maxDelay - selectedEvent.minDelay;
        const baseDelay = selectedEvent.minDelay + Math.random() * delayRange;
        const intensityFactor = 0.5 + this.intensity * 1.5; // Range from 0.5 to 2
        const delay = baseDelay / intensityFactor;
        setTimeout(() => {
            if (!this.running || !this.eventCallback)
                return;
            this.eventCallback(selectedEvent).then(() => {
                this.scheduleNextEvent(events);
            });
        }, delay);
    }
    pickWeightedEvent(events) {
        const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
        if (totalWeight === 0)
            return null;
        let random = Math.random() * totalWeight;
        for (const event of events) {
            random -= event.weight;
            if (random <= 0)
                return event;
        }
        return events[events.length - 1];
    }
}
//# sourceMappingURL=scheduler.js.map