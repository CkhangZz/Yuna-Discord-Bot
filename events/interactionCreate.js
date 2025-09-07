const config = require("../config.js");
const { EmbedBuilder, InteractionType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("../mongoDB");
const fs = require("fs")
module.exports = async (client, token, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
try {
if (!interaction?.guild){
return interaction?.reply({ content: "This bot is only for servers and can be used on servers.", flags: 64 })
} else {

    function cmd_loader() {
        if (interaction?.type === InteractionType.ApplicationCommand) {
            fs.readdir(config.commandsDir, (err, files) => {
            if (err) throw err;
            files.forEach(async (f) => {
            let props = require(`.${config.commandsDir}/${f}`);
            if (interaction.commandName === props.name) {
            try {
            let data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
            if (data?.channels?.length > 0) {

            let channel_control = await data?.channels?.filter(x => !interaction?.guild?.channels?.cache?.get(x?.channel))
          
            if (channel_control?.length > 0) {
            for (const x of channel_control) {
                await db?.musicbot?.updateOne({ guildID: interaction?.guild?.id }, { 
                    $pull: { 
                        channels: { 
                            channel: x?.channel
                        } 
                    } 
                }, { upsert: true }).catch(e => { })
            }
           
            } else {
            data = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
            let channel_filter = data?.channels?.filter(x => x.channel === interaction?.channel?.id)


            if (!channel_filter?.length > 0 && !interaction?.member?.permissions?.has("0x0000000000000020")) {
            channel_filter = data?.channels?.map(x => `<#${x.channel}>`).join(", ")
            return interaction?.reply({ content: lang.msg126.replace("{channel_filter}", channel_filter), flags: 64 }).catch(e => { })
            }
        }
            }
            if (interaction?.member?.permissions?.has(props?.permissions || "0x0000000000000800")) {
            const DJ = client.config.opt.DJ;
            if (props && DJ.commands.includes(interaction?.commandName)) {
            let djRole = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id }).catch(e => { });
            if (djRole) {
            const roleDJ = interaction?.guild?.roles?.cache?.get(djRole?.role)
            if (!interaction?.member?.permissions?.has("0x0000000000000020")) {
            if (roleDJ) {
            if (!interaction?.member?.roles?.cache?.has(roleDJ?.id)) {
            
            const embed = new EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle(client?.user?.username)
            .setThumbnail(client?.user?.displayAvatarURL())
            .setDescription(lang.embed1.replace("{djRole}", roleDJ?.id).replace("{cmdMAP}", client.config.opt.DJ.commands.map(astra => '`' + astra + '`').join(", ")))
            .setTimestamp()
            .setFooter({ text: `MusicMaker ❤️` })
            return interaction?.reply({ embeds: [embed], flags: 64 }).catch(e => { })
            }
            }
            }
            }
            }
            if (props && props.voiceChannel) {
            if (!interaction?.member?.voice?.channelId) return interaction?.reply({ content: `${lang.message1}`, flags: 64 }).catch(e => { })
            const guild_me = interaction?.guild?.members?.cache?.get(client?.user?.id);
            if (guild_me?.voice?.channelId) {
            if (guild_me?.voice?.channelId !== interaction?.member?.voice?.channelId) {
            return interaction?.reply({ content: `${lang.message2}`, flags: 64 }).catch(e => { })
            }
            }
            }
            // Execute command with auto-delete logic
            const originalReply = interaction.reply;
            const originalEditReply = interaction.editReply;
            const originalFollowUp = interaction.followUp;
            
            // Commands that should NOT be auto-deleted (15s auto-delete)
            // help has its own 30s timer, play and nowplaying are persistent
            const persistentCommands = ['help', 'play', 'nowplaying'];
            const shouldAutoDelete = !persistentCommands.includes(interaction.commandName);
            
            // Wrap reply method to add auto-delete
            interaction.reply = async function(options) {
                const result = await originalReply.call(this, options);
                
                if (shouldAutoDelete && !options?.ephemeral) {
                    // Auto-delete after 15 seconds for most commands
                    setTimeout(async () => {
                        try {
                            await this.deleteReply();
                        } catch (e) {
                            // If delete fails, try to edit with deletion notice
                            try {
                                await this.editReply({ 
                                    content: '🗑️ *Tin nhắn này đã được tự động xóa*', 
                                    embeds: [], 
                                    components: [] 
                                });
                                setTimeout(() => {
                                    this.deleteReply().catch(() => {});
                                }, 3000);
                            } catch (e2) {}
                        }
                    }, 15000);
                }
                
                return result;
            };
            
            // Wrap editReply method
            interaction.editReply = async function(options) {
                const result = await originalEditReply.call(this, options);
                
                if (shouldAutoDelete && !options?.ephemeral) {
                    setTimeout(async () => {
                        try {
                            await this.deleteReply();
                        } catch (e) {}
                    }, 15000);
                }
                
                return result;
            };
            
            // Wrap followUp method
            interaction.followUp = async function(options) {
                const result = await originalFollowUp.call(this, options);
                
                if (shouldAutoDelete && !options?.ephemeral) {
                    setTimeout(async () => {
                        try {
                            await result.delete();
                        } catch (e) {}
                    }, 15000);
                }
                
                return result;
            };
            
            return props.run(client, interaction);
            
            } else {
            return interaction?.reply({ content: `${lang.message3}: **${props?.permissions?.replace("0x0000000000000020", "MANAGE GUILD")?.replace("0x0000000000000800", "SEND MESSAGES") || "SEND MESSAGES"}**`, flags: 64 });
            }
            } catch (e) {
            return interaction?.reply({ content: `${lang.msg4}...\n\n\`\`\`${e?.message}\`\`\``, flags: 64 });
            }
            }
            });
            });
            }
    }

    if(config.voteManager.status === true && config.voteManager.api_key){
        if(config.voteManager.vote_commands.includes(interaction?.commandName)){
            try {
            const topSdk = require("@top-gg/sdk");
            let topApi = new topSdk.Api(config.voteManager.api_key, client);
            await topApi?.hasVoted(interaction?.user?.id).then(async voted => {
                if (!voted) {
            const embed2 = new EmbedBuilder()
          .setTitle("Vote "+client?.user?.username)
          .setColor(client?.config?.embedColor)
          .setDescription(`${config.voteManager.vote_commands.map(cs => `\`${cs}\``).join(", ")} - ${lang.msg131}
> ${config.voteManager.vote_url}`)
            return interaction?.reply({ content:"", embeds: [embed2], flags: 64 })
                } else {
                    cmd_loader()
                }
            })
        } catch(e){
            cmd_loader()
        }
        } else {
            cmd_loader()
        }
        } else {
            cmd_loader()
        }


if (interaction?.type === InteractionType.MessageComponent) {
const queue = client?.player?.getQueue(interaction?.guildId);
switch (interaction?.customId) {
case 'saveTrack': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {

const Modal = new ModalBuilder()
.setCustomId("playlistModal")
.setTitle(lang.msg6)

const PlayList = new TextInputBuilder()
.setCustomId("playlist")
.setLabel(lang.msg7)
.setRequired(true)
.setStyle(TextInputStyle.Short)

const PlaylistRow = new ActionRowBuilder().addComponents(PlayList);

Modal.addComponents(PlaylistRow)

await interaction?.showModal(Modal).catch(e => { })
}
}
break
case 'time': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {

    let music_percent = queue.duration / 100;
    let music_percent2 = queue.currentTime / music_percent;
    let music_percent3 = Math.round(music_percent2);

    const embed = new EmbedBuilder()
    .setColor(client?.config?.embedColor)
    .setTitle(queue?.songs[0]?.name)
    .setThumbnail(queue?.songs[0]?.thumbnail)
    .setTimestamp()
    .setDescription(`**${queue?.formattedCurrentTime} / ${queue?.formattedDuration} (${music_percent3}%)**`)
    .setFooter({ text: `MusicMaker ❤️` })
    interaction?.message?.edit({ embeds: [embed] }).catch(e => { })
    interaction?.reply({ content: `${lang.msg9}`, embeds: [], components: [], flags: 64 }).catch(e => { })
}
}
break
case 'music_pause_resume': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
if (queue?.paused) {
    queue?.resume();
    interaction?.reply({ content: `▶️ **Đã tiếp tục nhạc!**`, embeds: [], components: [] }).then(reply => {
        // Auto delete after 3 seconds
        setTimeout(() => {
            reply.delete().catch(() => {});
        }, 3000);
    }).catch(e => { })
} else {
    queue?.pause();
    interaction?.reply({ content: `⏸️ **Đã tạm dừng nhạc!**`, embeds: [], components: [] }).then(reply => {
        // Auto delete after 3 seconds
        setTimeout(() => {
            reply.delete().catch(() => {});
        }, 3000);
    }).catch(e => { })
}
}
}
break

case 'music_filter': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
// Launch filter selection interface
const filterCommand = require('../commands/filter.js');
return filterCommand.run(client, interaction);
}
}
break
case 'music_volume': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
// Create volume control modal
const volumeModal = new ModalBuilder()
.setCustomId('volume_modal')
.setTitle('🔊 Điều chỉnh âm lượng');

const volumeInput = new TextInputBuilder()
.setCustomId('volume_input')
.setLabel('Âm lượng (5-200)')
.setStyle(TextInputStyle.Short)
.setPlaceholder(`Hiện tại: ${queue.volume}%`)
.setValue(queue.volume.toString())
.setMinLength(1)
.setMaxLength(3)
.setRequired(true);

const volumeRow = new ActionRowBuilder().addComponents(volumeInput);
volumeModal.addComponents(volumeRow);

return interaction?.showModal(volumeModal).catch(e => {});
}
}
break
case 'music_skip': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
queue?.skip();
interaction?.reply({ content: `⏭️ **Đã bỏ qua bài!**`, embeds: [], components: [] }).then(reply => {
    // Auto delete after 3 seconds
    setTimeout(() => {
        reply.delete().catch(() => {});
    }, 3000);
}).catch(e => { })
}
}
break
case 'music_stop': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
queue?.stop();
interaction?.reply({ content: `⏹️ **Đã dừng nhạc!**`, embeds: [], components: [] }).then(reply => {
    // Auto delete after 3 seconds
    setTimeout(() => {
        reply.delete().catch(() => {});
    }, 3000);
}).catch(e => { })
}
}
break
case 'music_queue': {
if (!queue || !queue?.songs || queue?.songs?.length <= 0) {
return interaction?.reply({ content: `${lang.msg23}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
let queueString = '';
for (let i = 0; i < Math.min(queue.songs.length, 10); i++) {
    const song = queue.songs[i];
    queueString += `**${i + 1}.** [${song.name}](${song.url}) - \`${song.formattedDuration || 'Live'}\` | <@${song.user.id}>\n`;
}
if (queue.songs.length > 10) {
    queueString += `\n**...và ${queue.songs.length - 10} bài nữa**`;
}

const embed = new EmbedBuilder()
.setColor(client?.config?.embedColor)
.setTitle(`📜 ${lang.msg64}`)
.setDescription(queueString)
.setFooter({ text: `🎶 Yuna Music | Tổng cộng ${queue.songs.length} bài`, iconURL: client.user.displayAvatarURL() })
.setTimestamp()

// Create select menu for song selection (max 25 options)
const selectOptions = [];
for (let i = 0; i < Math.min(queue.songs.length, 25); i++) {
    const song = queue.songs[i];
    const isCurrentSong = i === 0;
    selectOptions.push({
        label: `${i + 1}. ${song.name.length > 90 ? song.name.substring(0, 87) + '...' : song.name}`,
        description: `${song.formattedDuration || 'Live'} • ${song.user.username}`,
        value: `queue_song_${i}`,
        emoji: isCurrentSong ? '🎵' : '🎶'
    });
}

const selectMenu = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('queue_song_select')
            .setPlaceholder('🎵 Chọn bài hát để chuyển đến')
            .addOptions(selectOptions)
    );

return interaction?.reply({ embeds: [embed], components: [selectMenu], flags: 64 }).catch(e => { })
}
}
break
case 'music_loop': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
let mode = queue?.repeatMode;
if (mode === 0) {
    queue?.setRepeatMode(2); // Queue loop
    return interaction?.reply({ content: `🔁 **Lặp toàn bộ queue!**`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else if (mode === 2) {
    queue?.setRepeatMode(1); // Song loop
    return interaction?.reply({ content: `🔂 **Lặp bài hiện tại!**`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
    queue?.setRepeatMode(0); // No loop
    return interaction?.reply({ content: `▶️ **Đã tắt chế độ lặp!**`, embeds: [], components: [], flags: 64 }).catch(e => { })
}
}
}
break
case 'music_shuffle': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
queue?.shuffle();
return interaction?.reply({ content: `🔀 **Đã trộn bài trong queue!**`, embeds: [], components: [], flags: 64 }).catch(e => { })
}
}
break
case 'music_volume_down': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
const newVolume = Math.max(queue.volume - 10, 1);
queue?.setVolume(newVolume);
return interaction?.reply({ content: `${lang.msg90} **${newVolume}%** 🔉`, embeds: [], components: [], flags: 64 }).catch(e => { })
}
}
break
case 'music_volume_up': {
if (!queue || !queue?.playing) {
return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })
} else {
const maxVol = client?.config?.opt?.maxVol || 200;
const newVolume = Math.min(queue.volume + 10, maxVol);
queue?.setVolume(newVolume);
return interaction?.reply({ content: `${lang.msg90} **${newVolume}%** 🔊`, embeds: [], components: [], flags: 64 }).catch(e => { })
}
}
}

