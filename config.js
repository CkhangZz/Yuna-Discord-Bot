// 🎵 Yuna Music - Dynamic Configuration for SillyDev.co.uk
// Automatically loads from environment variables for secure deployment

module.exports = {
    // Discord Bot Configuration - loads from environment variables
    TOKENS: [process.env.DISCORD_TOKEN || ""],
    ownerID: process.env.OWNER_ID ? [process.env.OWNER_ID] : ["your_discord_user_id"], 
    botInvite: process.env.BOT_INVITE || ``,
    supportServer: process.env.SUPPORT_SERVER || "https://discord.gg/w9M6YBWdSk",
    
    // Database Configuration - MUST use environment variables for SillyDev
    mongodbURL: process.env.MONGODB_URL || "",
    
    // Bot Settings - customizable via environment
    status: process.env.BOT_STATUS || '/play',
    commandsDir: './commands',
    language: process.env.LANGUAGE || "vi", // vi (Vietnamese) or en (English)
    embedColor: process.env.EMBED_COLOR || "ff66cc", // pink-purple color for Yuna Music
    errorLog: process.env.ERROR_LOG_CHANNEL_ID || "",
    
    // SillyDev Platform Detection
    platform: process.env.PLATFORM || "local",
    containerMode: process.env.CONTAINER_MODE === "true" || false,
    port: process.env.PORT || 3000,


    playlistSettings: {
        maxPlaylist: 10, //max playlist count
        maxMusic: 75, //max music count
    },


    opt: {
        DJ: {
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle']
        },

        // Voice Configuration - optimized for SillyDev containers
        voiceConfig: {
            leaveOnFinish: process.env.LEAVE_ON_FINISH === "true" || true,
            leaveOnStop: process.env.LEAVE_ON_STOP === "true" || true,

            leaveOnEmpty: {
                status: process.env.LEAVE_ON_EMPTY === "true" || true,
                cooldown: parseInt(process.env.EMPTY_COOLDOWN) || 600000, // 10 minutes default
            },
        },

        maxVol: parseInt(process.env.MAX_VOLUME) || 200,
        
        // SillyDev Optimization Settings
        audioQuality: process.env.AUDIO_QUALITY || "medium",
        bufferSize: parseInt(process.env.BUFFER_SIZE) || 2048,
        opusEngine: process.env.OPUS_ENGINE || "opusscript",
    },

    // Sponsor Settings
    sponsor: {
        status: process.env.SPONSOR_ENABLED === "true" || false,
        url: process.env.SPONSOR_URL || "",
    },

    // Top.gg Vote Manager Configuration
    voteManager: {
        status: process.env.TOPGG_ENABLED === "true" || false,
        api_key: process.env.TOPGG_API_KEY || "",
        vote_commands: ["back", "channel", "clear", "dj", "filter", "loop", "nowplaying", "pause", "play", "playlist", "queue", "resume", "save", "search", "skip", "stop", "time", "volume"],
        vote_url: `https://top.gg/bot/${process.env.CLIENT_ID}/vote`,
    },


    shardManager: {
        shardStatus: false //If your bot exists on more than 1000 servers, change this part to true.
    },


}
