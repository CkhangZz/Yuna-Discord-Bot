# 🎵 Yuna Music - SillyDev.co.uk Ready!

<div align="center">
  <img src="https://i.imgur.com/XVAWVCw.png" alt="Yuna Music Bot" width="200"/>
  
  [![SillyDev Ready](https://img.shields.io/badge/SillyDev-Ready-green.svg)](https://sillydev.co.uk)
  [![Discord.js](https://img.shields.io/badge/discord.js-v14.18.0-blue.svg)](https://discord.js.org)
  [![Node.js](https://img.shields.io/badge/node.js-20.x-green.svg)](https://nodejs.org)
  [![Container](https://img.shields.io/badge/Container-Optimized-blue.svg)](https://docker.com)
  
  **🎨 Professional Discord Music Bot with Pink-Purple Theme**
  
  *Fully optimized for SillyDev.co.uk deployment*
</div>

---

## 🚀 **One-Click Deploy on SillyDev**

### **Method 1: GitHub Deploy (Recommended)**
1. **Fork** this repository to your GitHub account
2. **Login** to [SillyDev Dashboard](https://sillydev.co.uk)
3. **Create New App** → Connect your forked repository
4. **Set Environment Variables** (see below)
5. **Deploy** → Automatic build & deployment

### **Method 2: Manual Upload**
1. **Download** this repository
2. **Upload** to SillyDev via dashboard
3. **Configure** environment variables
4. **Deploy** with one click

---

## ⚙️ **Required Environment Variables**

Copy these to your SillyDev environment settings:

```env
# 🤖 Discord Bot (Required)
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_bot_client_id_here
OWNER_ID=your_discord_user_id

# 🗄️ Database (Required - use MongoDB Atlas)
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/yuna-music?retryWrites=true&w=majority

# 🌐 SillyDev Platform
PLATFORM=sillydev
NODE_ENV=production
CONTAINER_MODE=true

# 🎵 Bot Configuration
LANGUAGE=vi
BOT_STATUS=/play | /help
EMBED_COLOR=ff66cc

# 🔊 Audio Settings (Optimized)
AUDIO_QUALITY=medium
BUFFER_SIZE=2048
OPUS_ENGINE=opusscript

# 📊 Optional: Top.gg Integration
TOPGG_ENABLED=false
TOPGG_API_KEY=your_topgg_api_key
```

---

## 📋 **Prerequisites Setup**

### **1️⃣ Discord Bot Setup**
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. **New Application** → Name: "Yuna Music"
3. **Bot** → Reset Token → **Copy token** 
4. **Bot** → Enable intents:
   - ✅ Presence Intent
   - ✅ Server Members Intent
   - ✅ Message Content Intent
5. **OAuth2** → URL Generator → Copy invite URL

### **2️⃣ MongoDB Atlas (Free)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas/database)
2. **Create** free account & cluster
3. **Database Access** → Add user with password
4. **Network Access** → Allow all IPs (0.0.0.0/0)
5. **Connect** → Get connection string

---

## 🎯 **SillyDev Build Settings**

### **Build Configuration:**
```bash
📦 Build Command: npm run sillydev-setup
🚀 Start Command: npm start
🔧 Node Version: 20.x
💾 Memory: 512MB (minimum)
🏗️ Auto Deploy: Enable (GitHub)
```

### **Health Check:**
- **URL:** `/`
- **Interval:** 30 seconds
- **Timeout:** 10 seconds

---

## ✅ **Features Ready for SillyDev**

### **🎵 Music Features:**
- ✅ YouTube, Spotify, SoundCloud support
- ✅ Queue management with beautiful embeds
- ✅ Volume control, loop, shuffle
- ✅ Smart autoplay system
- ✅ Auto-cleanup messages
- ✅ Slash commands + buttons
- ✅ Vietnamese + English support

### **🚀 SillyDev Optimizations:**
- ✅ Container-optimized audio engine
- ✅ Memory-efficient configuration
- ✅ Fast startup with dependency caching
- ✅ Built-in health monitoring
- ✅ Auto-restart on errors
- ✅ Zero-warning console output

---

## 📊 **Expected Performance**

```bash
🚀 Startup Time: ~30-60 seconds
💾 Memory Usage: ~200-400MB
⚡ Response Time: <500ms
🎵 Audio Quality: High (opusscript)
🔄 Uptime: 99.9% with auto-restart
👥 Concurrent Users: 100+ per guild
🏠 Server Capacity: 50+ guilds
```

---

## 🔍 **Monitoring & Logs**

### **Health Check Endpoints:**
- `GET /` - Basic health status
- `GET /status` - Detailed system info
- `GET /player` - Music player status
- `GET /dashboard` - Visual dashboard

### **SillyDev Dashboard:**
- 📊 Real-time resource monitoring
- 📝 Application logs with filtering
- ⚡ Performance metrics
- 🔄 Restart controls
- 📈 Usage statistics

---

## 🛠️ **Troubleshooting**

### **❌ Bot Not Starting:**
```bash
✅ Check environment variables are set
✅ Verify Discord token validity
✅ Ensure MongoDB Atlas access (0.0.0.0/0)
✅ Check SillyDev resource limits
```

### **❌ Audio Issues:**
```bash
ℹ️  Normal - using opusscript (JavaScript engine)
ℹ️  Provides good audio quality for containers
ℹ️  No additional setup needed
```

### **❌ Memory Issues:**
```bash
✅ Monitor SillyDev dashboard
✅ Consider upgrading plan for higher traffic
✅ Bot auto-optimizes memory usage
```

---

## 📞 **Support & Community**

- 🔗 [SillyDev Support](https://sillydev.co.uk/support)
- 💬 [Discord Support Server](https://discord.gg/w9M6YBWdSk)
- 📖 [Full Documentation](./SILLYDEV_GUIDE.md)
- 🐛 [Report Issues](https://github.com/your-username/yuna-music/issues)
- 📊 [Bot Statistics](https://top.gg/bot/your-bot-id)

---

## 🎊 **Deployment Success!**

Once deployed, your Yuna Music bot will:

- 🤖 **Start automatically** with zero configuration
- 🎵 **Play high-quality music** from multiple sources
- 🎨 **Display beautiful pink-purple embeds** 
- 🌍 **Support Vietnamese & English** languages
- 📱 **Work seamlessly** with slash commands
- 🛡️ **Handle errors gracefully** with auto-recovery
- 📊 **Provide health monitoring** for SillyDev
- ⚡ **Scale automatically** based on usage

---

<div align="center">

### **🎵 Professional Discord Music Bot Ready for SillyDev! 🎵**

[![Deploy to SillyDev](https://img.shields.io/badge/Deploy-SillyDev.co.uk-green?style=for-the-badge)](https://sillydev.co.uk)

*Beautiful • Reliable • Container-Optimized • SillyDev-Ready*

</div>