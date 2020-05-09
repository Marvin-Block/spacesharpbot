const Discord = require("discord.js");
const config = require("../config/config.json")
const logger = require("../modules/logger.js")

module.exports.run = async(client, channel, reaction) => {
    try {
        if (channel != null) {
            if (channel.parent.id == config.supportID)
                channel.send("Welcome to our ATS (Automated Ticket System). What can we help you with ?")
        }
        if (reaction != null) {
            if (reaction.message.channel.parent.id == config.supportID) {
                console.log(reaction)
            }
        }

    } catch (error) {
        logger.run("error", error)
    }
}