import React from 'react';
import './Controls.css';

interface ControlsProps {
  running: boolean;
  loading: boolean;
  onStart: () => void;
  onStop: () => void;
  intensity: number;
  setIntensity: (value: number) => void;
}

export default function Controls({
  running,
  loading,
  onStart,
  onStop,
  intensity,
  setIntensity,
}: ControlsProps) {
  return (
    <div className="controls">
      <button
        className={`play-button ${running ? 'running' : ''} ${loading ? 'loading' : ''}`}
        onClick={running ? onStop : onStart}
        disabled={loading}
      >
        {loading ? (
          <>
            <span className="spinner"></span>
            {running ? 'Stopping...' : 'Starting...'}
          </>
        ) : running ? (
          'Stop'
        ) : (
          'Start'
        )}
      </button>

      <div className="slider-container">
        <label htmlFor="intensity-slider">Intensity</label>
        <input
          id="intensity-slider"
          type="range"
          min="0.1"
          max="1"
          step="0.1"
          value={intensity}
          onChange={(e) => setIntensity(parseFloat(e.target.value))}
          className="intensity-slider"
          disabled={!running}
        />
        <span className="intensity-value">{(intensity * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
