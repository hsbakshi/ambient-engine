import React, { useState } from 'react';
import { SafeAreaView, Text } from 'react-native';
import Controls from './components/Controls';
import { SLU_SOUNDscape, createEngine } from '@hybrid/audio-engine';

export default function App() {
  const [running, setRunning] = useState(false);
  const [intensity, setIntensity] = useState(0.7);

  async function handleStart() {
    const eng = createEngine();
    await eng.init();
    await eng.setSoundscape(SLU_SOUNDscape);
    eng.setOptions({ intensity });
    await eng.start();
    setRunning(true);
  }

  async function handleStop() {
    const eng = createEngine();
    await eng.stop();
    setRunning(false);
  }

  return (
    <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 20, marginBottom: 8 }}>Hybrid Ambient Starter — SLU</Text>
      <Controls running={running} onStart={handleStart} onStop={handleStop} intensity={intensity} setIntensity={setIntensity} />
    </SafeAreaView>
  );
}

