# 🎵 Yuna Music - SillyDev.co.uk Deployment Guide

## 🌟 **Quick Deploy on SillyDev.co.uk**

### **📋 Prerequisites**
- SillyDev.co.uk account
- Discord bot token ([Discord Developer Portal](https://discord.com/developers/applications))
- MongoDB Atlas account (free tier available)
- GitHub repository with your bot code

---

## 🚀 **Step 1: Setup MongoDB Atlas (Free)**

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. Create free account and new cluster
3. **Database Access** → Add new user with username/password
4. **Network Access** → Allow access from anywhere (0.0.0.0/0)
5. **Connect** → Get connection string:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/yuna-music?retryWrites=true&w=majority
   ```

---

## 🎮 **Step 2: Setup Discord Bot**

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → Name: "Yuna Music"
3. **Bot** → Reset Token → Copy token (keep safe!)
4. **Bot** → Enable these intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent  
   - ✅ Message Content Intent
5. **OAuth2** → URL Generator:
   - **Scopes:** `bot` + `applications.commands`
   - **Permissions:** Administrator (or specific permissions)
   - Copy invite URL

---

## 🌐 **Step 3: Deploy on SillyDev.co.uk**

### **Option A: Direct GitHub Deploy**
1. Push code to GitHub repository
2. Login to [SillyDev Dashboard](https://sillydev.co.uk)
3. **Create New App** → Connect GitHub repo
4. **Settings** → Environment Variables:

```env
# Discord Configuration
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here
OWNER_ID=your_discord_user_id

# Database (MongoDB Atlas)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/yuna-music?retryWrites=true&w=majority

# SillyDev Optimization
PLATFORM=sillydev
NODE_ENV=production
CONTAINER_MODE=true

# Bot Settings
LANGUAGE=vi
BOT_STATUS=/play | /help
EMBED_COLOR=ff66cc

# Voice Settings
LEAVE_ON_FINISH=true
LEAVE_ON_STOP=true
LEAVE_ON_EMPTY=false
EMPTY_COOLDOWN=600000
MAX_VOLUME=200

# Audio Quality (optimized for containers)
AUDIO_QUALITY=medium
BUFFER_SIZE=2048
OPUS_ENGINE=opusscript

# Optional: Top.gg Integration
TOPGG_ENABLED=false
TOPGG_API_KEY=your_topgg_api_key
```

5. **Build Settings:**
   - **Build Command:** `npm run sillydev-setup`
   - **Start Command:** `npm start`
   - **Node Version:** 20.x

6. **Deploy** → Wait for build completion

---

### **Option B: Manual Upload**
1. Download/clone repository
2. Upload to SillyDev via dashboard
3. Follow same environment variable setup as Option A

---

## ✅ **Step 4: Verification**

### **Check Logs:**
```bash
🎵 Starting Yuna Music with enhanced error handling...
🌐 SillyDev mode: Yes
🔧 Container mode: Yes  
🚀 SillyDev.co.uk optimizations enabled
✅ DisTube player initialized successfully
🎵 Audio engine: opusscript (SillyDev optimized)
🔊 Audio quality: Medium (container optimized)
✅ Connected MongoDB
🤖 Yuna Music is ready! Invite bot to servers.
```

### **Test Bot:**
1. Invite bot to Discord server using invite URL
2. Try commands: `/play`, `/help`, `/ping`
3. Test voice functionality in voice channel

---

## 🛠️ **Troubleshooting**

### **❌ Bot Not Starting:**
```bash
# Check environment variables are set correctly
# Verify Discord token is valid
# Ensure MongoDB URL is accessible
```

### **❌ Cannot Connect to MongoDB:**
```bash
# Check MongoDB Atlas network access (allow 0.0.0.0/0)
# Verify username/password in connection string
# Test connection string format
```

### **❌ Audio Not Working:**
```bash
# This is normal - opusscript provides basic audio functionality
# For better performance, native Opus libraries needed (complex setup)
# Current setup works for most music bot needs
```

### **❌ Bot Crashes/Restarts:**
```bash
# Check SillyDev resource limits
# Monitor memory usage in dashboard
# Upgrade plan if needed for higher traffic
```

---

## ⚙️ **SillyDev Configuration**

### **Recommended Settings:**
```bash
📦 Runtime: Node.js 20.x
💾 Memory: 512MB minimum (1GB recommended)  
🔄 Auto-restart: Enabled
📊 Health checks: Enabled
⏱️ Build timeout: 15 minutes
🌍 Region: Choose closest to users
```

### **Scaling Options:**
```bash
🔹 Starter Plan: Good for small servers (<10 guilds)
🔹 Pro Plan: Recommended for medium servers (10-50 guilds)  
🔹 Business Plan: For large servers (50+ guilds)
```

---

## 📊 **Performance Optimization**

### **Container-Optimized Settings:**
```env
# Audio quality balanced for performance/quality
AUDIO_QUALITY=medium
BUFFER_SIZE=2048

# Voice settings optimized for containers
LEAVE_ON_FINISH=true
LEAVE_ON_STOP=true
EMPTY_COOLDOWN=600000

# Resource management
MAX_VOLUME=200
```

### **Memory Management:**
- Bot automatically optimizes for container environment
- Cleanup systems prevent memory leaks
- Auto-restart on critical errors

---

## 🎵 **Features Available:**

### **✅ Working Features:**
- 🎶 Play music from YouTube, Spotify, SoundCloud
- 🎚️ Volume control, queue management
- 🔄 Loop, shuffle, skip controls
- 📱 Slash commands + button controls
- 🎨 Beautiful pink-purple embeds
- 🌐 Vietnamese + English language support
- 📊 Auto-delete messages for clean chat
- 🤖 Smart autoplay system

### **⚡ SillyDev Optimizations:**
- 🔧 Container-specific audio engine
- 💾 Memory-optimized configuration  
- 🚀 Fast startup with dependency caching
- 🛡️ Enhanced error handling
- 📈 Performance monitoring ready
- 🔄 Auto-restart on failures

---

## 🔗 **Useful Links**

- [SillyDev Dashboard](https://sillydev.co.uk)
- [Discord Developer Portal](https://discord.com/developers/applications)
- [MongoDB Atlas](https://www.mongodb.com/atlas/database)
- [Bot Invite URL Generator](https://discordapi.com/permissions.html)
- [Support Server](https://discord.gg/w9M6YBWdSk)

---

## 💡 **Pro Tips**

1. **Use environment variables** - Never hardcode sensitive data
2. **Monitor resource usage** - Check SillyDev dashboard regularly
3. **Set up auto-restart** - Ensures 24/7 uptime
4. **Use MongoDB Atlas** - More reliable than local database
5. **Join support server** - Get help from community
6. **Keep token secure** - Never share publicly
7. **Test before deploy** - Use `npm run diagnose` locally
8. **Monitor logs** - Check for errors in SillyDev dashboard

---

## 🎊 **Deployment Complete!**

Your Yuna Music bot is now running 24/7 on SillyDev.co.uk with:
- ✅ Zero-warning startup
- ✅ Container-optimized performance  
- ✅ Professional Discord music features
- ✅ Beautiful pink-purple interface
- ✅ Multi-language support
- ✅ Automatic error recovery

**🎵 Enjoy your professional Discord music bot! 🎵**