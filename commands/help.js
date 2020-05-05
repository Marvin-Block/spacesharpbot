const logger = require("../modules/logger.js")

module.exports.run = async(client, message, args) => {
    try {
        let commands = [];
        client.commands.forEach(x => commands.push(` ${x.help.name}`))
        message.channel.send(`___List of loaded commands___\n\`\`\`${commands}\`\`\``);

    } catch (error) {
        logger.run("error", error)
    }
}

module.exports.help = {
    name: "help"
}