// Handle help select menu - Edit original message
if (interaction?.isStringSelectMenu() && interaction?.customId === 'help_select') {
    const category = interaction.values[0];
    let categoryCommands = [];
    let categoryTitle = '';
    let categoryEmoji = '';
    
    switch (category) {
        case 'info':
            categoryTitle = 'Information Commands';
            categoryEmoji = 'ℹ️';
            categoryCommands = [
                { name: 'ping', desc: 'Check bot latency & response time' },
                { name: 'bot-statistic', desc: 'View detailed bot statistics' },
                { name: 'servers', desc: 'View server count & bot presence' }
            ];
            break;
        case 'music':
            categoryTitle = 'Music Commands';
            categoryEmoji = '🎵';
            categoryCommands = [
                { name: 'play', desc: 'Play music from various sources' },
                { name: 'pause', desc: 'Pause currently playing song' },
                { name: 'resume', desc: 'Resume the paused song' },
                { name: 'skip', desc: 'Skip to the next song' },
                { name: 'stop', desc: 'Stop music and clear queue' },
                { name: 'queue', desc: 'View current music queue' },
                { name: 'nowplaying', desc: 'Show current song with controls' },
                { name: 'back', desc: 'Go back to previous song' },
                { name: 'shuffle', desc: 'Shuffle the music queue' }
            ];
            break;
        case 'filter':
            categoryTitle = 'Filter Commands';
            categoryEmoji = '🎛️';
            categoryCommands = [
                { name: 'filter', desc: 'Apply 15 audio filters to music' },
                { name: 'volume', desc: 'Change music volume (5-200%)' }
            ];
            break;
        case 'global':
            categoryTitle = 'Global Commands';
            categoryEmoji = '🌍';
            categoryCommands = [
                { name: 'language', desc: 'Change bot language (vi/en)' },
                { name: 'autoplay', desc: 'Toggle autoplay when queue ends' }
            ];
            break;
        case 'playlist':
            categoryTitle = 'Playlist Commands';
            categoryEmoji = '📜';
            categoryCommands = [
                { name: 'playlist', desc: 'Create & manage your playlists' },
                { name: 'save', desc: 'Save current song to playlist' }
            ];
            break;
        case 'settings':
            categoryTitle = 'Settings Commands';
            categoryEmoji = '⚙️';
            categoryCommands = [
                { name: 'channel', desc: 'Set designated music channels' },
                { name: 'dj', desc: 'Set DJ role for music controls' }
            ];
            break;
    }
    
    // Create command selection menu for this category
    const commandSelect = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`help_command_${category}`)
                .setPlaceholder(`📖 Select a command for detailed help`)
                .addOptions(
                    categoryCommands.map(cmd => ({
                        label: `/${cmd.name}`,
                        description: cmd.desc.length > 100 ? cmd.desc.substring(0, 97) + '...' : cmd.desc,
                        value: cmd.name,
                        emoji: categoryEmoji
                    }))
                )
        );
    
    // Back to main help button  
    const backButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_back_main')
                .setLabel('🏠 Back to Main Help')
                .setStyle(ButtonStyle.Secondary)
        );
    
    // Create enhanced category embed
    const categoryEmbed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle(`${categoryEmoji} ${categoryTitle}`)
        .setDescription(
            `📝 **Available Commands:**\n\n` +
            categoryCommands.map((cmd, index) => 
                `**${index + 1}.** \`/${cmd.name}\`\n└ ${cmd.desc}\n`
            ).join('\n') + 
            `\n💡 **Tip:** Select a command below for detailed information!`
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `🎵 Yuna Music | ${categoryCommands.length} commands in this category`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    // Edit the original message instead of replying  
    await interaction.update({ 
        embeds: [categoryEmbed], 
        components: [commandSelect, backButton]
    }).catch(e => {});
    return;
}

