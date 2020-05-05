const Discord = require("discord.js");
const logger = require("../modules/logger.js")

module.exports.run = async(client, message, args) => {
    try {
        if (args[0] == undefined) {
            client.fetchUser(message.author.id).then(function(value) {
                const embed = new Discord.RichEmbed()
                    .setColor(53380)
                    .setTitle("Hier der Avatar von " + value.username)
                    .setImage(value.displayAvatarURL)
                message.channel.send({
                    embed: embed
                })
            })
        } else {
            const mentioned = args[0].replace(/^\D+|\D+$/g, "")
            client.fetchUser(mentioned).then(function(value) {
                const embed = new Discord.RichEmbed()
                    .setColor(53380)
                    .setTitle("Hier der Avatar von " + value.username)
                    .setImage(value.displayAvatarURL)
                message.channel.send({
                    embed: embed
                })
            })
        }
    } catch (error) {
        logger.run("error", error)
    }
}

module.exports.help = {
    name: "avatar"
}