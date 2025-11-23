import { WebAudioEngine } from './webAudio';
import { ExpoAudioEngine } from './expoAudio';
let engineInstance = null;
function isWeb() {
    return typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined';
}
export function createEngine() {
    if (engineInstance) {
        return engineInstance;
    }
    if (isWeb()) {
        engineInstance = new WebAudioEngine();
    }
    else {
        engineInstance = new ExpoAudioEngine();
    }
    return engineInstance;
}
export function getEngine() {
    if (!engineInstance) {
        return createEngine();
    }
    return engineInstance;
}
//# sourceMappingURL=engine.js.map