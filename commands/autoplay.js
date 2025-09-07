const { EmbedBuilder } = require("discord.js");
const db = require("../mongoDB");

module.exports = {
  name: "autoplay",
  description: "Toggle the autoplay of the queue.",
  options: [],
  permissions: "0x0000000000000800",
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id }).catch(e => {})
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);
    
    try {
        const queue = client?.player?.getQueue(interaction?.guild?.id);
        if (!queue || !queue?.playing) {
            return interaction?.reply({ content: lang.msg5, flags: 64 }).catch(e => { })
        }
        
        // Toggle autoplay and get current state
        const wasAutoplayOn = queue.autoplay;
        queue.toggleAutoplay();
        const isAutoplayOn = queue.autoplay;
        
        // Create beautiful response embed
        const autoplayEmbed = new EmbedBuilder()
            .setTitle(isAutoplayOn ? '✅ Autoplay Bật - Autoplay ON' : '❌ Autoplay Tắt - Autoplay OFF')
            .setColor(isAutoplayOn ? '00FF00' : 'FF0000')
            .setDescription(isAutoplayOn ? 
                '🎵 **Autoplay đã được bật!**\n\nBot sẽ tự động phát những bài nhạc liên quan khi queue kết thúc.' :
                '⏹️ **Autoplay đã được tắt!**\n\nBot sẽ dừng phát nhạc khi queue kết thúc.'
            )
            .addFields([
                {
                    name: isAutoplayOn ? '🔄 Trạng thái' : '⏸️ Trạng thái',
                    value: isAutoplayOn ? '`Tự động phát nhạc liên quan`' : '`Dừng khi hết queue`',
                    inline: true
                },
                {
                    name: '🎶 Queue hiện tại',
                    value: `**${queue.songs.length}** bài nhạc trong queue`,
                    inline: true
                },
                {
                    name: '📊 Thông tin',
                    value: `Volume: **${queue.volume}%**\nRepeat: **${queue.repeatMode === 0 ? 'Off' : queue.repeatMode === 1 ? 'Song' : 'Queue'}**`,
                    inline: true
                }
            ])
            .setFooter({
                text: '🎶 Yuna Music | Autoplay Settings',
                iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();

        interaction?.reply({ embeds: [autoplayEmbed] }).then(message => {
            // Auto delete after 15 seconds
            setTimeout(async () => {
                try {
                    await interaction.deleteReply().catch(() => {});
                } catch (e) {}
            }, 15000);
        }).catch(e => {
            // Fallback to simple message
            const fallbackMessage = isAutoplayOn ? 
                '✅ **Autoplay đã bật!** Bot sẽ tự động phát nhạc liên quan.' : 
                '❌ **Autoplay đã tắt!** Bot sẽ dừng khi hết queue.';
            
            interaction?.reply({ content: fallbackMessage }).then(msg => {
                setTimeout(() => {
                    msg.delete().catch(() => {});
                }, 15000);
            }).catch(() => {});
        });
    
    } catch (e) {
        console.error('Autoplay command error:', e);
        const errorNotifer = require("../functions.js")
        errorNotifer(client, interaction, e, lang)
    }
  },
};
