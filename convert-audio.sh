#!/bin/bash
# Audio conversion script - converts WAV files to MP3

# This script converts the WAV files to MP3 format
# You need ffmpeg installed: brew install ffmpeg (macOS) or apt-get install ffmpeg (Linux)

ASSETS_DIR="packages/web/public/assets"

echo "Converting WAV files to MP3..."
echo ""

# Check if ffmpeg is available
if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg is not installed."
    echo ""
    echo "Please install ffmpeg:"
    echo "  macOS:  brew install ffmpeg"
    echo "  Linux:  sudo apt-get install ffmpeg"
    echo "  Ubuntu: sudo apt install ffmpeg"
    echo ""
    echo "Or use an online converter:"
    echo "  https://cloudconvert.com/ (select WAV to MP3)"
    echo ""
    exit 1
fi

echo "Converting bikes.wav to bikes.mp3..."
ffmpeg -i "$ASSETS_DIR/bikes.wav" -q:a 5 "$ASSETS_DIR/bikes.mp3" -y 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ bikes.mp3 created"
    rm "$ASSETS_DIR/bikes.wav"
else
    echo "✗ Failed to convert bikes.wav"
fi

echo ""
echo "Converting seaplanes.wav to seaplanes.mp3..."
ffmpeg -i "$ASSETS_DIR/seaplanes.wav" -q:a 5 "$ASSETS_DIR/seaplanes.mp3" -y 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ seaplanes.mp3 created"
    rm "$ASSETS_DIR/seaplanes.wav"
else
    echo "✗ Failed to convert seaplanes.wav"
fi

echo ""
echo "Conversion complete!"
ls -lh "$ASSETS_DIR"/*.mp3
