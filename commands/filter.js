const db = require("../mongoDB");
module.exports = {
  name: "filter",
  description: "Adds audio filter to ongoing music.",
  permissions: "0x0000000000000800",
  options: [],
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction?.guild?.id })
    lang = lang?.language || client?.language
    lang = require(`../languages/${lang}.js`);
    try {
      const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
      const queue = client?.player?.getQueue(interaction?.guild?.id);
      if (!queue || !queue?.playing) return interaction?.reply({ content: `${lang.msg5}`, flags: 64 }).catch(e => { })

      // Available filters with descriptions
      const filters = [
        { name: '3d', label: '🎧 3D Sound', description: 'Âm thanh vòm 3D immersive' },
        { name: 'bassboost', label: '🔊 Bass Boost', description: 'Tăng cường bass mạnh mẽ' },
        { name: 'echo', label: '🌊 Echo', description: 'Hiệu ứng echo/vọng' },
        { name: 'karaoke', label: '🎤 Karaoke', description: 'Loại bỏ vocal cho karaoke' },
        { name: 'nightcore', label: '⚡ Nightcore', description: 'Tăng tốc + cao hơn' },
        { name: 'vaporwave', label: '🌺 Vaporwave', description: 'Chậm lại + thấp hơn' },
        { name: 'flanger', label: '🌊 Flanger', description: 'Hiệu ứng swoosh/flanger' },
        { name: 'gate', label: '🚪 Gate', description: 'Noise gate filtering' },
        { name: 'haas', label: '🎵 Haas', description: 'Stereo enhancement' },
        { name: 'reverse', label: '⏮️ Reverse', description: 'Đảo ngược âm thanh' },
        { name: 'surround', label: '🌍 Surround', description: 'Âm thanh vòm rộng' },
        { name: 'mcompand', label: '🎚️ Compressor', description: 'Dynamic range compression' },
        { name: 'phaser', label: '🌀 Phaser', description: 'Hiệu ứng phaser/swoosh' },
        { name: 'tremolo', label: '📳 Tremolo', description: 'Biến đổi âm lượng' },
        { name: 'earwax', label: '👂 Earwax', description: 'Vintage warmth effect' }
      ];

      // Get currently active filters
      const activeFilters = [];
      filters.forEach(filter => {
        if (queue?.filters?.has(filter.name)) {
          activeFilters.push(filter.name);
        }
      });

      // Create select menu with active filters highlighted
      const filterSelect = new ActionRowBuilder()
        .addComponents(
          new StringSelectMenuBuilder()
            .setCustomId('filter_select')
            .setPlaceholder('🎛️ Chọn audio filter để bật/tắt')
            .addOptions(
              filters.map(filter => ({
                label: filter.label + (activeFilters.includes(filter.name) ? ' ✅' : ''),
                description: filter.description,
                value: filter.name,
                emoji: activeFilters.includes(filter.name) ? '✅' : '⚪'
              }))
            )
        );

      // Control buttons
      const controlRow = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId('filter_clear_all')
            .setLabel('🗑️ Clear All')
            .setStyle(ButtonStyle.Danger)
            .setDisabled(activeFilters.length === 0),
          new ButtonBuilder()
            .setCustomId('filter_close')
            .setLabel('❌ Close')
            .setStyle(ButtonStyle.Secondary)
        );

      let embed = new EmbedBuilder()
        .setColor(client?.config?.embedColor)
        .setTitle('🎛️ Audio Filters')
        .setDescription(`**🎵 Đang phát:** ${queue.songs[0]?.name || 'Unknown'}\n\n` +
          `**🎚️ Filters đang bật:** ${activeFilters.length > 0 ? 
            activeFilters.map(f => `\`${f}\``).join(', ') : '`Không có`'}\n\n` +
          `💡 **Hướng dẫn:** Chọn filter từ menu để bật/tắt`)
        .setThumbnail(queue.songs[0]?.thumbnail || client.user.displayAvatarURL())
        .setFooter({ 
          text: `🎶 Yuna Music | ${filters.length} filters available`,
          iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp()
      return await interaction.reply({ 
        embeds: [embed], 
        components: [filterSelect, controlRow] 
      }).catch(e => { })

  } catch (e) {
    const errorNotifer = require("../functions.js")
   errorNotifer(client, interaction, e, lang)
    }
  },
};
