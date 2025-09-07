// 🎵 Yuna Music - Web Server for SillyDev Health Checks
// Provides HTTP endpoint for platform monitoring

const express = require('express');
const path = require('path');

function createWebServer(client) {
    const app = express();
    const port = process.env.PORT || 3000;
    
    // Basic middleware
    app.use(express.json());
    app.use(express.static('public'));
    
    // Health check endpoint for SillyDev
    app.get('/', (req, res) => {
        res.json({
            name: "🎵 Yuna Music Bot",
            status: "online",
            platform: process.env.PLATFORM || "unknown",
            uptime: Math.floor(process.uptime()),
            guilds: client.guilds ? client.guilds.cache.size : 0,
            users: client.users ? client.users.cache.size : 0,
            timestamp: new Date().toISOString(),
            version: require('./package.json').version
        });
    });
    
    // Status endpoint
    app.get('/status', (req, res) => {
        const status = {
            bot: {
                ready: client.isReady(),
                guilds: client.guilds ? client.guilds.cache.size : 0,
                users: client.users ? client.users.cache.size : 0,
                uptime: Math.floor(process.uptime())
            },
            system: {
                platform: process.platform,
                nodeVersion: process.version,
                memory: process.memoryUsage(),
                environment: process.env.NODE_ENV || 'development'
            },
            audio: {
                engine: process.env.OPUS_ENGINE || 'auto',
                quality: process.env.AUDIO_QUALITY || 'medium'
            }
        };
        
        res.json(status);
    });
    
    // Music player status
    app.get('/player', (req, res) => {
        if (!client.player) {
            return res.json({ error: 'Player not initialized' });
        }
        
        const queues = client.player.queues.map(queue => ({
            guildId: queue.id,
            playing: queue.playing,
            songs: queue.songs.length,
            volume: queue.volume,
            currentSong: queue.songs[0] ? {
                name: queue.songs[0].name,
                url: queue.songs[0].url,
                duration: queue.songs[0].formattedDuration
            } : null
        }));
        
        res.json({
            activeQueues: queues.length,
            totalSongs: queues.reduce((total, queue) => total + queue.songs, 0),
            queues: queues
        });
    });
    
    // Simple dashboard (optional)
    app.get('/dashboard', (req, res) => {
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>🎵 Yuna Music Dashboard</title>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    background: linear-gradient(135deg, #ff66cc, #cc66ff);
                    color: white; 
                    padding: 20px;
                    text-align: center;
                }
                .container { 
                    max-width: 800px; 
                    margin: 0 auto; 
                    background: rgba(0,0,0,0.3); 
                    padding: 30px; 
                    border-radius: 15px; 
                }
                .status { 
                    display: inline-block; 
                    padding: 10px 20px; 
                    background: rgba(255,255,255,0.2); 
                    border-radius: 25px; 
                    margin: 10px; 
                }
                .online { background: rgba(0,255,0,0.3); }
                .offline { background: rgba(255,0,0,0.3); }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎵 Yuna Music Bot</h1>
                <p>Professional Discord Music Bot</p>
                
                <div class="status ${client.isReady() ? 'online' : 'offline'}">
                    Status: ${client.isReady() ? '🟢 Online' : '🔴 Offline'}
                </div>
                
                <div class="status">
                    🏠 Servers: ${client.guilds ? client.guilds.cache.size : 0}
                </div>
                
                <div class="status">
                    👥 Users: ${client.users ? client.users.cache.size : 0}
                </div>
                
                <div class="status">
                    ⏱️ Uptime: ${Math.floor(process.uptime())}s
                </div>
                
                <div class="status">
                    🌐 Platform: ${process.env.PLATFORM || 'Unknown'}
                </div>
                
                <br><br>
                <p>🎶 Beautiful pink-purple themed music bot</p>
                <p>🌍 Vietnamese & English support</p>
                <p>🚀 Optimized for SillyDev.co.uk</p>
                
                <br>
                <small>Last updated: ${new Date().toISOString()}</small>
            </div>
            
            <script>
                // Auto-refresh every 30 seconds
                setTimeout(() => location.reload(), 30000);
            </script>
        </body>
        </html>
        `;
        res.send(html);
    });
    
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({ 
            error: 'Endpoint not found',
            available: ['/', '/status', '/player', '/dashboard']
        });
    });
    
    // Start server
    const server = app.listen(port, () => {
        console.log(`🌐 Web server running on port ${port}`);
        console.log(`🔍 Health check: http://localhost:${port}/`);
        console.log(`📊 Dashboard: http://localhost:${port}/dashboard`);
        
        if (process.env.PLATFORM === 'sillydev') {
            console.log('🚀 SillyDev health checks enabled');
        }
    });
    
    return server;
}

module.exports = createWebServer;