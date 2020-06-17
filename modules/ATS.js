const discord = require("discord.js");
const config = require("../config/config.json")
const logger = require("../modules/logger.js")
const request = require('requestretry')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";
const spacesharpAPI = "https://lizenz.lol-script.com/api/spacesharp/testlicence?pass=2d2pPb6BNcylbrHhZLsRItjOMpj04k3QsgiS0p5w11pdD3SG4FPE6pq6sMTPOiUBYNN0Sf4CkYRW5no1ghXDftZusanYonGJcojK1ypcxFzoNYsJ2naNRHxpuOEac4m1"
const spacegliderAPI = "https://lizenz.lol-script.com/api/spaceglider/testlicence?pass=2d2pPb6BNcylbrHhZLsRItjOMpj04k3QsgiS0p5w11pdD3SG4FPE6pq6sMTPOiUBYNN0Sf4CkYRW5no1ghXDftZusanYonGJcojK1ypcxFzoNYsJ2naNRHxpuOEac4m1"
const logo = "https://cdn.discordapp.com/attachments/716556635841101825/716871076344234084/NEW-LOGO-GIF-v3.gif"
const oneDay = 86500000;


module.exports.run = async (message) => {
    try {
        if (message.channel.parent.id == config.supportID) {
            let DiscordID = await message.channel.messages.cache.array()[0].content.split(" ")[0];
            //Debugging
            //if (DiscordID != "<@715574457598476319>") return;
            let reg = /\d/
            var embed = new discord.MessageEmbed()
                .setColor('#FA759E')
                .setTitle('I\'m here to help you <a:wavey:710870264778588250>')
                .setDescription('Welcome to our Automated Ticket System or in short ATS.\n\
                    I will try my best to Assist you with your Issues, Problems and Questions.\n\
                    Please reply with one of the Following Numbers.\n\n\
                    **1.)** I want to have a Trial and Test Spacesharp before i buy it.\n\n\
                    **2.)** I want to report a Bug or an Issue.\n\n\
                    **3.)** I have a Problem with my Purchase or my Product (HWID).\n\n\
                    **4.)** None of the Above')
                .setTimestamp()
                .setFooter('Hello there General Kenobi', logo);
            message.channel.send(`${DiscordID}\nPlease reply with ***1***, ***2***, ***3*** or ***4***`, {
                embed: embed
            });
            const filter = m => m.content.match(reg)

            const collector = message.channel.createMessageCollector(filter, {
                time: 3600000,
            });

            collector.on('collect', collected => {
                //debuggin
                //if (collected.author.id != "715574457598476319") return;
                if (collected.content.startsWith("1.)") || collected.content.startsWith("1.") || collected.content.startsWith("1.)I want to have a Trial and Test Spacesharp before i buy it.".toLowerCase)) {
                    collected.content = "1";
                }
                switch (collected.content) {
                    case "1":
                        if ((Math.round((new Date()) - collected.author.createdTimestamp) / oneDay) < 1) return message.channel.send("It seems that your account is younger than 24hours. You'll have to wait until your account is at least a day old to get a Trial key.")
                        MongoClient.connect(uri, {
                            useUnifiedTopology: true
                        }, function (err, db) {
                            if (err) {
                                logger.run("error", err, __filename.split('\\').pop());
                                message.channel.send(":x: Seems like there was an error");
                            }
                            var dbo = db.db("Spacesharp");
                            dbo.collection("license").find({
                                UserID: {
                                    $eq: collected.author.id
                                }
                            }).toArray().then(x => {
                                if (x.length < 1) {
                                    var myobj = {
                                        UserID: collected.author.id
                                    };
                                    // 
                                    dbo.collection("license").insertOne(myobj, function (err, res) {
                                        if (err) {
                                            logger.run("error", err, __filename.split('\\').pop());
                                            message.channel.send(":x: Seems like there was an error");
                                        }
                                        logger.run("info", "A new license has been added", __filename.split('\\').pop())
                                        db.close();
                                        let data = '';
                                        request({
                                            url: spacesharpAPI,
                                            json: false,
                                            maxAttempts: 5, // (default) try 5 times 
                                            retryDelay: 1500, // (default) wait for 5s before trying again
                                            retrySrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
                                        }, function (err, response, body) {
                                            // this callback will only be called when the request succeeded or after maxAttempts or on error 
                                            if (response.statusCode >= 200 && response.statusCode < 300) {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('Take your trial, hope you enjoy it')
                                                    .setDescription(body)
                                                    .setTimestamp()
                                                    .setFooter('UwU', logo);
                                                message.channel.send(``, {
                                                    embed: embed
                                                });
                                                message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);
                                            } else {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('That was not supposed to happen')
                                                    .setDescription("There Seems to have been an **Error** Please message <@!322659763643088897>")
                                                    .setTimestamp()
                                                    .setFooter('UwU', logo);
                                                message.channel.send(``, {
                                                    embed: embed
                                                });
                                            }
                                            if (response) {
                                                //console.log('The number of request attempts: ' + response.attempts);
                                            }
                                        })
                                    });
                                } else {
                                    var embed = new discord.MessageEmbed()
                                        .setColor('#FA759E')
                                        .setTitle('Seems like you already had your Trial <:Spout:711654821157142598>')
                                        .setDescription('You already asked for a trial. If you think this is a mistake make sure to ping any of the Staff Members :)')
                                        .setTimestamp()
                                        .setFooter('How dare you ask for more than you can swallow', logo);
                                    message.channel.send(``, {
                                        embed: embed
                                    });
                                    message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);

                                }
                            }).catch(err => {
                                logger.run("error", err, __filename.split('\\').pop())
                            })
                        }, );

                        break;
                        // case "2":
                        //     var embed = new discord.MessageEmbed()
                        //         .setColor('#FA759E')
                        //         .setTitle('We dont do refunds <:cryrage:710881155532062871>')
                        //         .setDescription('As we stated in our [Terms of Service](https://lol-script.com/terms_and_conditions/), and as you have agreed to, we do not give any kind of refund. It is your own responsibility for purchasing this product without using the 1 Day Version to test it.')
                        //         .setTimestamp()
                        //         .setFooter('Who told you you\'d get a refund', logo);
                        //     message.channel.send(``, {
                        //         embed: embed
                        //     });
                        //     break;
                    case "2":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('So you wanna report a bug ? <:monkabigs:710896245526495243>')
                            .setDescription('If you have a bug or any kind of Problem with our Product please follow the Template:\n\nVersion Number:\n\nWhat did you want to do:\n\nWhat happened:\n\nWere you able to reproduce it?\n\nHow did you reproduce the Issue?\n\n If it happened Ingame, please include the logs file and Screenshots / Videos')
                            .setTimestamp()
                            .setFooter('Did i hear bugs ? GIMME GIMME', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "3":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('Okay, Let\'s see <:bigglass:710896245530427402>')
                            .setDescription('If you\'ve just bought our Product and didn\'t recieve a mail yet, Please be a bit more Patient. It will surely arrive. If you have an Issue with your Productkey please mention <@!650128095856033794> or <@!306082546209521664>')
                            .setTimestamp()
                            .setFooter('We\'ll figure this out, dont worry.', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "4":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('Okay, Let\'s see <:bigglass:710896245530427402>')
                            .setDescription('Dont worry, our Staff-Team will respond shortly. Please be patient.')
                            .setTimestamp()
                            .setFooter('We\'ll figure this out, dont worry.', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    default:
                        break;
                }
            });
        } else if (message.channel.parent.id == '601190196230225948') {
            let DiscordID = await message.channel.messages.cache.array()[0].content.split(" ")[0];
            //Debugging
            //if (DiscordID != "<@715574457598476319>") return;
            let reg = /\d/
            var embed = new discord.MessageEmbed()
                .setColor('#FA759E')
                .setTitle('I\'m here to help you <a:wavey:710870264778588250>')
                .setDescription('Welcome to our Automated Ticket System or in short ATS.\n\
                    I will try my best to Assist you with your Issues, Problems and Questions.\n\
                    Please reply with one of the Following Numbers.\n\n\
                    **1.)** I want to have a Trial and Test Spaceglider before i buy it.\n\n\
                    **2.)** I want to report a Bug or an Issue.\n\n\
                    **3.)** I have a Problem with my Purchase or my Product (HWID).\n\n\
                    **4.)** None of the Above')
                .setTimestamp()
                .setFooter('Hello there General Kenobi', logo);
            message.channel.send(`${DiscordID}\nPlease reply with ***1***, ***2*** or ***3***`, {
                embed: embed
            });
            const filter = m => m.content.match(reg)

            const collector = message.channel.createMessageCollector(filter, {
                time: 3600000,
                max: 5
            });

            collector.on('collect', collected => {
                //debuggin
                //if (collected.author.id != "715574457598476319") return;
                if (collected.content.startsWith("1.)") || collected.content.startsWith("1.") || collected.content.startsWith("1.)I want to have a Trial and Test Spaceglider before i buy it.".toLowerCase)) {
                    collected.content = "1";
                }
                switch (collected.content) {
                    case "1":
                        if (Math.floor((new Date()) - new Date(collected.author.createdAt).valueOf()) < 1) return message.channel.send("It seems that your account is younger than 24hours. You'll have to wait until your account is at least a day old to get a Trial key.")
                        MongoClient.connect(uri, {
                            useUnifiedTopology: true
                        }, function (err, db) {
                            if (err) {
                                logger.run("error", err, __filename.split('\\').pop());
                                message.channel.send(":x: Seems like there was an error");
                            }
                            var dbo = db.db("Spaceglider");
                            dbo.collection("license").find({
                                UserID: {
                                    $eq: collected.author.id
                                }
                            }).toArray().then(x => {
                                if (x.length < 1) {
                                    var myobj = {
                                        UserID: collected.author.id
                                    };
                                    // 
                                    dbo.collection("license").insertOne(myobj, function (err, res) {
                                        if (err) {
                                            logger.run("error", err, __filename.split('\\').pop());
                                            message.channel.send(":x: Seems like there was an error");
                                        }
                                        logger.run("info", "A new license has been added", __filename.split('\\').pop())
                                        db.close();
                                        let data = '';
                                        request({
                                            url: spacegliderAPI,
                                            json: false,
                                            maxAttempts: 5, // (default) try 5 times 
                                            retryDelay: 1500, // (default) wait for 5s before trying again
                                            retrySrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
                                        }, function (err, response, body) {
                                            // this callback will only be called when the request succeeded or after maxAttempts or on error 
                                            if (response.attempts >= 5) {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('That was not supposed to happen')
                                                    .setDescription("There Seems to have been an ***Error*** Please message <@!322659763643088897>")
                                                    .setTimestamp()
                                                    .setFooter('UwU', logo);
                                                message.channel.send(``, {
                                                    embed: embed
                                                });
                                                //message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);
                                            } else {
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('Take your trial, hope you enjoy it')
                                                    .setDescription(body)
                                                    .setTimestamp()
                                                    .setFooter('UwU', logo);
                                                message.channel.send(``, {
                                                    embed: embed
                                                });
                                                message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);
                                            }
                                            if (response) {
                                                //console.log('The number of request attempts: ' + response.attempts);
                                            }
                                        })
                                    });
                                } else {
                                    var embed = new discord.MessageEmbed()
                                        .setColor('#FA759E')
                                        .setTitle('Seems like you already had your Trial <:Spout:711654821157142598>')
                                        .setDescription('You already asked for a trial. If you think this is a mistake make sure to ping any of the Staff Members :)')
                                        .setTimestamp()
                                        .setFooter('How dare you ask for more than you can swallow', logo);
                                    message.channel.send(``, {
                                        embed: embed
                                    });
                                    message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);

                                }
                            }).catch(err => {
                                logger.run("error", err, __filename.split('\\').pop())
                            })
                        }, );

                        break;
                        // case "2":
                        //     var embed = new discord.MessageEmbed()
                        //         .setColor('#FA759E')
                        //         .setTitle('We dont do refunds <:cryrage:710881155532062871>')
                        //         .setDescription('As we stated in our [Terms of Service](https://lol-script.com/terms_and_conditions/), and as you have agreed to, we do not give any kind of refund. It is your own responsibility for purchasing this product without using the 1 Day Version to test it.')
                        //         .setTimestamp()
                        //         .setFooter('Who told you you\'d get a refund', logo);
                        //     message.channel.send(``, {
                        //         embed: embed
                        //     });
                        //     break;
                    case "2":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('So you wanna report a bug ? <:monkabigs:710896245526495243>')
                            .setDescription('If you have a bug or any kind of Problem with our Product please follow the Template:\n\nWhat did you want to do:\n\nWhat happened:\n\nWere you able to reproduce it?\n\nHow did you reproduce the Issue?\n\n If it happened Ingame, please include the logs file and Screenshots / Videos')
                            .setTimestamp()
                            .setFooter('Did i hear bugs ? GIMME GIMME', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "3":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('Okay, Let\'s see <:bigglass:710896245530427402>')
                            .setDescription('If you\'ve just bought our Product and didn\'t recieve a mail yet, Please be a bit more Patient. It will surely arrive. If you have an Issue with your Productkey please mention <@!650128095856033794> or <@!306082546209521664>')
                            .setTimestamp()
                            .setFooter('We\'ll figure this out, dont worry.', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "4":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('Okay, Let\'s see <:bigglass:710896245530427402>')
                            .setDescription('Dont worry, our Staff-Team will respond shortly. Please be patient.')
                            .setTimestamp()
                            .setFooter('We\'ll figure this out, dont worry.', logo);
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    default:
                        //just do nothing i guess
                        break;
                }
            });
        }
    } catch (error) {
        logger.run("error", error, __filename.split('\\').pop())
    }
}