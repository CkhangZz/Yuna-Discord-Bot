const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const db = require("../mongoDB");

// Detailed command information
const getCommandDetails = (command) => {
    const commands = {
        // Information Commands
        'ping': {
            name: 'ping',
            description: 'Check bot latency and response time',
            usage: '/ping',
            example: '/ping',
            category: 'info',
            permissions: 'None',
            cooldown: '3 seconds'
        },
        'bot-statistic': {
            name: 'bot-statistic', 
            description: 'View bot statistics and information',
            usage: '/bot-statistic',
            example: '/bot-statistic',
            category: 'info',
            permissions: 'None',
            cooldown: '5 seconds'
        },
        'servers': {
            name: 'servers',
            description: 'View server count and bot presence',
            usage: '/servers', 
            example: '/servers',
            category: 'info',
            permissions: 'Administrator',
            cooldown: '10 seconds'
        },
        
        // Music Commands
        'play': {
            name: 'play',
            description: 'Play music from various sources',
            usage: '/play <normal|playlist> <name/url>',
            example: '/play normal Shape of You\n/play playlist My Songs',
            category: 'music',
            permissions: 'None',
            cooldown: '2 seconds',
            extra: 'Supports: YouTube, Spotify, SoundCloud, Direct URLs'
        },
        'pause': {
            name: 'pause', 
            description: 'Pause the currently playing song',
            usage: '/pause',
            example: '/pause',
            category: 'music',
            permissions: 'DJ Role or Admin',
            cooldown: '1 second'
        },
        'resume': {
            name: 'resume',
            description: 'Resume the paused song', 
            usage: '/resume',
            example: '/resume',
            category: 'music',
            permissions: 'DJ Role or Admin',
            cooldown: '1 second'
        },
        'skip': {
            name: 'skip',
            description: 'Skip the current song',
            usage: '/skip',
            example: '/skip', 
            category: 'music',
            permissions: 'DJ Role or Admin',
            cooldown: '1 second'
        },
        'stop': {
            name: 'stop',
            description: 'Stop music and clear the queue',
            usage: '/stop',
            example: '/stop',
            category: 'music', 
            permissions: 'DJ Role or Admin',
            cooldown: '2 seconds'
        },
        'queue': {
            name: 'queue',
            description: 'View the current music queue',
            usage: '/queue',
            example: '/queue',
            category: 'music',
            permissions: 'None',
            cooldown: '3 seconds'
        },
        'nowplaying': {
            name: 'nowplaying',
            description: 'Show currently playing song with controls',
            usage: '/nowplaying',
            example: '/nowplaying', 
            category: 'music',
            permissions: 'None',
            cooldown: '3 seconds'
        },
        'back': {
            name: 'back',
            description: 'Go back to the previous song',
            usage: '/back',
            example: '/back',
            category: 'music',
            permissions: 'DJ Role or Admin',
            cooldown: '2 seconds'
        },
        'shuffle': {
            name: 'shuffle',
            description: 'Shuffle the music queue',
            usage: '/shuffle',
            example: '/shuffle',
            category: 'music',
            permissions: 'DJ Role or Admin', 
            cooldown: '3 seconds'
        },
        
        // Filter Commands
        'filter': {
            name: 'filter',
            description: 'Apply audio filters to music',
            usage: '/filter',
            example: '/filter (then select from menu)',
            category: 'filter',
            permissions: 'DJ Role or Admin',
            cooldown: '2 seconds',
            extra: '15 filters: Bass Boost, 3D, Nightcore, Karaoke, Echo, etc.'
        },
        'volume': {
            name: 'volume',
            description: 'Change music volume level',
            usage: '/volume <level>',
            example: '/volume 50\n/volume 100',
            category: 'filter',
            permissions: 'DJ Role or Admin',
            cooldown: '1 second',
            extra: 'Range: 5-200%'
        },
        
        // Global Commands  
        'language': {
            name: 'language',
            description: 'Change bot language',
            usage: '/language <vi|en>',
            example: '/language vi\n/language en',
            category: 'global',
            permissions: 'Administrator',
            cooldown: '5 seconds'
        },
        'autoplay': {
            name: 'autoplay',
            description: 'Toggle autoplay mode',
            usage: '/autoplay',
            example: '/autoplay',
            category: 'global',
            permissions: 'DJ Role or Admin', 
            cooldown: '3 seconds',
            extra: 'Automatically plays related songs when queue ends'
        },
        
        // Playlist Commands
        'playlist': {
            name: 'playlist',
            description: 'Manage your music playlists',
            usage: '/playlist <create|delete|list|show> [name]',
            example: '/playlist create My Songs\n/playlist list\n/playlist show My Songs',
            category: 'playlist',
            permissions: 'None',
            cooldown: '3 seconds'
        },
        'save': {
            name: 'save',
            description: 'Save current song to playlist',
            usage: '/save <playlist_name>',
            example: '/save My Favorites',
            category: 'playlist',
            permissions: 'None',
            cooldown: '2 seconds'
        },
        
        // Settings Commands
        'channel': {
            name: 'channel',
            description: 'Set music channels for bot',
            usage: '/channel <set|remove> [channel]',
            example: '/channel set #music\n/channel remove',
            category: 'settings',
            permissions: 'Administrator',
            cooldown: '5 seconds'
        },
        'dj': {
            name: 'dj',
            description: 'Set DJ role for music controls',
            usage: '/dj <set|remove> [role]', 
            example: '/dj set @DJ\n/dj remove',
            category: 'settings',
            permissions: 'Administrator',
            cooldown: '5 seconds'
        }
    };
    
    return commands[command] || null;
};

