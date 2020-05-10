/*
 *Todo:
 *Multiple word Issue name (track quotationmarks for start / end)
 *
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
    //work in progress
    return;
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
                    dbo.collection("issue").find().toArray().then(x => {
                        let body = "";
                        x.forEach(entry => {
                            let issue = "";
                            let fix = "";
                            entry.Issue.split(" ").forEach(word => {
                                if (word.match(reg) != null && word.match(reg).length > 0) {
                                    word = word.replace(/^/, '<').replace(/$/, '>');
                                }
                                issue += word + " ";
                            })
                            if (entry.Fix == null) return;
                            entry.Fix.split(" ").forEach(word => {
                                if (word.match(reg) != null && word.match(reg).length > 0) {
                                    word = word.replace(/^/, '<').replace(/$/, '>');
                                }
                                fix += word + " ";
                            })
                            body += `> ${entry.IssueID}.) ${entry.IssueName} => ${issue}\nFix: ${fix}\n\n`
                        })
                        if (body.length > 2000) {
                            message.channel.send(":x: Error. Please contact an Admin and check the logs :)")
                            throw "Message has over 2000 Characters. Implement a multi message solution";
                        } else if (body.length == 0) {
                            message.channel.send(":x: There are no entries in this list.")
                        } else {
                            message.channel.send(body)
                        };

                        db.close();
                    }).catch(err => {
                        logger.run("error", err, __filename.split('\\').pop());
                    });
                }, );

                break;

            case "create":
                if (args.length <= 2) return message.channel.send(":x: Error creating Issue")
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
                            message.channel.send(":x: Seems like there was an error setting your issue");
                        }
                        var dbo = db.db("Spacesharp");
                        dbo.collection("issue").find().toArray().then(x => {
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
                                    IssueID: num + 1,
                                    IssueName: args[1].replace(/^"|"$/g, ''),
                                    Issue: content,
                                    Fix: null
                                };
                                // 
                                dbo.collection("issue").insertOne(myobj, function(err, res) {
                                    if (err) {
                                        logger.run("error", err, __filename.split('\\').pop());
                                        message.channel.send(":x: Seems like there was an error setting your issue");
                                    }
                                    logger.run("info", "A new issue has been added", __filename.split('\\').pop())
                                    db.close();
                                    return message.channel.send(":white_check_mark: issue **__" + args[1].replace(/^"|"$/g, '') + "__** was created succesfully")
                                });
                            } else {
                                return message.channel.send(":x: An issue with that already exists");
                            }
                        }).catch(err => {
                            logger.run("error", err, __filename.split('\\').pop())
                        })
                    }, );
                } else return message.channel.send(":x: Error creating issue");

                break;

            case "fix":

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
                        dbo.collection("issue").deleteMany({}).then(x => {
                            message.channel.send(":white_check_mark: All entries have been delelted.")
                            logger.run("info", "All documents, from the collection issue have been dropped.", __filename.split('\\').pop());
                            db.close();
                        }).catch(err => {
                            logger.run("error", err, __filename.split('\\').pop());
                        });
                    } else {
                        dbo.collection("issue").deleteOne({
                            name: args[1]
                        }).then(x => {
                            message.channel.send(":white_check_mark: The issue " + args[1] + " has been removed.")
                            logger.run("info", "An issue has been removed.", __filename.split('\\').pop());
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
                    .setTitle('Available options for issue')
                    .setThumbnail('https://cdn.discordapp.com/attachments/438099932964978692/705434926786543775/signs.png')
                    .setDescription('**' + config.prefix + 'issue "name"** | will trigger an issue\n**' + config.prefix + 'issue list** | will list all issuees available\n**' + config.prefix + 'issue add "name" content** | will add a new issue\n**' + config.prefix + 'issue remove "ID"** | will remove the issue')
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
                        message.channel.send(":x: Seems like there was an error setting your issue");
                    }
                    var dbo = db.db("Spacesharp");
                    dbo.collection("issue").findOne({
                        name: args[0]
                    }, {
                        _id: 0
                    }).then(entry => {
                        if (entry != null) {
                            message.delete();
                            return message.channel.send(entry.content);
                        } else {
                            message.delete();
                            return message.channel.send(":x: The issue " + args[0] + " doesn't exist. Use `" + config.prefix + "issue list` to see a list of all availiable options");
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
    name: "issue"
}