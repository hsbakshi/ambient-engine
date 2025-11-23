import React, { useState, useRef, useEffect } from 'react';
import { WebAudioEngine, SLU_SOUNDscape } from '@hybrid/audio-engine/web';
import Controls from './components/Controls';
import './App.css';

type Engine = WebAudioEngine | null;

export default function App() {
  const [running, setRunning] = useState(false);
  const [intensity, setIntensity] = useState(0.7);
  const [initialized, setInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const engineRef = useRef<Engine>(null);

  // Setup asset URLs for web (they'll be served from /public/assets/)
  useEffect(() => {
    const engine = new WebAudioEngine();
    const assetUrls = new Map([
      ['wind1', '/assets/wind1.mp3'],
      ['water', '/assets/water.mp3'],
      ['hum', '/assets/hum.mp3'],
      ['footsteps', '/assets/footsteps.mp3'],
      ['bikes', '/assets/bikes.mp3'],
      ['seaplanes', '/assets/seaplanes.mp3'],
    ]);
    engine.setAssetUrls(assetUrls);
    engineRef.current = engine;
  }, []);

  const handleStart = async () => {
    try {
      setError(null);
      const engine = engineRef.current;
      if (!engine) return;

      if (!initialized) {
        await engine.init();
        await engine.setSoundscape(SLU_SOUNDscape);
        setInitialized(true);
      }

      engine.setOptions({ intensity });
      await engine.start();
      setRunning(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to start audio';
      setError(message);
      console.error('Error starting audio:', err);
    }
  };

  const handleStop = async () => {
    try {
      setError(null);
      const engine = engineRef.current;
      if (!engine) return;

      await engine.stop();
      setRunning(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to stop audio';
      setError(message);
      console.error('Error stopping audio:', err);
    }
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    const engine = engineRef.current;
    if (engine && running) {
      engine.setOptions({ intensity: newIntensity });
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <header className="app-header">
          <h1>Ambient SLU</h1>
          <p>Seattle Soundscape Generator</p>
        </header>

        <div className="app-main">
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          <Controls
            running={running}
            onStart={handleStart}
            onStop={handleStop}
            intensity={intensity}
            setIntensity={handleIntensityChange}
          />
        </div>

        <footer className="app-footer">
          <p>Click to enable audio • Use the intensity slider to control event frequency</p>
        </footer>
      </div>
    </div>
  );
}
