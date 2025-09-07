const db = require("../../mongoDB");
module.exports = async (client, queue, playlist) => {
let lang = await db?.musicbot?.findOne({ guildID: queue?.textChannel?.guild?.id })
lang = lang?.language || client.language
lang = require(`../../languages/${lang}.js`);
queue?.textChannel?.send({ content: `<@${playlist.user.id}>, \`${playlist.name} (${playlist.songs.length + " " + lang.msg116})\` ${lang.msg62}` }).then(message => {
    // Auto delete after 10 seconds
    setTimeout(() => {
        message.delete().catch(() => {});
    }, 10000);
}).catch(e => { })
}
