const Discord = require("discord.js");
const logger = require("./logger.js");
const oneDay = 86500000;

module.exports.run = async (client, member) => {
    // work in progress
    // return;
    try {
        if (member.guild.id == '699964879003713568') {
            var embed = new Discord.MessageEmbed()
                .setColor('#FA759E')
                .setTitle('A new User Joined __Spacesharp__')
                .setThumbnail(member.user.avatarUrl)
                .setDescription(`\
            __Username:__ ${member.user.username}\n\
            __User:__ <@${member.id}>\n\
            __Account created:__ ${(new Date(member.user.createdTimestamp)).toUTCString()}\n\
            __Account joined:__ ${(new Date(member.joinedTimestamp)).toUTCString()}\n\
            __Approx. Age:__ ${Math.round(((new Date()) - member.user.createdTimestamp) / oneDay)} Days`)
                .setTimestamp()
                .setFooter(`User ID: ${member.id}`, 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684')
            client.channels.cache.get('708713756104065044').send(``, {
                embed: embed
            })
        } else {
            var embed = new Discord.MessageEmbed()
                .setColor('#FA759E')
                .setTitle('A new User Joined __Spaceglider__')
                .setThumbnail(member.user.avatarUrl)
                .setDescription(`\
            __Username:__ ${member.user.username}\n\
            __User:__ <@${member.id}>\n\
            __Account created:__ ${(new Date(member.user.createdTimestamp)).toUTCString()}\n\
            __Account joined:__ ${(new Date(member.joinedTimestamp)).toUTCString()}\n\
            __Approx. Age:__ ${Math.round(((new Date()) - member.user.createdTimestamp) / oneDay)} Days`)
                .setTimestamp()
                .setFooter(`User ID: ${member.id}`, 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684')
            client.channels.cache.get('708713756104065044').send(``, {
                embed: embed
            })
        }
    } catch (error) {
        logger.run("error", error)
    }
}