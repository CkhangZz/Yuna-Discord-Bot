const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const db = require("../../mongoDB");

module.exports = async (client, queue, song) => {
    let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../../languages/${lang}.js`);
    
    if (!queue || !queue?.textChannel) return;

    // Create progress bar
    function createProgressBar(current, total, barSize = 20) {
        if (!current || !total || total === 0) return '▱'.repeat(barSize);
        const progress = Math.round((current / total) * barSize);
        const emptyProgress = barSize - progress;
        const progressText = '▰'.repeat(progress) + '▱'.repeat(emptyProgress);
        return progressText;
    }

    // Format duration
    function formatDuration(ms) {
        if (!ms || ms === 0) return '🔴 LIVE';
        const seconds = Math.floor(ms / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        if (hours > 0) {
            return `${hours}:${String(minutes % 60).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
        }
        return `${minutes}:${String(seconds % 60).padStart(2, '0')}`;
    }

    // Create compact and beautiful embed
    const nowPlayingEmbed = new EmbedBuilder()
        .setTitle('🎵 Đang phát')
        .setDescription(`**[${song.name.length > 60 ? song.name.substring(0, 60) + '...' : song.name}](${song.url})**\n\n` +
            `👤 ${song.user} • ⏱️ \`${formatDuration(song.duration * 1000)}\` • 📍 \`${queue.songs.indexOf(song) + 1}/${queue.songs.length}\``)
        .setColor(client.config.embedColor)
        .setThumbnail(song.thumbnail || client.user.displayAvatarURL({ size: 512 }))
        .addFields({
            name: '📊 Tiến trình',
            value: `\`${createProgressBar(0, song.duration * 1000)}\`\n\`00:00 / ${formatDuration(song.duration * 1000)}\``,
            inline: false
        })
        .setFooter({
            text: `🎶 Yuna Music • ${queue.songs.length} bài trong queue`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    // Essential music controls - clean and minimal
    const controlRow1 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('music_pause_resume')
                .setEmoji(queue.paused ? '▶️' : '⏸️')
                .setStyle(ButtonStyle.Primary),
            new ButtonBuilder()
                .setCustomId('music_skip')
                .setEmoji('⏭️')
                .setStyle(ButtonStyle.Primary)
                .setDisabled(queue.songs.length <= 1),
            new ButtonBuilder()
                .setCustomId('music_stop')
                .setEmoji('⏹️')
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId('music_loop')
                .setEmoji('🔁')
                .setStyle(queue.repeatMode > 0 ? ButtonStyle.Success : ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('music_filter')
                .setEmoji('🎛️')
                .setStyle(ButtonStyle.Secondary)
        );

    // Secondary controls
    const controlRow2 = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('music_queue')
                .setEmoji('📜')
                .setLabel('Queue')
                .setStyle(ButtonStyle.Secondary),
            new ButtonBuilder()
                .setCustomId('music_volume')
                .setEmoji('🔊')
                .setLabel(`${queue.volume}%`)
                .setStyle(ButtonStyle.Secondary)
        );

    try {
        // Delete loading message immediately when song starts (slash commands)
        if (client.loadingInteractions && client.loadingInteractions.has(queue.textChannel.guild.id)) {
            try {
                const loadingInteraction = client.loadingInteractions.get(queue.textChannel.guild.id);
                await loadingInteraction.deleteReply().catch(() => {});
                client.loadingInteractions.delete(queue.textChannel.guild.id);
            } catch (e) {}
        }
        
        // Delete loading message immediately when song starts (prefix commands)
        if (client.prefixLoadingMessages && client.prefixLoadingMessages.has(queue.textChannel.guild.id)) {
            try {
                const loadingMessage = client.prefixLoadingMessages.get(queue.textChannel.guild.id);
                await loadingMessage.delete().catch(() => {});
                client.prefixLoadingMessages.delete(queue.textChannel.guild.id);
            } catch (e) {}
        }
        
        // Clean up old music message
        if (client.musicMessages && client.musicMessages.has(queue.textChannel.guild.id)) {
            try {
                const oldMessage = client.musicMessages.get(queue.textChannel.guild.id);
                if (oldMessage && oldMessage.deletable) {
                    await oldMessage.delete().catch(() => {});
                }
            } catch (e) {}
        }

        const message = await queue.textChannel.send({
            embeds: [nowPlayingEmbed],
            components: [controlRow1, controlRow2]
        });
        
        // Store message for updates and cleanup
        if (!client.musicMessages) client.musicMessages = new Map();
        client.musicMessages.set(queue.textChannel.guild.id, message);
        
        // Auto-update progress every 5 seconds as requested
        const progressInterval = setInterval(async () => {
            try {
                const currentQueue = client.player.getQueue(queue.textChannel.guild.id);
                
                if (!currentQueue || !currentQueue.playing || !message.editable || currentQueue.songs[0]?.id !== song.id) {
                    clearInterval(progressInterval);
                    return;
                }

                const currentTime = currentQueue.currentTime || 0;
                const duration = song.duration * 1000;

                // Update embed with new progress and enhanced info
                const progressBar = createProgressBar(currentTime, duration);
                const currentFormatted = formatDuration(currentTime);
                const durationFormatted = formatDuration(duration);
                
                const updatedEmbed = new EmbedBuilder()
                    .setTitle('🎵 Đang phát')
                    .setDescription(`**[${song.name.length > 60 ? song.name.substring(0, 60) + '...' : song.name}](${song.url})**\n\n` +
                        `👤 ${song.user} • ⏱️ \`${durationFormatted}\` • 📍 \`${currentQueue.songs.indexOf(song) + 1}/${currentQueue.songs.length}\``)
                    .setColor(client.config.embedColor)
                    .setThumbnail(song.thumbnail || client.user.displayAvatarURL({ size: 512 }))
                    .addFields({
                        name: '📊 Tiến trình',
                        value: `${progressBar}\n\`${currentFormatted}\` ━━━━━━━━━━ \`${durationFormatted}\``,
                        inline: false
                    });

                // Update volume button label
                const updatedControlRow2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('music_queue')
                            .setEmoji('📜')
                            .setLabel('Queue')
                            .setStyle(ButtonStyle.Secondary),
                        new ButtonBuilder()
                            .setCustomId('music_volume')
                            .setEmoji('🔊')
                            .setLabel(`${currentQueue.volume}%`)
                            .setStyle(ButtonStyle.Secondary)
                    );

                await message.edit({ 
                    embeds: [updatedEmbed],
                    components: [controlRow1, updatedControlRow2]
                }).catch(() => {
                    clearInterval(progressInterval);
                });

            } catch (error) {
                clearInterval(progressInterval);
            }
        }, 5000);

        // Auto cleanup after song duration
        setTimeout(() => clearInterval(progressInterval), (song.duration * 1000) + 15000);
        
    } catch (error) {
        console.error('Now playing embed error:', error);
        // Simple fallback message
        queue.textChannel.send(`🎵 **${song.name}** đang phát!`).catch(() => {});
    }
}
