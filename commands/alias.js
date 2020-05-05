/*
 *Todo:
 *Imrpove message sent do user to make sure what exactly their issue is / was
 *
 *
 *
 *
 *
 */



const MongoClient = require('mongodb').MongoClient;
const logger = require("../modules/logger.js");
const discord = require("discord.js");
let alias = require("../data/alias.json");
let config = require("../config/config.json")
const fs = require("fs");
const uri = "mongodb://localhost:27017/";


module.exports.run = async (client, message, args) => {
    try {

        switch (args[0]) {
            case "list":
                break;

            case "add":
                if (args.length <= 2) return message.channel.send(":x: Error creating Alias")
                if (args[1].startsWith('"') && args[1].endsWith('"') && args[1].replace(/^"|"$/g, '').length != 0) {
                    let content = ""
                    for (let i = 2; i < args.length; i++) {
                        content += args[i] + ' '
                    }
                    MongoClient.connect(uri, {
                        useUnifiedTopology: true
                    }, function (err, db) {
                        if (err) {
                            logger.run("error", err, __filename.split('\\').pop());
                            message.channel.send(":x: Seems like there was an error setting your alias");
                        }
                        var dbo = db.db("Spacesharp");
                        var myobj = {
                            name: args[1].replace(/^"|"$/g, ''),
                            content: content
                        };
                        // 
                        dbo.collection("alias").insertOne(myobj, function (err, res) {
                            if (err) {
                                logger.run("error", err, __filename.split('\\').pop());
                                message.channel.send(":x: Seems like there was an error setting your alias");
                            }
                            logger.run("info", "A new Alias has been added", __filename.split('\\').pop())
                            db.close();
                        });
                    }, );
                    message.channel.send(":white_check_mark: Alias **__" + args[1].replace(/^"|"$/g, '') + "__** was created succesfully")
                } else return message.channel.send(":x: Error creating Alias")

                break;

            case "remove":
                break;

            case "help":
                const embed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Available options for alias')
                    .setThumbnail('https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png')
                    .setDescription('**.alias list** | will list all aliases available\n**.alias add "name" content** | will add a new alias\n**.alias remove "ID"** | will remove the alias')
                    .setTimestamp()
                    .setFooter('This is still a work in progress', 'https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png');
                message.channel.send(``, {
                    embed: embed
                });
                break;

            default:
                break;
        }
    } catch (error) {
        logger.run("error", error, __filename.split('\\').pop());
    }
}

module.exports.help = {
    name: "alias"
}