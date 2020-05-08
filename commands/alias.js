/*
 *Todo:
 *Imrpove message sent do user to make sure what exactly their issue is / was
 *Add Attachment upload
 *
 *
 *
 *
 */

const reg = new RegExp("(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})");
const MongoClient = require('mongodb').MongoClient;
const logger = require("../modules/logger.js");
const discord = require("discord.js");
let config = require("../config/config.json")
const fs = require("fs");
const uri = "mongodb://localhost:27017/";


module.exports.run = async(client, message, args) => {
    try {

        switch (args[0]) {
            case "list":
                MongoClient.connect(uri, {
                    useUnifiedTopology: true
                }, function(err, db) {
                    if (err) {
                        logger.run("error", err, __filename.split('\\').pop());
                        message.channel.send(":x: Seems like there was an error setting your alias");
                    }
                    var dbo = db.db("Spacesharp");
                    dbo.collection("alias").find().toArray().then(x => {
                        let body = "";
                        x.forEach(entry => {
                            let content = "";
                            entry.content.split(" ").forEach(word => {
                                if (word.match(reg) != null && word.match(reg).length > 0) {
                                    word = word.replace(/^/, '<').replace(/$/, '>');
                                }
                                content += word + " ";
                            })
                            body += `> ${entry.id}.) ${entry.name} => ${content}\n\n`
                        })
                        if (body.length > 2000) {
                            message.channel.send("Error. Please contact an Admin and check the logs :)")
                            throw "Message has over 2000 Characters. Implement a multi message solution";
                        }
                        message.channel.send(body)
                        logger.run("info", "x", __filename.split('\\').pop());
                        db.close();
                    }).catch(err => {
                        logger.run("error", err, __filename.split('\\').pop());
                    });
                }, );

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
                    }, function(err, db) {
                        if (err) {
                            logger.run("error", err, __filename.split('\\').pop());
                            message.channel.send(":x: Seems like there was an error setting your alias");
                        }
                        var dbo = db.db("Spacesharp");
                        dbo.collection("alias").find().toArray().then(x => {
                            let isUnique = true;

                            x.forEach(entry => {
                                if (entry.name == args[1].replace(/^"|"$/g, '')) {
                                    isUnique = false;
                                }
                            })

                            if (isUnique == true) {
                                var myobj = {
                                    id: x.length + 1,
                                    name: args[1].replace(/^"|"$/g, ''),
                                    content: content
                                };
                                // 
                                dbo.collection("alias").insertOne(myobj, function(err, res) {
                                    if (err) {
                                        logger.run("error", err, __filename.split('\\').pop());
                                        message.channel.send(":x: Seems like there was an error setting your alias");
                                    }
                                    logger.run("info", "A new Alias has been added", __filename.split('\\').pop())
                                    db.close();
                                    return message.channel.send(":white_check_mark: Alias **__" + args[1].replace(/^"|"$/g, '') + "__** was created succesfully")
                                });
                            } else {
                                return message.channel.send(":x: An alias with that already exists");
                            }
                        }).catch(err => {
                            logger.run("error", err, __filename.split('\\').pop())
                        })
                    }, );
                } else return message.channel.send(":x: Error creating Alias");

                break;

            case "remove":
                break;

            case "help":
                const embed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Available options for alias')
                    .setThumbnail('https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png')
                    .setDescription('**.alias "name"** | will trigger an alias\n**.alias list** | will list all aliases available\n**.alias add "name" content** | will add a new alias\n**.alias remove "ID"** | will remove the alias')
                    .setTimestamp()
                    .setFooter('This is still a work in progress', 'https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png');
                message.delete(200);
                message.channel.send(``, {
                    embed: embed
                });
                break;

            default:
                MongoClient.connect(uri, {
                    useUnifiedTopology: true
                }, function(err, db) {
                    if (err) {
                        logger.run("error", err, __filename.split('\\').pop());
                        message.channel.send(":x: Seems like there was an error setting your alias");
                    }
                    var dbo = db.db("Spacesharp");
                    dbo.collection("alias").findOne({ name: args[0] }, { _id: 0 }).then(entry => {
                        if (entry != null) {
                            return message.channel.send(entry.content);
                        } else {
                            return message.channel.send(":x: The alias " + args[0] + " doesn't exist. Use `.alias list` to see a list of all availiable options");
                        }

                    }).catch(err => {
                        logger.run("error", err, __filename.split('\\').pop());
                    });
                }, );
                break;
        }
    } catch (error) {
        logger.run("error", error, __filename.split('\\').pop());
    }
}

module.exports.help = {
    name: "alias"
}