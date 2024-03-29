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
const Pagination = require('discord-paginationembed');
const fs = require("fs");
const uri = "mongodb://localhost:27017/";

/**
 * Returns an array with arrays of the given size.
 *
 * @param myArray {Array} Array to split
 * @param chunkSize {Integer} Size of every group
 */
function chunkArray(myArray, chunk_size) {
    var results = [];

    while (myArray.length) {
        results.push(myArray.splice(0, chunk_size));
    }

    return results;
}

module.exports.run = async(client, message, args) => {
    try {
        switch (args[0]) {
            case "list":
                MongoClient.connect(uri, {
                    useUnifiedTopology: true
                }, function(err, db) {
                    if (err) {
                        logger.run("error", err, __filename.split('\\').pop());
                        message.channel.send(":x: Error");
                    }
                    var dbo = db.db("Spacesharp");
                    dbo.collection("alias").find().toArray().then(x => {
                        let body = [];
                        x.forEach(entry => {
                            let content = "";
                            entry.content.split(" ").forEach(word => {
                                if (word.match(reg) != null && word.match(reg).length > 0) {
                                    word = word.replace(/^/, '<').replace(/$/, '>');
                                }
                                content += word + " ";
                            })
                            body.push(`${entry.id}.) "**${entry.name}**"  ${content}\n\n`);
                        });

                        if (body.length == 0) {
                            message.channel.send(":x: There are no entries in this list.")
                        } else {

                            var result = chunkArray(body, 5);

                            const embeds = [];

                            for (let i = 0; i <= result.length; i++) {
                                let embed = new discord.MessageEmbed()
                                    .setColor('#FA759E')
                                    .setTitle('Here is your List of Aliases')
                                    .setDescription(result[i])
                                    .setTimestamp()
                                    .setFooter("'sup bitch :)", 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                                embeds.push(embed);
                            }
                            new Pagination.Embeds()
                                .setArray(embeds)
                                .setAuthorizedUsers([message.author.id])
                                .setChannel(message.channel)
                                .setPageIndicator(true)
                                .setPage(1)
                                .build();
                        };

                        db.close();
                    }).catch(err => {
                        logger.run("error", err, __filename.split('\\').pop());
                    });
                }, );

                break;

            case "add":
                if (args.length <= 2) return message.channel.send(":x: Error creating Alias")
                if (args[1].startsWith('"') && args[1].endsWith('"') && args[1].replace(/^"|"$/g, '').length != 0) {
                    //let content = "";
                    let content = message.content.split(message.content.match(/(["])(?:(?=(\\?))\2.)*?\1/)[0])[1]
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
                            let num = 0;
                            x.forEach(entry => {
                                if (entry.id > num) {
                                    num = entry.id;
                                }

                                if (entry.name == args[1].replace(/^"|"$/g, '')) {
                                    isUnique = false;
                                }
                            })

                            if (isUnique == true) {
                                var myobj = {
                                    id: parseInt(num + 1),
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
                                    return message.channel.send(":white_check_mark: Alias **__" + args[1].replace(/^"|"$/g, '') + "__** was created succesfully (ID: " + parseInt(num + 1))
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
                MongoClient.connect(uri, {
                    useUnifiedTopology: true
                }, function(err, db) {
                    if (err) {
                        logger.run("error", err, __filename.split('\\').pop());
                        message.channel.send(":x: Error");
                    }
                    var dbo = db.db("Spacesharp");
                    if (args[1] == "all" && message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")) {
                        dbo.collection("alias").deleteMany({}).then(x => {
                            message.channel.send(":white_check_mark: All entries have been delelted.")
                            logger.run("info", "All documents, from the collection alias have been dropped.", __filename.split('\\').pop());
                            db.close();
                        }).catch(err => {
                            logger.run("error", err, __filename.split('\\').pop());
                        });
                    } else {
                        dbo.collection("alias").deleteOne({
                            id: parseInt(args[1])
                        }).then(x => {
                            message.channel.send(":white_check_mark: The alias " + args[1] + " has been removed.")
                            logger.run("info", "An alias has been removed.", __filename.split('\\').pop());
                            db.close();
                        }).catch(err => {
                            logger.run("error", err, __filename.split('\\').pop());
                        });
                    }

                }, );

                break;

            case "help":
                const embed = new discord.MessageEmbed()
                    .setColor('#0099ff')
                    .setTitle('Available options for alias')
                    .setThumbnail('https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png')
                    .setDescription('**' + config.prefix + 'alias "name"** | will trigger an alias\n**' + config.prefix + 'alias list** | will list all aliases available\n**' + config.prefix + 'alias add "name" content** | will add a new alias\n**' + config.prefix + 'alias remove "ID"** | will remove the alias')
                    .setTimestamp()
                    .setFooter('This is still a work in progress', 'https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png');
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
                    dbo.collection("alias").findOne({
                        name: args[0]
                    }, {
                        _id: 0
                    }).then(entry => {
                        if (entry != null) {
                            message.delete();
                            return message.channel.send(entry.content);
                        } else {
                            message.delete();
                            return message.channel.send(":x: The alias " + args[0] + " doesn't exist. Use `" + config.prefix + "alias list` to see a list of all availiable options");
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