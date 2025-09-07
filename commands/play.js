const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const db = require("../mongoDB");
module.exports = {
  name: "play",
  description: "Play a track.",
  permissions: "0x0000000000000800",
  options: [
    {
      name: "name",
      description: "Write your music name or URL.",
      type: ApplicationCommandOptionType.String,
      required: true
    },
    {
      name: "playlist",
      description: "Play from saved playlist (optional).",
      type: ApplicationCommandOptionType.String,
      required: false
    }
  ],
  voiceChannel: true,
  run: async (client, interaction) => {
    let lang = await db?.musicbot?.findOne({ guildID: interaction.guild.id })
    lang = lang?.language || client.language
    lang = require(`../languages/${lang}.js`);

    try {
      let playlistOption = interaction.options.getString('playlist')
      let nameOption = interaction.options.getString('name')

      // If playlist option is provided, play from playlist
      if (playlistOption) {
        let playlistw = playlistOption
        
        // Enhanced playlist search
        let playlist = await db?.playlist?.find().catch(e => { 
            console.error('Playlist query error:', e);
            return [];
        })
        
        if (!playlist?.length > 0) {
            return interaction.reply({ 
                content: `❌ **Không tìm thấy playlist nào!**\n\n💡 **Hướng dẫn tạo playlist:**\n• Dùng \`/playlist create [tên]\` để tạo playlist mới\n• Dùng \`/save\` khi đang nghe nhạc để lưu bài vào playlist`, 
                flags: 64 
            }).catch(e => { })
        }

        let arr = 0
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i]?.playlist?.filter(p => p.name === playlistw)?.length > 0) {

            let playlist_owner_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].author
            let playlist_public_filter = playlist[i].playlist.filter(p => p.name === playlistw)[0].public

            if (playlist_owner_filter !== interaction.member.id) {
              if (playlist_public_filter === false) {
                return interaction.reply({ content: lang.msg53, flags: 64 }).catch(e => { })
              }
            }

            const music_filter = playlist[i]?.musics?.filter(m => m.playlist_name === playlistw)
            if (!music_filter?.length > 0) return interaction.reply({ content: lang.msg54, flags: 64 }).catch(e => { })

            interaction.reply({ content: lang.msg56 }).catch(e => { })

            // Store loading interaction for playlist
            if (!client.loadingInteractions) client.loadingInteractions = new Map();
            client.loadingInteractions.set(interaction.guild.id, interaction);

            let songs = []
            music_filter.map(m => songs.push(m.music_url))

            setTimeout(async () => {
              const playl = await client?.player?.createCustomPlaylist(songs, {
                member: interaction.member,
                properties: { name: playlistw, source: "custom" },
                parallel: true
              });

              await interaction.editReply({ content: lang.msg57.replace("{interaction.member.id}", interaction.member.id).replace("{music_filter.length}", music_filter.length) }).catch(e => { })

              try {
                await client.player.play(interaction.member.voice.channel, playl, {
                  member: interaction.member,
                  textChannel: interaction.channel,
                  interaction
                })
                // Playlist loading message will be deleted by playSong event
                
              } catch (e) {
                await interaction.editReply({ content: lang.msg60, flags: 64 }).catch(e => { })
                // Clean up loading reference on error
                if (client.loadingInteractions?.has(interaction.guild.id)) {
                  client.loadingInteractions.delete(interaction.guild.id);
                }
              }

              playlist[i]?.playlist?.filter(p => p.name === playlistw).map(async p => {
                await db.playlist.updateOne({ userID: p.author }, {
                  $pull: {
                    playlist: {
                      name: playlistw
                    }
                  }
                }, { upsert: true }).catch(e => { })

                await db.playlist.updateOne({ userID: p.author }, {
                  $push: {
                    playlist: {
                      name: p.name,
                      author: p.author,
                      authorTag: p.authorTag,
                      public: p.public,
                      plays: Number(p.plays) + 1,
                      createdTime: p.createdTime
                    }
                  }
                }, { upsert: true }).catch(e => { })
              })
            }, 3000)
          } else {
            arr++
            if (arr === playlist.length) {
              return interaction.reply({ 
                content: `❌ **Không tìm thấy playlist "${playlistw}"!**\n\n💡 **Gợi ý:**\n• Kiểm tra tên playlist có đúng không\n• Dùng \`/playlist list\` để xem tất cả playlist\n• Playlist có thể đang ở chế độ private`, 
                flags: 64 
              }).catch(e => { })
            }
          }
        }
      }

      // If no playlist option, play the song from name option
      if (!playlistOption) {
        const name = nameOption
        if (!name) return interaction.reply({ content: lang.msg59, flags: 64 }).catch(e => { })

        // Create cute loading embed
        const loadingEmbed = new EmbedBuilder()
          .setTitle('⏳ Đang tìm nhạc... - Searching for music...')
          .setDescription(`🔍 Đang tìm kiếm: **${name}**\n\n💫 Yuna đang tìm bài nhạc hay nhất cho bạn...`)
          .setColor(client.config.embedColor)
          .setThumbnail('https://cdn.discordapp.com/attachments/1234567890123456789/1234567890123456789/loading_music.gif')
          .setFooter({
            text: '🎶 Yuna Music | Vui lòng đợi một chút nhé! 💖',
            iconURL: client.user.displayAvatarURL()
          })
          .setTimestamp();

        await interaction.reply({ embeds: [loadingEmbed] }).catch(e => { })
        
        // Show typing indicator
        await interaction.followUp({ content: '⌨️' }).then(msg => {
          setTimeout(() => msg.delete().catch(() => {}), 1000);
        }).catch(() => {});

        try {
          // Enhanced search - try multiple approaches
          let searchQuery = name;
          
          // If it's a URL, use directly
          if (name.includes('youtube.com') || name.includes('youtu.be') || name.includes('spotify.com') || name.includes('soundcloud.com')) {
            searchQuery = name;
          } else {
            // For search queries, enhance them
            searchQuery = name + " official audio";
          }

          // Store loading interaction globally so playSong can delete it
          if (!client.loadingInteractions) client.loadingInteractions = new Map();
          client.loadingInteractions.set(interaction.guild.id, interaction);
          
          await client.player.play(interaction.member.voice.channel, searchQuery, {
            member: interaction.member,
            textChannel: interaction.channel,
            interaction
          })
          
          // Backup timeout - delete loading embed if not deleted by playSong event
          setTimeout(async () => {
            try {
              if (client.loadingInteractions?.has(interaction.guild.id)) {
                const loadingInteraction = client.loadingInteractions.get(interaction.guild.id);
                await loadingInteraction.deleteReply().catch(() => {});
                client.loadingInteractions.delete(interaction.guild.id);
              }
            } catch (e) {}
          }, 8000); // 8 seconds backup
          
        } catch (error) {
          console.error('Play error:', error);
          
          // Clean up loading interaction on error
          if (client.loadingInteractions?.has(interaction.guild.id)) {
            client.loadingInteractions.delete(interaction.guild.id);
          }
          
          let errorMessage = 'Không tìm thấy bài nhạc!';
          let suggestions = [];
          
          // More specific error messages
          if (error.message?.includes('private') || error.message?.includes('unavailable')) {
            errorMessage = 'Video không khả dụng hoặc bị riêng tư!';
            suggestions.push('✅ Thử với video công khai khác');
            suggestions.push('✅ Tìm kiếm bằng tên bài hát');
          } else if (error.message?.includes('age') || error.message?.includes('restricted')) {
            errorMessage = 'Video bị hạn chế độ tuổi!';
            suggestions.push('✅ Thử với tên bài hát thay vì link');
            suggestions.push('✅ Tìm version khác của bài này');
          } else if (error.message?.includes('copyright')) {
            errorMessage = 'Video bị chặn bản quyền!';
            suggestions.push('✅ Tìm cover version');
            suggestions.push('✅ Thử tên tiếng Anh');
          } else {
            // Generic error - provide helpful suggestions
            suggestions.push('✅ Kiểm tra tên bài hát có đúng không');
            suggestions.push('✅ Thử thêm tên ca sĩ');
            suggestions.push('✅ Dùng link YouTube trực tiếp');
            suggestions.push('✅ Thử tìm tiếng Anh nếu là nhạc Việt');
          }
          
          const errorEmbed = new EmbedBuilder()
            .setTitle('❌ Lỗi - Error')
            .setDescription(`${errorMessage}\n\n**🔍 Tìm kiếm:** \`${name}\`\n\n**💡 Gợi ý:**\n${suggestions.join('\n')}`)
            .setColor('FF6B6B')
            .addFields([
              {
                name: '🎵 Ví dụ lệnh đúng:',
                value: '`/play normal Sơn Tùng MTP`\n`/play normal https://youtube.com/watch?v=...`\n`/play normal Chúng ta của hiện tại`',
                inline: false
              }
            ])
            .setFooter({
              text: '🎶 Yuna Music | Hãy thử lại với gợi ý trên nhé! 💖',
              iconURL: client.user.displayAvatarURL()
            })
            .setTimestamp();
            
          await interaction.editReply({ embeds: [errorEmbed] }).then(() => {
            // Auto delete error message after 10 seconds
            setTimeout(async () => {
              try {
                await interaction.deleteReply().catch(() => {});
              } catch (e) {}
            }, 10000);
          }).catch(e => { })
        }
      }
    } catch (e) {
      const errorNotifer = require("../functions.js")
     errorNotifer(client, interaction, e, lang)
      }
  },
};