// Handle detailed command help selection
if (interaction?.isStringSelectMenu() && interaction?.customId?.startsWith('help_command_')) {
    const selectedCommand = interaction.values[0];
    const helpCommand = require('../commands/help.js');
    const commandDetails = helpCommand.getCommandDetails(selectedCommand);
    
    if (!commandDetails) {
        await interaction.reply({ 
            content: '❌ **Không tìm thấy thông tin chi tiết cho lệnh này!**', 
            flags: 64 
        }).catch(e => {});
        return;
    }
    
    // Get category from customId (help_command_music -> music)
    const category = interaction.customId.split('_')[2];
    const categoryEmojis = {
        'info': 'ℹ️',
        'music': '🎵', 
        'filter': '🎛️',
        'global': '🌍',
        'playlist': '📜',
        'settings': '⚙️'
    };
    
    // Create detailed command embed
    const commandEmbed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle(`${categoryEmojis[category]} \`/${commandDetails.name}\` - Detailed Help`)
        .setDescription(
            `📝 **Description:**\n${commandDetails.description}\n\n` +
            `📋 **Usage:**\n\`${commandDetails.usage}\`\n\n` +
            `💡 **Example:**\n\`${commandDetails.example}\`\n\n` +
            `🔒 **Permissions:**\n${commandDetails.permissions}\n\n` +
            `⏰ **Cooldown:**\n${commandDetails.cooldown}` +
            (commandDetails.extra ? `\n\n✨ **Additional Info:**\n${commandDetails.extra}` : '')
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `🎵 Yuna Music | Command Help`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();
    
    // Back to category and main help buttons
    const navigationRow = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId(`help_back_category_${category}`)
                .setLabel(`${categoryEmojis[category]} Back to ${category.charAt(0).toUpperCase() + category.slice(1)}`)
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('help_back_main')
                .setLabel('🏠 Main Help')
                .setStyle(ButtonStyle.Secondary)
        );
    
    await interaction.update({ 
        embeds: [commandEmbed], 
        components: [navigationRow]
    }).catch(e => {});
    return;
}

