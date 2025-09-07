# 🚀 SillyDev Deployment Guide

![Yuna Music](https://img.shields.io/badge/Yuna%20Music-SillyDev%20Ready-ff66cc?style=for-the-badge&logo=docker)
![Status](https://img.shields.io/badge/Deployment-READY-00FF00?style=for-the-badge)

> **🎵 Complete guide for deploying Yuna Music on SillyDev platform**

---

## 📋 **Quick Start**

### **🔥 Option 1: Container Deploy (Recommended for SillyDev)**
```bash
# 1. Clone repository
git clone https://github.com/your-repo/yuna-music.git
cd yuna-music

# 2. Configure environment
cp .env.example .env
# Edit .env with your values

# 3. Container setup (fixes all dependencies)
npm run container-setup

# 4. Start the bot
npm start
```

### **🔥 Option 1B: Quick Deploy (Alternative)**
```bash
# 1. Clone repository  
git clone https://github.com/your-repo/yuna-music.git
cd yuna-music

# 2. Install dependencies  
npm run setup

# 3. Configure environment
cp .env.example .env
# Edit .env with your values

# 4. Start the bot
npm start
```

### **🐳 Option 2: Docker Deploy**
```bash
# 1. Build and run with Docker Compose
docker-compose up -d

# 2. Check logs
docker-compose logs -f yuna-music

# 3. Stop when needed
docker-compose down
```

---

## 🔧 **Configuration Steps**

### **1️⃣ Discord Bot Setup**
```bash
1. Go to https://discord.com/developers/applications
2. Create new application → "Yuna Music"
3. Go to "Bot" section
4. Create bot and copy token
5. Enable these intents:
   ✅ SERVER MEMBERS INTENT
   ✅ MESSAGE CONTENT INTENT  
6. Go to OAuth2 → URL Generator:
   ✅ bot
   ✅ applications.commands
   ✅ Administrator (or specific permissions)
```

### **2️⃣ MongoDB Setup**
```bash
Option A - MongoDB Atlas (Recommended):
1. Go to https://mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Get connection string
5. Add to .env file

Option B - SillyDev MongoDB:
1. Use SillyDev's MongoDB service if available
2. Get connection details from SillyDev dashboard
```

### **3️⃣ Environment Configuration**
```bash
# Copy template and edit
cp .env.example .env

# Required values:
DISCORD_TOKEN=your_bot_token_here
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/database
OWNER_ID=your_discord_id

# Optional but recommended:
LANGUAGE=vi                    # or 'en' for English
BOT_PREFIX=!
EMBED_COLOR=ff66cc
```

---

## 🐛 **Troubleshooting**

### **❓ Common Issues & Solutions**

#### **🔧 FFmpeg Not Found**
```bash
Error: ffmpeg is not installed at '/home/container/...' path

Solutions:
1. Run: npm run install-deps
2. Or manually: apt-get update && apt-get install -y ffmpeg
3. Check: npm run check-ffmpeg
```

#### **🎤 Opus Library Issues**
```bash
Error: Cannot find module '@discordjs/opus/prebuild/...opus.node'
Error: Cannot find module 'node-opus'
Error: Cannot find module 'opusscript'

Solutions:
1. Container fix (Recommended): npm run fix-opus
2. Full dependency install: npm run install-deps  
3. Container setup: npm run container-setup
4. Manual install:
   apt-get install -y libopus-dev build-essential
   npm rebuild @discordjs/opus node-opus
   npm install opusscript
5. Check status: npm run check-opus
6. Force rebuild: npm run rebuild

Note: Bot will auto-fallback to working Opus library
✅ Container environments: Automatic fallback to opusscript
✅ Native environments: Tries @discordjs/opus → node-opus → opusscript  
Performance: @discordjs/opus > node-opus > opusscript
```

#### **🔧 Ready Event Warning**  
```bash
Warning: The ready event has been renamed to clientReady

✅ FIXED: This warning is already resolved in latest version
- Old ready.js file removed
- Using clientReady.js instead
```

#### **🔧 MongoDB Connection Failed**
```bash
Error: MongoNetworkError: failed to connect

Solutions:
1. Check MongoDB URL format
2. Verify database user permissions  
3. Whitelist SillyDev IP addresses
4. Test connection: npm run test
```

#### **🔧 Bot Not Responding**
```bash
Bot online but commands not working

Solutions:
1. Check bot permissions in Discord server
2. Verify application commands loaded: /help
3. Check prefix commands: !help
4. Review bot logs for errors
```

#### **🔧 Voice Channel Issues**
```bash
Bot can't join voice channels

Solutions:
1. Check voice permissions:
   ✅ Connect, Speak, Use Voice Activity
2. Try different voice channel
3. Check voice region compatibility
4. Verify bot is not deafened/muted
```

### **🛠️ Diagnostic Commands**
```bash
# Test configuration
npm run test

# Check FFmpeg installation
npm run check-ffmpeg  

# Check Opus libraries
npm run check-opus

# Run full diagnostics (all tests)
npm run diagnose

# Rebuild native dependencies
npm run rebuild

# Fix Opus libraries (container-specific)
npm run fix-opus

# Full container setup (comprehensive fix)
npm run container-setup

# Run with debug info and warnings
npm run dev

# Check container logs (Docker)
docker logs yuna-music-bot

# Interactive container access
docker exec -it yuna-music-bot bash
```

---

## 📊 **SillyDev Specific Instructions**

### **🔥 Container Settings**
```yaml
# Recommended SillyDev configuration:
Memory: 1GB (minimum 512MB)
CPU: 0.5 cores (minimum 0.25)
Disk: 2GB (for logs and cache)
Node Version: 18.x or higher
```

### **🌐 Network Configuration**
```bash
# No external ports needed for basic functionality
# Optional: Port 3000 for web dashboard (if implemented)

# Outbound connections needed:
- Discord API: *.discord.com
- YouTube API: *.youtube.com, *.googleapis.com  
- Spotify API: *.spotify.com
- MongoDB: Your MongoDB cluster
```

### **📁 Persistent Storage**
```bash
# Recommended mount points:
/app/logs     → Bot operation logs
/app/data     → Cache and temporary files
/app/.env     → Environment configuration

# Files that should persist:
- .env (configuration)
- logs/ (for debugging)
- data/ (cache and user data)
```

### **🔄 Auto-Restart Configuration**
```bash
# SillyDev restart policy:
Restart Policy: unless-stopped
Health Check: npm run test
Health Interval: 30s
Health Timeout: 10s
Health Retries: 3
```

---

## ⚡ **Performance Optimization**

### **🎯 SillyDev Optimization Settings**
```bash
# Environment variables for better performance:
NODE_ENV=production
NODE_OPTIONS=--max-old-space-size=1024

# Memory usage optimization:
- Limit concurrent downloads: 3
- Auto-cleanup old files: enabled
- Message auto-delete: enabled
- Cache optimization: enabled
```

### **📈 Monitoring**
```bash
# Key metrics to monitor:
- Memory usage: <800MB normal
- CPU usage: <50% normal  
- Discord API latency: <200ms
- Voice connection stability: >95%
- Command response time: <500ms
```

---

## 🎵 **Feature Testing Checklist**

### **✅ Basic Functionality**
```bash
□ Bot comes online
□ Responds to /help command
□ Responds to !help prefix
□ Shows proper embed colors (pink-purple)
□ Multi-language working (Vietnamese/English)
```

### **✅ Music Playback**
```bash
□ /play [song] works
□ !p [song] works  
□ YouTube playback
□ Spotify playback
□ SoundCloud playback
□ Voice quality is good
```

### **✅ Advanced Features**
```bash
□ /autoplay toggle works
□ Queue management (/skip, /clear, etc.)
□ Playlist system (/playlist create, save, etc.)
□ Search with selection (/search)
□ Volume control (/volume)
□ Loading messages auto-delete
```

### **✅ Error Handling**
```bash
□ Invalid commands show helpful errors
□ Network issues handled gracefully  
□ Voice disconnection recovery
□ Rate limiting handled properly
□ Memory leaks prevented
```

---

## 🎉 **Success Verification**

### **🎵 Your bot is working correctly if:**
```bash
✅ Bot shows online in Discord
✅ Commands respond within 1 second
✅ Music plays without interruption
✅ Loading messages disappear automatically
✅ Embeds show beautiful pink-purple colors
✅ Both slash (/) and prefix (!) commands work
✅ Autoplay continues music seamlessly
✅ No error warnings in console
✅ Memory usage stays under 800MB
✅ Voice quality is crystal clear
```

---

## 📞 **Support**

### **🔧 If You Need Help:**
```bash
1. Check logs: docker logs yuna-music-bot
2. Run diagnostics: npm run diagnose
3. Review this guide: SILLYDEV_DEPLOYMENT.md
4. Check main documentation: CHANGELOG_FIXES.md
5. Contact support with:
   - SillyDev container logs
   - Bot configuration (hide tokens!)  
   - Error messages
   - Steps to reproduce issue
```

### **📋 Common Support Info Needed:**
```bash
- SillyDev platform details
- Node.js version: node --version
- Bot version: check package.json
- Error messages: full stack trace
- Configuration: .env values (hide sensitive data)
```

---

## 🚀 **Deployment Complete!**

**🎵 Congratulations! Yuna Music is now running on SillyDev! 🎉**

### **🎮 Quick Test Commands:**
```bash
/play Despacito          # Test music playback
/autoplay               # Test autoplay system  
/help                   # Test command system
!p shape of you         # Test prefix commands
/search anime music     # Test search system
```

### **🌟 Enjoy Features:**
- ⚡ **Lightning fast** response times
- 🎵 **High quality** music from multiple sources  
- 🤖 **Smart autoplay** finds related songs
- 💬 **Clean interface** with auto-deleting messages
- 🌐 **Multi-language** support (Vietnamese + English)
- 🎨 **Beautiful embeds** with Yuna's signature pink-purple theme

---

<div align="center">

### 💖 Yuna Music - SillyDev Ready!

**📅 Deployment Guide Version:** 1.0.1  
**🌟 Status:** Production Ready  
**🎵 Platform:** SillyDev Compatible  

*Made with 💝 for the SillyDev community!*

</div>