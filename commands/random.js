const discord = require("discord.js");
const request = require("node-superfetch");
var config = require("../config/config.json");

module.exports.run = async(client, message, args) => {
    try {
        if (message.channel.id !== config.gifchat) {
            if (message.author.id !== config.ownerID) return;
        }
        const mentioned = [];
        const {
            body
        } = await request
            .get('https://api.tenor.com/v1/search')
            .query({
                q: 'random',
                key: config.tenorkey,
                limit: 15
            });
        const embed = new discord.RichEmbed()
            .setColor(53380)
            .setImage(body.results[Math.floor(Math.random() * body.results.length)].media[0].gif.url);
        message.mentions.members.forEach(x => mentioned.push(`${x.nickname}`))
        return message.channel.send({
            embed: embed
        });
    } catch (err) {
        logger.run("error", err)
    }
}

module.exports.help = {
    name: "random"
}