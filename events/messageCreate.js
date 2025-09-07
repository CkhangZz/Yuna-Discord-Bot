const config = require("../config.js");
const db = require("../mongoDB");

// Prefix command mappings
const prefixCommands = {
    'p': 'play',
    'play': 'play', 
    'h': 'help',
    'help': 'help',
    'q': 'queue',
    'queue': 'queue',
    'skip': 'skip',
    's': 'skip',
    'stop': 'stop',
    'pause': 'pause',
    'resume': 'resume',
    'r': 'resume',
    'vol': 'volume',
    'v': 'volume',
    'volume': 'volume',
    'loop': 'loop',
    'l': 'loop',
    'shuffle': 'shuffle',
    'sh': 'shuffle',
    'np': 'nowplaying',
    'nowplaying': 'nowplaying',
    'clear': 'clear',
    'c': 'clear',
    'back': 'back',
    'b': 'back',
    'seek': 'seek',
    'filter': 'filter',
    'f': 'filter',
    'autoplay': 'autoplay',
    'ap': 'autoplay',
    'playlist': 'playlist',
    'pl': 'playlist',
    'save': 'save',
    'search': 'search',
    'ping': 'ping',
    'time': 'time',
    't': 'time',
    'dj': 'dj',
    'channel': 'channel',
    'ch': 'channel',
    'language': 'language',
    'lang': 'language',
    'servers': 'servers'
};

module.exports = async (client, token, message) => {
    if (!message.guild || message.author.bot) return;
    
    const prefix = '!';
    if (!message.content.startsWith(prefix)) return;
    
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    
    if (!commandName || !prefixCommands[commandName]) return;
    
    const actualCommand = prefixCommands[commandName];
    
    try {
        // Find the actual command file
        const commandFile = require(`../commands/${actualCommand}.js`);
        if (!commandFile) return;
        
        // Check if user is in voice channel for voice commands
        if (commandFile.voiceChannel && !message.member?.voice?.channel) {
            const embed = {
                title: '❌ Lỗi',
                description: 'Bạn cần vào voice channel để sử dụng lệnh này!',
                color: parseInt('FF6B6B', 16),
                footer: {
                    text: '🎶 Yuna Music | Prefix Commands',
                    icon_url: client.user.displayAvatarURL()
                }
            };
            
            return message.reply({ embeds: [embed] }).then(msg => {
                // Auto delete after 10 seconds
                setTimeout(() => {
                    msg.delete().catch(() => {});
                    message.delete().catch(() => {});
                }, 10000);
            });
        }
        
        // Create fake interaction object for compatibility
        const fakeInteraction = {
            guild: message.guild,
            channel: message.channel,
            member: message.member,
            user: message.author,
            commandName: actualCommand,
            options: {
                getString: (name) => {
                    if (name === 'name' && args[0]) {
                        return args.join(' ');
                    }
                    return null;
                },
                getNumber: (name) => {
                    if (name === 'number' && args[0]) {
                        const num = parseInt(args[0]);
                        return isNaN(num) ? null : num;
                    }
                    return null;
                },
                getUser: (name) => null,
                getChannel: (name) => null,
                getRole: (name) => null,
                getBoolean: (name) => null,
                getSubcommand: () => null,
                getInteger: (name) => {
                    if (args[0]) {
                        const num = parseInt(args[0]);
                        return isNaN(num) ? null : num;
                    }
                    return null;
                }
            },
            reply: async (options) => {
                const replyMsg = await message.reply(options);
                
                // Store loading message reference for prefix commands
                if (options.embeds && options.embeds[0]?.title?.includes('Đang tìm nhạc')) {
                    if (!client.prefixLoadingMessages) client.prefixLoadingMessages = new Map();
                    client.prefixLoadingMessages.set(message.guild.id, replyMsg);
                }
                
                // Auto delete logic with different timings
                if (actualCommand === 'help') {
                    // Help gets 30s before deletion
                    setTimeout(() => {
                        replyMsg.delete().catch(() => {});
                        message.delete().catch(() => {});
                    }, 30000);
                } else if (actualCommand !== 'play' && actualCommand !== 'nowplaying') {
                    // Other commands get 15s, play/nowplaying are persistent
                    setTimeout(() => {
                        replyMsg.delete().catch(() => {});
                        message.delete().catch(() => {});
                    }, 15000);
                }
                
                return replyMsg;
            },
            editReply: async (options) => {
                // For prefix commands, we'll just send a new message
                return message.channel.send(options);
            },
            deleteReply: async () => {
                // For prefix commands, delete both original command and any replies
                try {
                    // Find the loading message if it exists
                    const messages = await message.channel.messages.fetch({ limit: 10 });
                    const loadingMessage = messages.find(m => 
                        m.author.id === client.user.id && 
                        m.embeds.length > 0 && 
                        m.embeds[0].title?.includes('Đang tìm nhạc')
                    );
                    if (loadingMessage) {
                        await loadingMessage.delete().catch(() => {});
                    }
                    // Delete original command message
                    await message.delete().catch(() => {});
                } catch (e) {}
            },
            followUp: async (options) => {
                return message.channel.send(options);
            }
        };
        
        // Execute the command
        await commandFile.run(client, fakeInteraction);
        
        // Success indicator
        message.react('✅').catch(() => {});
        
    } catch (error) {
        console.error(`Prefix command error for ${commandName}:`, error);
        
        const errorEmbed = {
            title: '❌ Lỗi lệnh',
            description: `Không thể thực hiện lệnh \`!${commandName}\`\n\n💡 **Gợi ý:**\n• Thử lại sau vài giây\n• Dùng lệnh slash \`/${actualCommand}\` thay thế`,
            color: parseInt('FF6B6B', 16),
            footer: {
                text: '🎶 Yuna Music | Prefix Commands',
                icon_url: client.user.displayAvatarURL()
            }
        };
        
        message.reply({ embeds: [errorEmbed] }).then(msg => {
            setTimeout(() => {
                msg.delete().catch(() => {});
                message.delete().catch(() => {});
            }, 10000);
        });
    }
};
