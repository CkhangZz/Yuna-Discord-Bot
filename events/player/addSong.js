const { EmbedBuilder } = require("discord.js");
const db = require("../../mongoDB");

module.exports = async (client, queue, song) => {
    let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../../languages/${lang}.js`);
    
    if (!queue?.textChannel) return;

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

    // Create cute add song embed
    const addSongEmbed = new EmbedBuilder()
        .setTitle('➕ Đã thêm vào queue - Added to Queue')
        .setColor(client.config.embedColor)
        .setDescription(`**[${song.name}](${song.url})**`)
        .addFields(
            {
                name: '👤 Yêu cầu bởi - Requested by',
                value: `<@${song.user.id}>`,
                inline: true
            },
            {
                name: '⏱️ Thời lượng - Duration', 
                value: `\`${formatDuration(song.duration * 1000)}\``,
                inline: true
            },
            {
                name: '📍 Vị trí - Position',
                value: `\`${queue.songs.length}\``,
                inline: true
            }
        )
        .setThumbnail(song.thumbnail || client.user.displayAvatarURL())
        .setFooter({
            text: `🎶 Yuna Music | ${queue.songs.length} bài trong queue 💖`,
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    try {
        const message = await queue.textChannel.send({ embeds: [addSongEmbed] });
        
        // Auto delete after 10 seconds to keep chat clean
        setTimeout(() => {
            message.delete().catch(() => {});
        }, 10000);
        
    } catch (error) {
        // Fallback to simple message
        queue.textChannel.send({ content: `<@${song.user.id}>, **${song.name}** ${lang.msg79}` }).catch(e => {});
    }
}
