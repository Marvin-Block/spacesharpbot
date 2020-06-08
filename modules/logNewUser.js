const Discord = require("discord.js");
const logger = require("../modules/logger.js")

module.exports.run = async(client, member) => {
    // work in progress
    // return;
    try {
        var embed = new discord.MessageEmbed()
            .setColor('#FA759E')
            .setTitle('A new User Joined')
            setThumbnail(member.user.avatarUrl())
            .setDescription(`\
            __Username:__ ${member.user.username}\n\n\
            __Account created:__ ${member.user.createdAt}\n\n\
            __Account joined:__ ${member.joinedAt}\n\n\
            `)
            .setTimestamp()
            .setFooter('UserID: ' + member.id, 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
        client.channels.cache.get('708713756104065044').send(``, {
            embed: embed
        })
        console.log(member.user.createdAt)
    } catch (error) {
        logger.run("error", error)
    }
}