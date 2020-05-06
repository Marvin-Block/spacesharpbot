const Discord = require("discord.js");
const logger = require("../modules/logger.js")

module.exports.run = async (client, message, args) => {
    try {
        if (args[0] == undefined) {
            let user = client.users.cache.get(message.author.id)
            const embed = new Discord.MessageEmbed()
                .setColor(53380)
                .setTitle("Hier der Avatar von " + user.username)
                .setImage(user.displayAvatarURL({dynamic:true,size:4096}))
            message.channel.send({
                embed: embed
            })

        } else {
            const mentioned = args[0].replace(/^\D+|\D+$/g, "")
            let user = client.users.cache.get(mentioned)
            const embed = new Discord.MessageEmbed()
                .setColor(53380)
                .setTitle("Hier der Avatar von " + user.username)
                .setImage(user.displayAvatarURL({dynamic:true,size:4096}))
            message.channel.send({
                embed: embed
            })

        }
    } catch (error) {
        logger.run("error", error)
    }
}

module.exports.help = {
    name: "avatar"
}