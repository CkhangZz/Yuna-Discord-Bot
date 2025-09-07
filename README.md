# 🎶 Yuna Music - Cute Discord Music Bot

[![Yuna Music](https://img.shields.io/badge/Yuna%20Music-v1.0.0-ff66cc?style=for-the-badge&logo=discord)](https://discord.com/oauth2/authorize?client_id=1311707212359663737)
[![Language](https://img.shields.io/badge/Languages-Vietnamese%20%7C%20English-blue?style=for-the-badge)](languages)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/en)

> **🌟 Một bot nhạc Discord dễ thương với giao diện màu hồng tím và hỗ trợ tiếng Việt!**  
> **🌟 A cute Discord music bot with pink-purple theme and Vietnamese support!**

---

## ✨ Tính năng chính - Main Features

### 🎵 **Nguồn nhạc - Music Sources**
- ✅ **YouTube** - Phát nhạc từ YouTube
- ✅ **Link trực tiếp** - Direct MP3/Stream links
- ✅ **Spotify** (via YouTube) - Tìm và phát từ Spotify
- ✅ **SoundCloud** - Hỗ trợ SoundCloud

### 🎨 **Giao diện đẹp - Beautiful Interface**
- 💖 **Màu chủ đạo**: Tím hồng (#ff66cc)
- 🖼️ **Thumbnail** bài nhạc tự động
- 📊 **Thanh tiến trình** (progress bar) trong thời gian thực
- 🎪 **Embed dễ thương** với thông tin chi tiết

### 🎮 **Điều khiển tương tác - Interactive Controls**
- ⏸️ **Pause/Resume** - Tạm dừng/Tiếp tục
- ⏭️ **Skip** - Bỏ qua bài
- ⏹️ **Stop** - Dừng nhạc  
- 📜 **Queue** - Xem hàng đợi
- 🔁 **Loop** - Lặp bài/queue
- 🔀 **Shuffle** - Trộn bài
- 🔊 **Volume** - Điều chỉnh âm lượng

### 🌟 **Tính năng đặc biệt - Special Features**
- 🚀 **24/7 Mode** - Bot không rời voice channel
- 🎯 **Auto-play** - Tự động gợi ý bài tiếp theo
- 🎚️ **Audio Filters** - Bass boost, nightcore, v.v.
- 💾 **Personal Playlists** - Lưu playlist cá nhân
- 🌐 **Đa ngôn ngữ** - Tiếng Việt & English

---

## 🚀 Cài đặt nhanh - Quick Setup

### 1. **Clone repository**
```bash
git clone https://github.com/CkhangZz/YunaMusic.git
cd YunaMusic
```

### 2. **Cài đặt dependencies**
```bash
npm install
```

### 3. **Cấu hình config.js**
```js
module.exports = {
    TOKENS: ["YOUR_BOT_TOKEN_HERE"], 
    ownerID: ["YOUR_DISCORD_ID"],
    mongodbURL: "YOUR_MONGODB_URL",
    language: "vi", // "vi" cho tiếng Việt, "en" cho English
    embedColor: "ff66cc", // Màu hồng tím của Yuna
    
    // 24/7 Mode Configuration
    opt: {
        voiceConfig: {
            leaveOnFinish: false,  // Không rời khi hết nhạc
            leaveOnStop: false,    // Không rời khi stop
            leaveOnEmpty: {
                status: false      // 24/7 mode
            }
        }
    }
}
```

### 4. **Khởi chạy bot**
```bash
node index.js
```

---

## 📋 Danh sách lệnh - Commands List

### 🎵 **Phát nhạc - Music Playback**
| Lệnh | Mô tả | Ví dụ |
|------|-------|-------|
| `/play [tên bài]` | Phát nhạc từ tên hoặc link | `/play normal Chúng ta của hiện tại` |
| `/play playlist [tên]` | Phát playlist đã lưu | `/play playlist My Favorites` |
| `/search [tên bài]` | Tìm và chọn nhạc | `/search vpop 2024` |

### ⏯️ **Điều khiển - Playback Controls**
| Lệnh | Mô tả |
|------|-------|
| `/pause` | Tạm dừng nhạc |
| `/resume` | Tiếp tục phát |
| `/skip` | Bỏ qua bài hiện tại |
| `/stop` | Dừng và xóa queue |
| `/volume [1-200]` | Điều chỉnh âm lượng |

### 📜 **Queue Management**
| Lệnh | Mô tả |
|------|-------|
| `/queue` | Hiển thị hàng đợi |
| `/nowplaying` | Bài đang phát |
| `/loop` | Chế độ lặp |
| `/shuffle` | Trộn queue |
| `/clear` | Xóa queue |

### 🔧 **Cấu hình - Configuration**
| Lệnh | Mô tả |
|------|-------|
| `/filter [tên]` | Áp dụng filter âm thanh |
| `/autoplay` | Bật/tắt auto-play |
| `/language` | Thay đổi ngôn ngữ |

---

## 🎨 Giao diện Now Playing - Now Playing Interface

```
🎵 Đang phát - Now Playing
[Tên bài hát](link)

🎤 Tên bài hát: "Chúng ta của hiện tại"
🔗 Link nhạc: [Nghe tại đây](youtube.com/...)
⏱️ Thời lượng: 4:20
👤 Yêu cầu bởi: @User
📍 Vị trí: 1/5

📊 Tiến trình: ▰▰▰▱▱▱▱▱▱▱
            1:30 / 4:20

[⏸️ Tạm dừng] [⏭️ Bỏ qua] [⏹️ Dừng] [📜 Queue]
[🔁 Lặp] [🔀 Trộn] [🔉 Vol -] [🔊 Vol +]
```

---

## 🔧 Cấu hình chi tiết - Detailed Configuration

<details>
<summary>📂 Cấu trúc file config.js đầy đủ</summary>

```js
module.exports = {
    // Bot Configuration
    TOKENS: ["YOUR_BOT_TOKEN"],
    ownerID: ["YOUR_DISCORD_USER_ID"],
    botInvite: "YOUR_BOT_INVITE_LINK",
    supportServer: "YOUR_SUPPORT_SERVER_INVITE", 
    mongodbURL: "YOUR_MONGODB_CONNECTION_STRING",
    
    // Bot Status & Appearance
    status: '🎶 Yuna Music',
    language: "vi", // vi (Tiếng Việt) hoặc en (English)
    embedColor: "ff66cc", // Màu hồng tím đặc trưng
    
    // Playlist Settings
    playlistSettings: {
        maxPlaylist: 30,    // Tối đa 30 playlist/user
        maxMusic: 100,      // Tối đa 100 bài/playlist
    },

    // Advanced Options
    opt: {
        // DJ Role Commands
        DJ: {
            commands: ['back', 'clear', 'filter', 'loop', 'pause', 'resume', 'skip', 'stop', 'volume', 'shuffle']
        },

        // 24/7 Voice Channel Configuration  
        voiceConfig: {
            leaveOnFinish: false,   // Bot không rời khi hết nhạc
            leaveOnStop: false,     // Bot không rời khi dừng
            leaveOnEmpty: {
                status: false,      // 24/7 mode - ở lại khi channel trống
                cooldown: 10000000,
            },
        },

        maxVol: 200, // Âm lượng tối đa
    },

    // Vote Manager (Optional)
    voteManager: {
        status: false,          // Bật/tắt yêu cầu vote
        api_key: "",           // Top.gg API key
        vote_commands: [...],  // Commands cần vote
        vote_url: "",          // Link vote
    }
}
```
</details>

---

## 🌈 Tùy chỉnh - Customization

### 🎨 **Thay đổi màu sắc**
```js
embedColor: "ff66cc"  // Hồng tím (mặc định)
embedColor: "ff1493"  // Hồng đậm  
embedColor: "da70d6"  // Orchid
embedColor: "ba55d3"  // Medium Orchid
```

### 🌐 **Thay đổi ngôn ngữ**
```js
language: "vi"  // Tiếng Việt
language: "en"  // English
```

### 🔊 **Audio Filters có sẵn**
- `bass` - Bass boost
- `8d` - 8D audio
- `nightcore` - Nightcore effect
- `vaporwave` - Vaporwave
- `karaoke` - Karaoke mode

---

## 🛠️ Khắc phục sự cố - Troubleshooting

### ❌ **Lỗi thường gặp**

<details>
<summary>🔴 Bot không phản hồi lệnh</summary>

**Nguyên nhân:**
- Token không đúng
- Quyền bot chưa đủ
- Bot chưa được mời vào server

**Giải pháp:**
1. Kiểm tra token trong config.js
2. Mời bot với quyền Administrator
3. Restart bot: `node index.js`
</details>

<details>
<summary>🔴 Không phát được nhạc</summary>

**Nguyên nhân:**
- Không kết nối voice channel
- Link nhạc không hợp lệ
- Thiếu dependencies

**Giải pháp:**
1. Vào voice channel trước khi dùng lệnh
2. Thử với link YouTube khác
3. Chạy `npm install` lại
</details>

<details>
<summary>🔴 MongoDB connection error</summary>

**Giải pháp:**
1. Tạo database MongoDB miễn phí tại [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Copy connection string vào `mongodbURL`
3. Whitelist IP address của bạn
</details>

---

## 🤝 Đóng góp - Contributing

Chúng tôi rất hoan nghênh mọi đóng góp! 

### 📝 **Cách đóng góp:**
1. **Fork** repository này
2. Tạo **branch** mới: `git checkout -b feature/TenTinhNang`
3. **Commit** thay đổi: `git commit -m 'Thêm tính năng mới'`
4. **Push** lên branch: `git push origin feature/TenTinhNang`  
5. Tạo **Pull Request**

### 🐛 **Báo lỗi:**
- Mở [issue mới](https://github.com/CkhangZz/YunaMusic/issues)
- Mô tả chi tiết lỗi và cách tái hiện
- Đính kèm log lỗi nếu có

---

## 📄 Giấy phép - License

Dự án này được phát hành dưới giấy phép **MIT License**.

---

## 💖 Lời cảm ơn - Acknowledgments

- 🎵 **DisTube** - Core music functionality
- 🤖 **Discord.js** - Discord API wrapper  
- 🎶 **YouTube** - Music source
- 💜 **Community** - Bug reports and suggestions

---

## 📞 Hỗ trợ - Support

### 🆘 **Cần trợ giúp?**
- 📧 **Email**: support@yunamusic.dev
- 💬 **Discord**: [Support Server](https://discord.gg/w9M6YBWdSk)

### 🌟 **Follow us:**
- 📱 **GitHub**: [@CkhangZz](https://github.com/CkhangZz/Yuna-Discord-Bot.git)

---

<div align="center">

### 💖 Made with love by Yuna Music Team

**🎶 Cảm ơn bạn đã sử dụng Yuna Music! 💫**

</div>