// Handle back to main help button
if (interaction?.isButton() && interaction?.customId === 'help_back_main') {
    // Recreate the original help embed and components
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
        .setImage('https://i.imgur.com/K7gWdZm.png')
        .setFooter({
            text: `🎵 Thank you for selecting Yuna Music ✨!`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    // Recreate original buttons and select menu
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
    
    await interaction.update({ 
        embeds: [helpEmbed], 
        components: [buttonsRow, selectMenu]
    }).catch(e => {});
    return;
}

// Handle back to specific category button
if (interaction?.isButton() && interaction?.customId?.startsWith('help_back_category_')) {
    const category = interaction.customId.split('_')[3];
    
    // Recreate category view with same logic as help_select handler
    let categoryCommands = [];
    let categoryTitle = '';
    let categoryEmoji = '';
    
    switch (category) {
        case 'info':
            categoryTitle = 'Information Commands';
            categoryEmoji = 'ℹ️';
            categoryCommands = [
                { name: 'ping', desc: 'Check bot latency & response time' },
                { name: 'bot-statistic', desc: 'View detailed bot statistics' },
                { name: 'servers', desc: 'View server count & bot presence' }
            ];
            break;
        case 'music':
            categoryTitle = 'Music Commands';
            categoryEmoji = '🎵';
            categoryCommands = [
                { name: 'play', desc: 'Play music from various sources' },
                { name: 'pause', desc: 'Pause currently playing song' },
                { name: 'resume', desc: 'Resume the paused song' },
                { name: 'skip', desc: 'Skip to the next song' },
                { name: 'stop', desc: 'Stop music and clear queue' },
                { name: 'queue', desc: 'View current music queue' },
                { name: 'nowplaying', desc: 'Show current song with controls' },
                { name: 'back', desc: 'Go back to previous song' },
                { name: 'shuffle', desc: 'Shuffle the music queue' }
            ];
            break;
        case 'filter':
            categoryTitle = 'Filter Commands';
            categoryEmoji = '🎛️';
            categoryCommands = [
                { name: 'filter', desc: 'Apply 15 audio filters to music' },
                { name: 'volume', desc: 'Change music volume (5-200%)' }
            ];
            break;
        case 'global':
            categoryTitle = 'Global Commands';
            categoryEmoji = '🌍';
            categoryCommands = [
                { name: 'language', desc: 'Change bot language (vi/en)' },
                { name: 'autoplay', desc: 'Toggle autoplay when queue ends' }
            ];
            break;
        case 'playlist':
            categoryTitle = 'Playlist Commands';
            categoryEmoji = '📜';
            categoryCommands = [
                { name: 'playlist', desc: 'Create & manage your playlists' },
                { name: 'save', desc: 'Save current song to playlist' }
            ];
            break;
        case 'settings':
            categoryTitle = 'Settings Commands';
            categoryEmoji = '⚙️';
            categoryCommands = [
                { name: 'channel', desc: 'Set designated music channels' },
                { name: 'dj', desc: 'Set DJ role for music controls' }
            ];
            break;
    }
    
    // Create command selection menu for this category
    const commandSelect = new ActionRowBuilder()
        .addComponents(
            new StringSelectMenuBuilder()
                .setCustomId(`help_command_${category}`)
                .setPlaceholder(`📖 Select a command for detailed help`)
                .addOptions(
                    categoryCommands.map(cmd => ({
                        label: `/${cmd.name}`,
                        description: cmd.desc.length > 100 ? cmd.desc.substring(0, 97) + '...' : cmd.desc,
                        value: cmd.name,
                        emoji: categoryEmoji
                    }))
                )
        );
    
    // Back to main help button  
    const backButton = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('help_back_main')
                .setLabel('🏠 Back to Main Help')
                .setStyle(ButtonStyle.Secondary)
        );
    
    // Create enhanced category embed
    const categoryEmbed = new EmbedBuilder()
        .setColor(client.config.embedColor)
        .setTitle(`${categoryEmoji} ${categoryTitle}`)
        .setDescription(
            `📝 **Available Commands:**\n\n` +
            categoryCommands.map((cmd, index) => 
                `**${index + 1}.** \`/${cmd.name}\`\n└ ${cmd.desc}\n`
            ).join('\n') + 
            `\n💡 **Tip:** Select a command below for detailed information!`
        )
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
        .setFooter({
            text: `🎵 Yuna Music | ${categoryCommands.length} commands in this category`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    await interaction.update({ 
        embeds: [categoryEmbed], 
        components: [commandSelect, backButton]
    }).catch(e => {});
    return;
}

// Handle filter selection
if (interaction?.isStringSelectMenu() && interaction?.customId === 'filter_select') {
    const queue = client?.player?.getQueue(interaction?.guildId);
    if (!queue || !queue?.playing) {
        return interaction?.reply({ content: `${lang.msg5}`, flags: 64 }).catch(e => { });
    }
    
    const selectedFilter = interaction.values[0];
    const filterNames = ["3d", "bassboost", "echo", "karaoke", "nightcore", "vaporwave", "flanger", "gate", "haas", "reverse", "surround", "mcompand", "phaser", "tremolo", "earwax"];
    
    if (!filterNames.includes(selectedFilter)) {
        return interaction?.reply({ content: `❌ **Filter không hợp lệ!**`, flags: 64 }).catch(e => { });
    }
    
    try {
        let statusText = '';
        let statusEmoji = '';
        
        if (queue?.filters?.has(selectedFilter)) {
            // Remove filter
            queue?.filters?.remove(selectedFilter);
            statusText = `đã TẮT`;
            statusEmoji = '❌';
        } else {
            // Add filter  
            queue?.filters?.add(selectedFilter);
            statusText = `đã BẬT`;
            statusEmoji = '✅';
        }
        
        return interaction?.reply({ 
            content: `${statusEmoji} **Filter \`${selectedFilter}\` ${statusText}!**`, 
            flags: 64 
        }).catch(e => { });
        
    } catch (error) {
        console.error('Filter error:', error);
        return interaction?.reply({ content: `❌ **Lỗi khi áp dụng filter!**`, flags: 64 }).catch(e => { });
    }
}

// Handle filter control buttons
if (interaction?.isButton() && (interaction?.customId === 'filter_clear_all' || interaction?.customId === 'filter_close')) {
    const queue = client?.player?.getQueue(interaction?.guildId);
    
    if (interaction?.customId === 'filter_clear_all') {
        if (!queue || !queue?.playing) {
            return interaction?.reply({ content: `${lang.msg5}`, flags: 64 }).catch(e => { });
        }
        
        // Clear all filters
        const filterNames = ["3d", "bassboost", "echo", "karaoke", "nightcore", "vaporwave", "flanger", "gate", "haas", "reverse", "surround", "mcompand", "phaser", "tremolo", "earwax"];
        filterNames.forEach(filter => {
            if (queue?.filters?.has(filter)) {
                queue?.filters?.remove(filter);
            }
        });
        
        return interaction?.reply({ 
            content: `🗑️ **Đã xóa tất cả filters!**`, 
            flags: 64 
        }).catch(e => { });
    }
    
    if (interaction?.customId === 'filter_close') {
        return interaction?.reply({ 
            content: `❌ **Đã đóng filter panel**`, 
            flags: 64 
        }).catch(e => { });
    }
}

// Handle queue song selection
if (interaction?.isStringSelectMenu() && interaction?.customId === 'queue_song_select') {
    const queue = client?.player?.getQueue(interaction?.guildId);
    if (!queue || !queue?.playing) {
        return interaction?.reply({ content: `${lang.msg5}`, flags: 64 }).catch(e => { });
    }
    
    const selectedValue = interaction.values[0];
    const songIndex = parseInt(selectedValue.replace('queue_song_', ''));
    
    if (songIndex === 0) {
        return interaction?.reply({ content: `🎵 **Đây đã là bài đang phát!**`, flags: 64 }).catch(e => { });
    }
    
    if (songIndex >= queue.songs.length) {
        return interaction?.reply({ content: `❌ **Bài hát không tồn tại trong queue!**`, flags: 64 }).catch(e => { });
    }
    
    try {
        // Jump to selected song
        queue.jump(songIndex);
        const selectedSong = queue.songs[0]; // After jump, it becomes current song
        return interaction?.reply({ 
            content: `🎵 **Đã chuyển đến:** \`${selectedSong.name}\``, 
            flags: 64 
        }).catch(e => { });
    } catch (error) {
        console.error('Queue jump error:', error);
        return interaction?.reply({ content: `❌ **Lỗi khi chuyển bài!**`, flags: 64 }).catch(e => { });
    }
}
}


// Handle volume modal
if (interaction?.type === InteractionType.ModalSubmit && interaction?.customId === 'volume_modal') {
    const queue = client?.player?.getQueue(interaction?.guildId);
    if (!queue || !queue?.playing) {
        return interaction?.reply({ content: `${lang.msg5}`, flags: 64 }).catch(e => { });
    }
    
    const volumeValue = interaction.fields.getTextInputValue('volume_input');
    const newVolume = parseInt(volumeValue);
    
    // Validate volume
    if (isNaN(newVolume) || newVolume < 5 || newVolume > (client.config.opt.maxVol || 200)) {
        return interaction?.reply({ 
            content: `❌ **Volume không hợp lệ!** Vui lòng nhập số từ 5 đến ${client.config.opt.maxVol || 200}`, 
            flags: 64 
        }).catch(e => { });
    }
    
    // Set volume
    queue.setVolume(newVolume);
    
    return interaction?.reply({ 
        content: `🔊 **Volume đã được đặt thành ${newVolume}%**`, 
        flags: 64 
    }).catch(e => { });
}

if (interaction?.type === InteractionType.ModalSubmit) {
switch (interaction?.customId) {
case 'playlistModal': {
const queue = client?.player?.getQueue(interaction?.guildId);
if (!queue || !queue?.playing) return interaction?.reply({ content: `${lang.msg5}`, embeds: [], components: [], flags: 64 }).catch(e => { })

const name = interaction?.fields?.getTextInputValue("playlist")

const playlist = await db?.playlist?.findOne({ userID: interaction?.user?.id }).catch(e => { })
if (!playlist?.playlist?.filter(p => p.name === name).length > 0) return interaction?.reply({ content: `${lang.msg10}`, flags: 64 }).catch(e => { })

const music_filter = playlist?.musics?.filter(m => m.playlist_name === name && m.music_name === queue?.songs[0]?.name)
if (!music_filter?.length > 0) {
await db?.playlist?.updateOne({ userID: interaction?.user?.id }, {
$push: {
musics: {
playlist_name: name,
music_name: queue?.songs[0]?.name,
music_url: queue?.songs[0]?.url,
saveTime: Date.now()
}
}
}, { upsert: true }).catch(e => { })
return interaction?.reply({ content: `<@${interaction?.user?.id}>, **${queue?.songs[0]?.name}** ${lang.msg12}`, flags: 64 }).catch(e => { })
} else {
return interaction?.reply({ content: `<@${interaction?.user?.id}>, **${queue?.songs[0]?.name}** ${lang.msg104}`, flags: 64 }).catch(e => { })
}
}
break
}
}
}
} catch (e) {
    const errorNotifer = require("../functions.js")
   errorNotifer(client, interaction, e, lang)
    }
}
