const logger = require("../modules/logger.js")
const discord = require("discord.js");
const fs = require("fs")


module.exports.run = async(client, message, args) => {
    try {
        switch (args[0]) {
            case "list":
                let modules = [];
                fs.readdirSync(process.cwd() + "/modules/").forEach(function(file) {
                    if (file.match(/\.js$/) !== null && file !== 'index.js') {
                        let name = file.replace('.js', '');
                        modules.push(name);
                    };
                });
                message.channel.send(`___List of currently loaded modules___\n\`\`\`${modules}\`\`\``)
                break;

            case "reload":

                break;

            default:
                const embed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Available modules')
                    .setThumbnail('https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png')
                    .addField('list', '[]')
                    .addField('reload', '[Module name]')
                    .addField('unload', '[Module name]')
                    .addField('coming', "soon")
                    .setTimestamp()
                    .setFooter('This is still a work in progress', 'https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png');
                message.channel.send(``, {
                    embed: embed
                });
                break;
        }
    } catch (error) {
        console.log(error)
        logger.run("error", error)
    }
}

module.exports.help = {
    name: "modules"
}