import { AudioEngine } from './audioTypes';
import { WebAudioEngine } from './webAudio';
import { ExpoAudioEngine } from './expoAudio';

let engineInstance: AudioEngine | null = null;

function isWeb(): boolean {
  return typeof window !== 'undefined' && typeof window.AudioContext !== 'undefined';
}

export function createEngine(): AudioEngine {
  if (engineInstance) {
    return engineInstance;
  }

  if (isWeb()) {
    engineInstance = new WebAudioEngine();
  } else {
    engineInstance = new ExpoAudioEngine();
  }

  return engineInstance;
}

export function getEngine(): AudioEngine {
  if (!engineInstance) {
    return createEngine();
  }
  return engineInstance;
}
