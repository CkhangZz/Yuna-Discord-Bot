const { EmbedBuilder } = require("discord.js");
const db = require("../../mongoDB");

module.exports = async (client, textChannel, error) => {
    console.error('DisTube Error:', error);
    
    if (!textChannel) return;

    let lang = await db?.musicbot?.findOne({ guildID: textChannel?.guild?.id })
    lang = lang?.language || client.language
    lang = require(`../../languages/${lang}.js`);

    // Create user-friendly error messages
    let errorTitle = '❌ Oops! Có lỗi xảy ra - Something went wrong';
    let errorMessage = 'Đã xảy ra lỗi không mong muốn.';
    let suggestions = [];

    // Analyze error and provide specific solutions
    if (error.message?.includes('Sign in to confirm your age')) {
        errorTitle = '🔞 Video bị hạn chế độ tuổi - Age Restricted';
        errorMessage = 'Video này yêu cầu xác thực độ tuổi và không thể phát được.';
        suggestions = [
            '✅ Tìm kiếm version khác không bị hạn chế',
            '✅ Thử tên bài hát thay vì link YouTube',
            '✅ Tìm cover version hoặc lyric video'
        ];
    } else if (error.message?.includes('This video is not available')) {
        errorTitle = '🚫 Video không khả dụng - Video Unavailable';
        errorMessage = 'Video này không tồn tại hoặc đã bị xóa.';
        suggestions = [
            '✅ Kiểm tra link có đúng không',
            '✅ Tìm video khác cùng bài hát',
            '✅ Dùng tên bài hát để tìm kiếm'
        ];
    } else if (error.message?.includes('private')) {
        errorTitle = '🔒 Video riêng tư - Private Video';
        errorMessage = 'Video này đã được đặt ở chế độ riêng tư.';
        suggestions = [
            '✅ Thử link video công khai khác',
            '✅ Tìm kiếm bằng tên bài hát'
        ];
    } else if (error.message?.includes('copyright')) {
        errorTitle = '©️ Bản quyền - Copyright Issue';
        errorMessage = 'Video này bị chặn do vấn đề bản quyền.';
        suggestions = [
            '✅ Tìm cover version',
            '✅ Thử acoustic version',
            '✅ Tìm trên SoundCloud'
        ];
    } else if (error.message?.includes('network') || error.message?.includes('timeout')) {
        errorTitle = '🌐 Lỗi mạng - Network Error';
        errorMessage = 'Có vấn đề với kết nối mạng.';
        suggestions = [
            '✅ Thử lại sau vài giây',
            '✅ Kiểm tra kết nối internet',
            '✅ Dùng link khác nếu có'
        ];
    } else {
        // Generic error
        suggestions = [
            '✅ Thử lại với bài khác',
            '✅ Dùng link YouTube chính thức',
            '✅ Liên hệ admin nếu lỗi tiếp tục'
        ];
    }

    const errorEmbed = new EmbedBuilder()
        .setTitle(errorTitle)
        .setColor('FF4757')
        .setDescription(`${errorMessage}\n\n**💡 Cách khắc phục:**\n${suggestions.join('\n')}`)
        .addFields([
            {
                name: '🔧 Debug Info',
                value: `\`\`\`${error.message?.slice(0, 100) || 'Unknown error'}\`\`\``,
                inline: false
            }
        ])
        .setFooter({
            text: '🎶 Yuna Music | Xin lỗi vì sự cố này! 💖',
            iconURL: client.user.displayAvatarURL()
        })
        .setTimestamp();

    try {
        await textChannel.send({ embeds: [errorEmbed] }).then(message => {
            // Auto delete error message after 15 seconds
            setTimeout(() => {
                message.delete().catch(() => {});
            }, 15000);
        });
    } catch (e) {
        // Fallback to simple message if embed fails
        textChannel.send(`❌ **Lỗi:** ${error.message?.slice(0, 100) || 'Có lỗi xảy ra'}\n💡 Hãy thử lại với bài khác nhé!`).then(message => {
            setTimeout(() => {
                message.delete().catch(() => {});
            }, 15000);
        }).catch(() => {});
    }
}