module.exports = {
    name: "help",
    description: "Get help and information about the bot", 
    permissions: "0x0000000000000800",
    getCommandDetails, // Export function for use in interactionCreate
    options: [],
    showHelp: false,
    run: async (client, interaction) => {
        let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
        lang = lang?.language || client.language
        lang = require(`../languages/${lang}.js`);
        
        try {
            // Main help embed with companion image
            const helpEmbed = new EmbedBuilder()
                .setColor(client.config.embedColor)
                .setTitle(`🎵 Yuna Music ✨ Help Panel`)
                .setDescription(
                    `🎵 **How to play music**\n` +
                    `\`/play normal <name/url>\`\n\n` +
                    
                    `❓ **What is Yuna Music?**\n` +
                    `A Next-Generation Discord Music Bot With Many Awesome Features, Buttons, Menus, a Context Menu, Support for Many Sources, and Customizable Settings\n\n` +
                    
                    `📋 **Command Categories:**\n` +
                    `ℹ️ : **Information** - Bot status & info\n` +
                    `🎵 : **Music** - Play & control music\n` +
                    `🎛️ : **Filter** - Audio effects & filters\n` +
                    `🌍 : **Global** - Language & settings\n` +
                    `📜 : **Playlist** - Manage playlists\n` +
                    `⚙️ : **Settings** - Bot configuration\n\n` +
                    `\`\`\`\n` +
                    `╔═══════════════════════════════╗\n` +
                    `║     🎵 YUNA MUSIC 🎵        ║\n` +
                    `║   Your Music Companion      ║\n` +
                    `╚═══════════════════════════════╝\n` +
                    `\`\`\``
                )
                .setThumbnail(client.user.displayAvatarURL({ dynamic: true, size: 512 }))
                .setImage('https://i.imgur.com/K7gWdZm.png') // Beautiful music companion image
                .setFooter({
                    text: `🎵 Thank you for selecting Yuna Music ✨!`,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTimestamp();

            // Create buttons row for invite, support, vote
            const buttonsRow = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel('🔗 Invite Bot')
                        .setStyle(ButtonStyle.Link)
                        .setURL(client.config.botInvite || `https://discord.com/api/oauth2/authorize?client_id=${client.user.id}&permissions=8&scope=bot%20applications.commands`),
                    new ButtonBuilder()
                        .setLabel('💬 Support Server')
                        .setStyle(ButtonStyle.Link)
                        .setURL(client.config.supportServer || 'https://discord.gg/support'),
                    new ButtonBuilder()
                        .setLabel('⭐ Vote')
                        .setStyle(ButtonStyle.Link)
                        .setURL(client.config.voteManager?.vote_url || 'https://top.gg/bot/' + client.user.id + '/vote')
                );

            // Create select menu for command categories
            const selectMenu = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('help_select')
                        .setPlaceholder('🎧 | Select to view the commands.')
                        .addOptions([
                            {
                                label: 'Information',
                                description: 'View information commands',
                                value: 'info',
                                emoji: 'ℹ️'
                            },
                            {
                                label: 'Music',
                                description: 'View music commands',
                                value: 'music',
                                emoji: '🎵'
                            },
                            {
                                label: 'Filter',
                                description: 'View filter commands',
                                value: 'filter',
                                emoji: '🎛️'
                            },
                            {
                                label: 'Global',
                                description: 'View global commands',
                                value: 'global',
                                emoji: '🌍'
                            },
                            {
                                label: 'Playlist',
                                description: 'View playlist commands',
                                value: 'playlist',
                                emoji: '📜'
                            },
                            {
                                label: 'Settings',
                                description: 'View settings commands',
                                value: 'settings',
                                emoji: '⚙️'
                            }
                        ])
                );

            await interaction.reply({ 
                embeds: [helpEmbed], 
                components: [buttonsRow, selectMenu]
            }).then(() => {
                // Auto delete help panel after 30 seconds
                setTimeout(async () => {
                    try {
                        await interaction.deleteReply().catch(() => {});
                    } catch (e) {}
                }, 30000); // 30 seconds
            });

        } catch (error) {
            console.error('Help command error:', error);
            await interaction.reply({ 
                content: '❌ Có lỗi xảy ra khi hiển thị help!', 
                flags: 64 
            });
        }
    }
};
