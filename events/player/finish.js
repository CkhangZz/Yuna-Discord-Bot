const { EmbedBuilder } = require("discord.js");
const db = require("../../mongoDB");

module.exports = async (client, queue) => {
    let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../../languages/${lang}.js`);
    
    if (!queue?.textChannel) return;

    // Clean up stored music message with controls
    if (client.musicMessages && client.musicMessages.has(queue.textChannel.guild.id)) {
        try {
            const message = client.musicMessages.get(queue.textChannel.guild.id);
            if (message && message.editable) {
                // Disable all buttons
                const disabledComponents = message.components.map(row => {
                    const newRow = { ...row };
                    newRow.components = row.components.map(button => ({
                        ...button,
                        disabled: true
                    }));
                    return newRow;
                });
                
                await message.edit({ components: disabledComponents }).catch(() => {});
                
                // Delete the message after 5 seconds
                setTimeout(() => {
                    message.delete().catch(() => {});
                }, 5000);
            }
            client.musicMessages.delete(queue.textChannel.guild.id);
        } catch (error) {
            console.error('Error cleaning up music controls:', error);
        }
    }

    // Manual Autoplay Implementation as Fallback
    if (queue.autoplay && queue.songs.length === 0) {
        try {
            console.log(`[Autoplay] Attempting to find related songs...`);
            
            // Get the last played song for related search
            const lastSong = queue.previousTracks && queue.previousTracks.length > 0 
                ? queue.previousTracks[queue.previousTracks.length - 1] 
                : null;
                
            if (lastSong) {
                // Search for related songs based on the last played song
                const searchQuery = `${lastSong.name} similar songs`;
                
                const searchResults = await client.player.search(searchQuery, {
                    limit: 1,
                    safeSearch: false
                });
                
                if (searchResults && searchResults.length > 0) {
                    console.log(`[Autoplay] Found related song: ${searchResults[0].name}`);
                    
                    // Find a member in voice channel to use for playing
                    const voiceChannelMembers = queue.voiceChannel.members.filter(member => !member.user.bot);
                    const memberToUse = voiceChannelMembers.first() || queue.textChannel.guild.members.me;
                    
                    // Play the related song
                    await client.player.play(queue.voiceChannel, searchResults[0], {
                        member: memberToUse,
                        textChannel: queue.textChannel
                    });
                    
                    // Send autoplay notification
                    const autoplayEmbed = new EmbedBuilder()
                        .setTitle('🔄 Autoplay - Tự động phát')
                        .setDescription(`🎵 **[${searchResults[0].name}](${searchResults[0].url})**\n\n🤖 Bot tự động tìm bài nhạc liên quan để tiếp tục phát nhạc!`)
                        .setColor('#00FF88')
                        .setThumbnail(searchResults[0].thumbnail)
                        .setFooter({
                            text: '🎶 Yuna Music | Autoplay Active',
                            iconURL: client.user.displayAvatarURL()
                        })
                        .setTimestamp();
                        
                    queue.textChannel.send({ embeds: [autoplayEmbed] }).then(msg => {
                        setTimeout(() => {
                            msg.delete().catch(() => {});
                        }, 10000);
                    }).catch(() => {});
                    
                    return; // Exit early as autoplay found and played a song
                } else {
                    console.log(`[Autoplay] No related songs found for: ${lastSong.name}`);
                }
            }
        } catch (error) {
            console.error(`[Autoplay] Error: ${error.message}`);
        }
    }
    
    // Don't show finish message if autoplay is enabled but still working
    if (queue.autoplay && queue.songs.length > 0) {
        return;
    }
    
    console.log(`[Finish Event] Queue finished. Autoplay: ${queue.autoplay}, Songs remaining: ${queue.songs.length}`);

    // Get the last played song info if available (reuse from autoplay section if exists)
    const lastPlayedSong = queue.previousTracks && queue.previousTracks.length > 0 
        ? queue.previousTracks[queue.previousTracks.length - 1] 
        : null;

    if (lastPlayedSong) {
        // Create summary embed
        const summaryEmbed = new EmbedBuilder()
            .setTitle('🏁 Kết thúc phát nhạc - Music Session Ended')
            .setColor(client.config.embedColor)
            .setDescription(`Đã kết thúc phiên nghe nhạc! 🎵`)
            .addFields(
                {
                    name: '🎤 Bài cuối cùng - Last Played',
                    value: `**[${lastPlayedSong.name}](${lastPlayedSong.url})**`,
                    inline: false
                },
                {
                    name: '👤 Được yêu cầu bởi - Last Requested by',
                    value: `<@${lastPlayedSong.user.id}>`,
                    inline: true
                }
            )
            .setThumbnail(lastPlayedSong.thumbnail || client.user.displayAvatarURL())
            .setFooter({
                text: '🎶 Yuna Music | Cảm ơn bạn đã nghe nhạc! 💖 Hẹn gặp lại!',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        queue.textChannel.send({ embeds: [summaryEmbed] }).then(message => {
            // Auto delete after 10 seconds
            setTimeout(() => {
                message.delete().catch(() => {});
            }, 10000);
        }).catch(e => {
            // Fallback to simple message
            queue.textChannel.send({ content: `${lang.msg14}` }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 10000);
            }).catch(() => {});
        });
    } else {
        // If no last song info, send cute goodbye message
        const goodbyeEmbed = new EmbedBuilder()
            .setTitle('👋 Tạm biệt - Goodbye!')
            .setColor(client.config.embedColor)
            .setDescription(`${lang.msg14}\n\n💫 Cảm ơn bạn đã sử dụng Yuna Music! Hẹn gặp lại nhé! 💖`)
            .setThumbnail(client.user.displayAvatarURL())
            .setFooter({
                text: '🎶 Yuna Music | Luôn sẵn sàng phục vụ bạn!',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        queue.textChannel.send({ embeds: [goodbyeEmbed] }).then(message => {
            // Auto delete after 10 seconds
            setTimeout(() => {
                message.delete().catch(() => {});
            }, 10000);
        }).catch(e => {
            // Fallback to simple message
            queue.textChannel.send({ content: `${lang.msg14}` }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 10000);
            }).catch(() => {});
        });
    }
}
