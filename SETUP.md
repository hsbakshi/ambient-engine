# Monorepo Setup & Build Guide

This project uses **npm workspaces** for monorepo management. All packages are managed from the root directory.

## Quick Start

### 1. Install Everything (First Time)

```bash
npm install
```

The `npm install` command automatically:
- Installs root dependencies (TypeScript)
- Installs all workspace dependencies
- Links local packages (@hybrid/audio-engine) to dependent packages

**No additional setup needed!** npm workspaces handle everything automatically.

### 2. Run the Web App

```bash
npm run dev:web
```

This starts the development server at `http://localhost:3000`

### 3. (Optional) Run Mobile App

```bash
npm run dev:mobile
```

Requires Expo to be installed globally: `npm install -g expo-cli`

---

## Available Commands

### From Root Directory

```bash
# Install all dependencies
npm install

# Type check all TypeScript
npm run lint

# Build audio engine (TypeScript → JavaScript)
npm run build:engine

# Build web app for production
npm run build:web

# Build both engine and web
npm run build

# Start web dev server
npm run dev:web

# Start mobile dev server
npm run dev:mobile
```

### From Individual Packages

```bash
# From packages/web
npm run dev      # Start dev server
npm run build    # Build for production
npm run test     # Run tests

# From packages/audio-engine
npm run build         # Compile TypeScript
npm run type-check    # Check types without compiling

# From packages/mobile
npm start    # Start Expo
```

---

## Understanding the Monorepo Structure

### Root Package.json
- Declares workspaces: `packages/*`
- Defines shared npm scripts that run in all packages
- Installs TypeScript as devDependency (shared across workspace)

### Workspace Packages

**`packages/audio-engine`** (Library)
- Platform-agnostic audio engine
- Exports TypeScript types and implementations
- Referenced by: web, mobile
- Main entry: `src/index.ts`

**`packages/web`** (React App)
- React + React Scripts
- Depends on: `@hybrid/audio-engine`
- Dev server: `npm run dev`
- Production build: `npm run build` → `build/` folder

**`packages/mobile`** (Expo App)
- React Native + Expo
- Depends on: `@hybrid/audio-engine`
- Dev server: `npm start` (requires Expo CLI)

---

## How Dependencies Work

When the web app imports from the audio engine:

```typescript
import { createEngine, SLU_SOUNDscape } from '@hybrid/audio-engine';
```

npm automatically:
1. Resolves `@hybrid/audio-engine` to `packages/audio-engine`
2. Reads `packages/audio-engine/package.json` → `"main": "src/index.ts"`
3. Uses the source TypeScript files directly (during dev)
4. Uses compiled JavaScript (after `npm run build:engine`)

**No build step required for development!** React-scripts and webpack handle TypeScript compilation automatically.

---

## Troubleshooting

### "Cannot find module '@hybrid/audio-engine'"

**Solution**: Run `npm install` from the root directory to link workspaces.

```bash
npm install
```

### "Audio engine not updating when I change files"

The web app watches the audio engine files directly, so changes take effect automatically. If not:

```bash
# Clear cache and restart
rm -rf packages/web/node_modules/.cache
npm run dev:web
```

### "TypeScript errors not showing up"

Check types with:

```bash
npm run lint
```

Or build the engine to catch errors:

```bash
npm run build:engine
```

### "Module resolution errors in IDE"

Make sure your IDE is configured for TypeScript workspaces:
- **VSCode**: Install "TypeScript Vue Plugin" extension
- **WebStorm**: Built-in support for npm workspaces

---

## Build Pipeline

### Development
```
Source (TypeScript)
    ↓
react-scripts (webpack)
    ↓
Browser (with hot reload)
```

### Production
```
Source (TypeScript)
    ↓
npm run build:engine (tsc)
    ↓
dist/ (compiled JavaScript)
    ↓
npm run build:web (webpack)
    ↓
build/ (optimized bundle)
```

---

## Adding New Packages

To add a new package to the monorepo:

1. Create folder: `packages/my-package`
2. Create `package.json` with `"name": "@hybrid/my-package"`
3. Root `npm install` automatically recognizes it

---

## Performance Notes

- **First install**: ~2-3 minutes (installs all dependencies)
- **Hot reload**: Instant (dev server watches source files)
- **Build**: ~30-60 seconds (web production build)

---

## Further Reading

- [npm Workspaces Documentation](https://docs.npmjs.com/cli/v7/using-npm/workspaces)
- [React Scripts Documentation](https://create-react-app.dev/)
- [Expo Documentation](https://docs.expo.dev/)
