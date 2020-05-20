const discord = require("discord.js");
const config = require("../config/config.json")
const logger = require("../modules/logger.js")
const https = require('https')
const request = require('requestretry')
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb://localhost:27017/";
const APIurl = "https://lizenz.lol-script.com/api/spacesharp/testlicence?pass=2d2pPb6BNcylbrHhZLsRItjOMpj04k3QsgiS0p5w11pdD3SG4FPE6pq6sMTPOiUBYNN0Sf4CkYRW5no1ghXDftZusanYonGJcojK1ypcxFzoNYsJ2naNRHxpuOEac4m1"


module.exports.run = async(message) => {
    try {
        if (message.channel.parent.id == config.supportID) {
            let DiscordID = await message.channel.messages.cache.array()[0].content.split(" ")[0];
            //[message.channel.messages.cache.array.array().length - 1].content.split(" ")[0];
            let reg = /\d/
            var embed = new discord.MessageEmbed()
                .setColor('#FA759E')
                .setTitle('I\'m here to help you <a:wavey:710870264778588250>')
                .setDescription('Welcome to our Automated Ticket System or in short ATS.\nI will try my best to Assist you with your Issues, Problems and Questions.\nPlease reply with one of the Following Numbers.\n\n**1.)** I want to have a Trial and Test Spacesharp before i buy it.\n\n**2.)** I want a refund.\n\n**3.)** I want to report a Bug or an Issue.\n\n**4.)** I have a Problem with my Purchase or my Product (HWID).')
                .setTimestamp()
                .setFooter('Hello there General Kenobi', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
            message.channel.send(`${DiscordID}\n***REPLY WITH NUMBERS 1 TO 4 ONLY***`, {
                embed: embed
            });
            const filter = m => m.content.match(reg)

            const collector = message.channel.createMessageCollector(filter, { time: 3600000, max: 5 });

            collector.on('collect', collected => {
                switch (collected.content) {
                    case "1":
                        MongoClient.connect(uri, {
                            useUnifiedTopology: true
                        }, function(err, db) {
                            if (err) {
                                logger.run("error", err, __filename.split('\\').pop());
                                message.channel.send(":x: Seems like there was an error");
                            }
                            var dbo = db.db("Spacesharp");
                            dbo.collection("license").find({ UserID: { $eq: collected.author.id } }).toArray().then(x => {
                                if (x.length < 1) {
                                    var myobj = {
                                        UserID: collected.author.id
                                    };
                                    // 
                                    dbo.collection("license").insertOne(myobj, function(err, res) {
                                        if (err) {
                                            logger.run("error", err, __filename.split('\\').pop());
                                            message.channel.send(":x: Seems like there was an error");
                                        }
                                        logger.run("info", "A new license has been added", __filename.split('\\').pop())
                                        db.close();
                                        let data = '';



                                        request({
                                            url: APIurl,
                                            json: false,
                                            maxAttempts: 5,  // (default) try 5 times 
                                            retryDelay: 1500, // (default) wait for 5s before trying again
                                            retrySrategy: request.RetryStrategies.HTTPOrNetworkError // (default) retry on 5xx or network errors
                                          }, function(err, response, body){
                                            // this callback will only be called when the request succeeded or after maxAttempts or on error 
                                            if(response.attempts >= 5){
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('That was not supposed to happen')
                                                    .setDescription("There Seems to have been an ***Error*** Please message <@!322659763643088897>")
                                                    .setTimestamp()
                                                    .setFooter('UwU', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                                                message.channel.send(``, {
                                                    embed: embed
                                                });
                                                //message.channel.send(`${DiscordID} Please click on the 🔒 on the first message to close the ticket.`);
                                            }else{
                                                var embed = new discord.MessageEmbed()
                                                    .setColor('#FA759E')
                                                    .setTitle('Take your trial, hope you enjoy it')
                                                    .setDescription(body)
                                                    .setTimestamp()
                                                    .setFooter('UwU', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
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
                                        .setDescription('You already asked for a trial. Or at least your Discord UserID is in our Databse. If you think this is a mistake make sure to ping any of the Staff Members :)')
                                        .setTimestamp()
                                        .setFooter('How dare you ask for more than you can swallow', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
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
                    case "2":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('We dont do refunds <:cryrage:710881155532062871>')
                            .setDescription('As we stated in our [Terms of Service](https://lol-script.com/terms_and_conditions/), and as you have agreed to, we do not give any kind of refund. It is your own responsibility for purchasing this product without using the 1 Day Version to test it.')
                            .setTimestamp()
                            .setFooter('Who told you you\'d get a refund', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "3":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('So you wanna report a bug ? <:monkabigs:710896245526495243>')
                            .setDescription('If you have a bug or any kind of Problem with our Product please follow the Template:\n\nVersion Number:\n\nWhat did you want to do:\n\nWhat happened:\n\nWere you able to reproduce it?\n\nHow did you reproduce the Issue?\n\n If it happened Ingame, please include the logs file and Screenshots / Videos')
                            .setTimestamp()
                            .setFooter('Did i hear bugs ? GIMME GIMME', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    case "4":
                        var embed = new discord.MessageEmbed()
                            .setColor('#FA759E')
                            .setTitle('Okay, Let\'s see <:bigglass:710896245530427402>')
                            .setDescription('If you\'ve just bought our Product and didn\'t recieve a mail yet, Please be a bit more Patient. It will surely arrive. If you have an Issue with your Productkey please mention <@!650128095856033794> or <@!306082546209521664>')
                            .setTimestamp()
                            .setFooter('We\'ll figure this out, dont worry.', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                        message.channel.send(``, {
                            embed: embed
                        });
                        break;
                    default:
                        if (message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")) {
                            return;
                        } else {
                            var embed = new discord.MessageEmbed()
                                .setColor('#FA759E')
                                .setTitle('I\'m here to help you <a:wavey:710870264778588250>')
                                .setDescription('Make sure to only respond 1, 2 or 3 :)')
                                .setTimestamp()
                                .setFooter('Can you even read ?', 'https://media.discordapp.net/attachments/710857562874183762/710861055248695366/Spacesharp.png?width=684&height=684');
                            message.channel.send(``, {
                                embed: embed
                            });
                        }
                        break;
                }
            });
        }
    } catch (error) {
        logger.run("error", error, __filename.split('\\').pop())
    }
}