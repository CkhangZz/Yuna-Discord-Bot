module.exports = (token) => {
  const { Client, GatewayIntentBits, Partials } = require("discord.js");
  const { DisTube } = require("distube");
  const { SpotifyPlugin } = require("@distube/spotify");
  const { SoundCloudPlugin } = require("@distube/soundcloud");
  const { YtDlpPlugin } = require("@distube/yt-dlp");
  const config = require("./config.js");
  const fs = require("fs");

  const client = new Client({
    partials: [
      Partials.Channel,    // metin kanalı
      Partials.GuildMember, // sunucu üyeleri
      Partials.User,       // discord kullanıcıları
    ],
    intents: [
      GatewayIntentBits.Guilds,           // sunucu ile ilgili işlemler
      GatewayIntentBits.GuildMembers,     // sunucu üye işlemleri
      GatewayIntentBits.GuildIntegrations,// entegrasyon işlemleri
      GatewayIntentBits.GuildVoiceStates,   // ses kanalı işlemleri
      GatewayIntentBits.GuildMessages,    // guild messages for prefix commands
      GatewayIntentBits.MessageContent,   // message content for prefix commands
    ],
  });

  client.config = config;
  
  // Initialize Opus handler for voice support
  const opusHandler = require('./opus-handler.js');
  
  // Detect and setup Opus libraries
  (async () => {
    const opusAvailable = await opusHandler.detectOpus();
    if (opusAvailable) {
      opusHandler.setupDiscordVoice();
      console.log('🎵 Voice system ready with Opus support');
    } else {
      console.log('⚠️  Voice system will run with reduced performance');
    }
  })();
  
  // Initialize DisTube with Smart FFmpeg configuration
  let ffmpegConfig = {};
  
  try {
    const ffmpegStatic = require('ffmpeg-static');
    const fs = require('fs');
    
    // Check if ffmpeg-static path exists
    if (ffmpegStatic && fs.existsSync(ffmpegStatic)) {
      console.log('✅ Using ffmpeg-static:', ffmpegStatic);
      ffmpegConfig = { path: ffmpegStatic };
    } else {
      console.log('⚠️ ffmpeg-static path not found, trying system ffmpeg...');
      // Try system ffmpeg paths
      const systemPaths = ['/usr/bin/ffmpeg', '/usr/local/bin/ffmpeg', 'ffmpeg'];
      
      for (const path of systemPaths) {
        try {
          if (path === 'ffmpeg' || fs.existsSync(path)) {
            console.log('✅ Using system ffmpeg:', path);
            ffmpegConfig = { path: path };
            break;
          }
        } catch (e) {
          // Continue to next path
        }
      }
    }
  } catch (error) {
    console.log('⚠️ FFmpeg detection failed, using default settings:', error.message);
    // DisTube will use default ffmpeg detection
  }
  
  console.log('🔧 FFmpeg config:', ffmpegConfig);
  
  // Enhanced DisTube configuration for SillyDev and container environments
  const isSillyDev = process.env.PLATFORM === 'sillydev' || process.env.RAILWAY_ENVIRONMENT_NAME;
  const isContainer = process.env.NODE_ENV === 'production' || 
                     fs.existsSync('/home/container') || 
                     fs.existsSync('/.dockerenv') ||
                     isSillyDev;
  
  const distubeConfig = {
    leaveOnStop: config.opt.voiceConfig.leaveOnStop,
    leaveOnFinish: config.opt.voiceConfig.leaveOnFinish,
    leaveOnEmpty: config.opt.voiceConfig.leaveOnEmpty.status,
    emptyCooldown: config.opt.voiceConfig.leaveOnEmpty.cooldown || 60000,
    emitNewSongOnly: true,
    emitAddSongWhenCreatingQueue: false,
    emitAddListWhenCreatingQueue: false,
    nsfw: false,
    searchSongs: 10,
    searchCooldown: 30,
    // Container-specific optimizations
    ...(isContainer && {
      ytdlOptions: {
        quality: 'highestaudio',
        highWaterMark: 1024 * 1024 * 2, // 2MB buffer for containers
        requestOptions: {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          }
        }
      }
    }),
    // Only add ffmpeg config if we found a valid path
    ...(Object.keys(ffmpegConfig).length > 0 && { ffmpeg: ffmpegConfig }),
    plugins: [
      new SpotifyPlugin({
        emitEventsAfterFetching: true
      }),
      new SoundCloudPlugin(),
      new YtDlpPlugin({
        // Suppress child process warnings from yt-dlp
        update: false
      })
    ]
  };
  
  console.log('🎵 Initializing DisTube player...');
  console.log(`🌐 SillyDev mode: ${isSillyDev ? 'Yes' : 'No'}`);
  console.log(`🔧 Container mode: ${isContainer ? 'Yes' : 'No'}`);
  if (isSillyDev) {
    console.log('🚀 SillyDev.co.uk optimizations enabled');
  }
  
  try {
    client.player = new DisTube(client, distubeConfig);
    console.log('✅ DisTube player initialized successfully');
    
    if (isSillyDev) {
      console.log('🎵 Audio engine: opusscript (SillyDev optimized)');
      console.log('🔊 Audio quality: Medium (container optimized)');
    }
  } catch (error) {
    console.error('❌ Failed to initialize DisTube:', error.message);
    throw error;
  }

  const player = client.player;
  client.language = config.language || "en";
  let lang = require(`./languages/${config.language || "en"}.js`);

  // Initialize music message storage for controls
  client.musicMessages = new Map();

  // Set max listeners to prevent warning
  player.setMaxListeners(15);

  // Add debug logging
  player.on('searchResult', (message, result) => {
    console.log(`Search found ${result.length} results for query`);
  });

  player.on('searchNoResult', (message, query) => {
    console.log(`No search results found for: ${query}`);
  });

  fs.readdir("./events", (_err, files) => {
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      const event = require(`./events/${file}`);
      let eventName = file.split(".")[0];
      console.log(`${lang.loadclientevent}: ${eventName}`);
      client.on(eventName, (...args) => event(client, token, ...args));
      delete require.cache[require.resolve(`./events/${file}`)];
    });
  });
  

  fs.readdir("./events/player", (_err, files) => {
    files.forEach((file) => {
      if (!file.endsWith(".js")) return;
      const player_events = require(`./events/player/${file}`);
      let playerName = file.split(".")[0];
      console.log(`${lang.loadevent}: ${playerName}`);
      player.on(playerName, player_events.bind(null, client));
      delete require.cache[require.resolve(`./events/player/${file}`)];
    });
  });

  client.commands = [];
  fs.readdir(config.commandsDir, (err, files) => {
    if (err) throw err;
    files.forEach(async (f) => {
      try {
        if (f.endsWith(".js")) {
          let props = require(`${config.commandsDir}/${f}`);
          client.commands.push({
            name: props.name,
            description: props.description,
            options: props.options,
          });
          console.log(`${lang.loadcmd}: ${props.name}`);
        }
      } catch (err) {
        console.log(err);
      }
    });
  });

  if (token) {
    client.login(token).catch((e) => {
      console.log(lang.error1);
    });
  } else {
    setTimeout(() => {
      console.log(lang.error2);
    }, 2000);
  }

  if (config.mongodbURL || process.env.MONGO) {
    const mongoose = require("mongoose");
    mongoose.connect(config.mongodbURL || process.env.MONGO).then(async () => {
      console.log(`✅ Connected MongoDB`);
    }).catch((err) => {
      console.log("❌ MongoDB Error: " + err + "\n\n" + lang.error4);
    });
  } else {
    console.log("⚠️ " + lang.error4);
  }

  return client;
};
