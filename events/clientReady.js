const config = require("../config.js");
const { ActivityType } = require("discord.js")

module.exports = async (client, token) => {
    // This is the new clientReady event for Discord.js v14+
    let lang = client.language
    lang = require(`../languages/${lang}.js`);

    if (config.mongodbURL || process.env.MONGO) {
        const { REST } = require("@discordjs/rest");
        const { Routes } = require("discord-api-types/v10");
        const rest = new REST({ version: "10" }).setToken(token);
        
        try {
            await rest.put(Routes.applicationCommands(client.user.id), {
                body: await client.commands,
            });
            console.log("✅ " + lang.loadslash)
        } catch (err) {
            console.log("❌ " + lang.error3 + err);
        }

        console.log("🎵 " + client.user.username + lang.ready);
        
        // Set activity status
        setInterval(() => {
            client.user.setActivity({ 
                name: `${config.status} -  ${Number(client?.shard?.ids) + 1 ? Number(client?.shard?.ids) + 1 : ""}`, 
                type: ActivityType.Listening 
            });
        }, 10000);
        
        client.errorLog = config.errorLog;
    } else {
        console.log("⚠️ " + lang.error4);
    }

    // Top.gg auto poster (if enabled)
    if (client.config.voteManager.status === true && client.config.voteManager.api_key) {
        const { AutoPoster } = require('topgg-autoposter');
        const ap = AutoPoster(client.config.voteManager.api_key, client);
        ap.on('posted', () => {
            console.log('📊 Posted stats to Top.gg');
        });
    }
}
