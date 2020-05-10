const Discord = require("discord.js");
const logger = require("../modules/logger.js")

module.exports.run = async(client, oldstate, newstate) => {
    // work in progress
    return;
    try {
        if (oldstate.channelID == null) {
            console.log(newstate.member.voice, Date.now())
        } else if (newstate.channelID == null) {
            console.log(oldstate.member.voice, Date.now())
        }
    } catch (error) {
        logger.run("error", error)
    }
}