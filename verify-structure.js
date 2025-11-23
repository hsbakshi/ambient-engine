#!/usr/bin/env node
/**
 * Simple script to verify the project structure is correct
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  // Audio engine
  'packages/audio-engine/src/audioTypes.ts',
  'packages/audio-engine/src/engine.ts',
  'packages/audio-engine/src/scheduler.ts',
  'packages/audio-engine/src/webAudio.ts',
  'packages/audio-engine/src/expoAudio.ts',
  'packages/audio-engine/src/soundscapeConfig.ts',
  'packages/audio-engine/src/index.ts',
  'packages/audio-engine/package.json',
  'packages/audio-engine/tsconfig.json',

  // Web app
  'packages/web/public/index.html',
  'packages/web/src/index.tsx',
  'packages/web/src/App.tsx',
  'packages/web/src/App.css',
  'packages/web/src/components/Controls.tsx',
  'packages/web/src/components/Controls.css',
  'packages/web/package.json',
  'packages/web/tsconfig.json',

  // Mobile app
  'packages/mobile/App.tsx',
  'packages/mobile/components/Controls.tsx',
  'packages/mobile/package.json',

  // Root
  'package.json',
  'tsconfig.json',
  'requirements.md',
  'README.md',
];

const missingFiles = [];
const presentFiles = [];

for (const file of requiredFiles) {
  const fullPath = path.join(__dirname, file);
  if (fs.existsSync(fullPath)) {
    presentFiles.push(file);
  } else {
    missingFiles.push(file);
  }
}

console.log('\n✓ Project Structure Verification\n');
console.log(`✓ Found ${presentFiles.length}/${requiredFiles.length} required files\n`);

if (missingFiles.length > 0) {
  console.log('✗ Missing files:');
  missingFiles.forEach(f => console.log(`  - ${f}`));
} else {
  console.log('✓ All required files present!');
}

// Check for required directories
const requiredDirs = [
  'packages/audio-engine/src',
  'packages/web/src',
  'packages/web/public',
  'packages/web/public/assets',
  'packages/web/src/components',
  'packages/mobile/components',
];

console.log('\n✓ Checking directories...\n');
let allDirsPresent = true;
for (const dir of requiredDirs) {
  const fullPath = path.join(__dirname, dir);
  if (fs.existsSync(fullPath)) {
    console.log(`  ✓ ${dir}`);
  } else {
    console.log(`  ✗ ${dir}`);
    allDirsPresent = false;
  }
}

if (allDirsPresent && missingFiles.length === 0) {
  console.log('\n✓ Project structure looks good! Ready for development.\n');
  process.exit(0);
} else {
  console.log('\n✗ Some files/directories are missing. Please check above.\n');
  process.exit(1);
}
