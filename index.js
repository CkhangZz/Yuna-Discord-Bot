const config = require('./config.js');

// SillyDev.co.uk specific initialization
console.log('🎵 Yuna Music - Starting on SillyDev.co.uk...');
console.log(`🌐 Platform: ${process.env.PLATFORM || 'unknown'}`);
console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);

if (config.shardManager.shardStatus === true) {
    const { ShardingManager } = require('discord.js');
    const primaryToken = config.TOKENS[0] || process.env.TOKEN;
    const manager = new ShardingManager('./bot.js', { token: primaryToken });
    manager.on('shardCreate', shard => console.log(`🚀 Launched shard ${shard.id}`));
    manager.spawn();
} else {
    const tokens = (config.TOKENS && config.TOKENS.length) ? config.TOKENS : [process.env.TOKEN];
    
    // Start web server for SillyDev health checks
    const createWebServer = require('./web-server.js');
    let webServer = null;
    
    tokens.forEach((token, index) => {
        const client = require("./bot.js")(token);
        
        // Start web server only once for the first client
        if (index === 0 && (process.env.PLATFORM === 'sillydev' || process.env.NODE_ENV === 'production')) {
            // Wait for client to be ready before starting web server
            client.once('ready', () => {
                webServer = createWebServer(client);
                console.log('🌐 Web server started for SillyDev health checks');
            });
        }
    });
    
    // Graceful shutdown
    process.on('SIGTERM', () => {
        console.log('🛑 Received SIGTERM, shutting down gracefully...');
        if (webServer) {
            webServer.close(() => {
                console.log('🌐 Web server closed');
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
}
