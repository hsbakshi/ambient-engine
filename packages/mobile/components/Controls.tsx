import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ControlsProps {
  running: boolean;
  onStart: () => void;
  onStop: () => void;
  intensity: number;
  setIntensity: (value: number) => void;
}

const Controls = ({
  running,
  onStart,
  onStop,
  intensity,
  setIntensity,
}: ControlsProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, running && styles.buttonRunning]}
        onPress={running ? onStop : onStart}
      >
        <Text style={styles.buttonText}>{running ? 'Stop' : 'Start'}</Text>
      </TouchableOpacity>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Intensity: {(intensity * 100).toFixed(0)}%</Text>
        <View style={styles.sliderTrack}>
          <View
            style={[
              styles.sliderFill,
              { width: `${intensity * 100}%` },
            ]}
          />
        </View>
        <View style={styles.buttonGroup}>
          {[0.1, 0.3, 0.5, 0.7, 0.9].map((value) => (
            <TouchableOpacity
              key={value}
              style={[
                styles.presetButton,
                Math.abs(intensity - value) < 0.05 && styles.presetButtonActive,
              ]}
              onPress={() => setIntensity(value)}
            >
              <Text style={styles.presetButtonText}>{(value * 100).toFixed(0)}%</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    width: '100%',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 10,
    backgroundColor: '#667eea',
    alignItems: 'center',
  },
  buttonRunning: {
    backgroundColor: '#f5576c',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  sliderContainer: {
    width: '100%',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'left',
  },
  sliderTrack: {
    width: '100%',
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e5e5',
    overflow: 'hidden',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: '#667eea',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  presetButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 6,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  presetButtonActive: {
    backgroundColor: '#667eea',
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#666',
  },
});

export default Controls;
