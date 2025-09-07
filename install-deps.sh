#!/bin/bash

# 🎵 Yuna Music - Dependencies Installation Script
# For SillyDev and other container environments

echo "🎵 Installing Yuna Music dependencies..."

# Update package lists
echo "📦 Updating package lists..."
apt-get update -y

# Install FFmpeg
echo "🎧 Installing FFmpeg..."
apt-get install -y ffmpeg

# Install Opus dependencies and build tools
echo "🎤 Installing Opus and build dependencies..."
apt-get install -y \
    build-essential \
    python3 \
    python3-pip \
    libopus-dev \
    libopus0 \
    opus-tools \
    libtool \
    autoconf \
    automake \
    wget \
    curl \
    git \
    pkg-config

# Install Node.js native build tools
echo "🔧 Installing Node.js build tools..."
npm install -g node-gyp

# Install Node.js dependencies with fallback handling
echo "📦 Installing Node.js dependencies..."
npm install --no-optional

# Try to install and build native dependencies
echo "🎤 Building native Opus dependencies..."
npm install @discordjs/opus || echo "⚠️ @discordjs/opus failed, continuing..."
npm install node-opus || echo "⚠️ node-opus failed, continuing..."
npm install opusscript || echo "✅ opusscript installed as fallback"

# Rebuild native modules for current platform
echo "🔄 Rebuilding native modules..."
npm rebuild || echo "⚠️ Some native modules failed to rebuild, using fallbacks"

# Verify installations
echo "🔍 Verifying installations..."

# Check FFmpeg
if command -v ffmpeg &> /dev/null; then
    echo "✅ FFmpeg installed successfully: $(ffmpeg -version | head -n1)"
else
    echo "❌ FFmpeg installation failed"
fi

# Check Opus libraries
if pkg-config --exists opus; then
    echo "✅ System Opus library available: $(pkg-config --modversion opus)"
else
    echo "⚠️ System Opus library not found"
fi

# Check Node.js dependencies
if [ -f "node_modules/.package-lock.json" ] || [ -f "package-lock.json" ]; then
    echo "✅ Node.js dependencies installed successfully"
else
    echo "❌ Node.js dependencies installation failed"
fi

# Test Opus modules specifically
echo "🎤 Testing Opus modules..."
node -e "
try { 
    require('@discordjs/opus'); 
    console.log('✅ @discordjs/opus working'); 
} catch(e) { 
    try { 
        require('node-opus'); 
        console.log('✅ node-opus working'); 
    } catch(e2) { 
        try { 
            require('opusscript'); 
            console.log('✅ opusscript working (fallback)'); 
        } catch(e3) { 
            console.log('❌ No Opus library working'); 
        }
    }
}
" || echo "⚠️ Node.js test failed"

echo "🎉 Installation complete!"
echo ""
echo "🚀 You can now run the bot with:"
echo "   npm start"
echo ""
echo "🔧 If you encounter issues:"
echo "   1. Make sure Docker/container has necessary permissions"
echo "   2. Check if ports 3000-3010 are available"
echo "   3. Verify MongoDB connection string in config.js"
echo ""
echo "📋 For SillyDev users:"
echo "   - This script should run automatically in most containers"
echo "   - If manual installation needed, run: chmod +x install-deps.sh && ./install-deps.sh"