const logger = require("../modules/logger.js");
const discord = require("discord.js");
const config = require("../config/config.json");
const fs = require("fs");


module.exports.run = async(client, message, args) => {
    return;
    //Have to finish this when i'm not actually feeling like literal trash :)
    try {
        switch (args[0]) {
            case "config":
                if (message.guild.members.cache.get(message.author.id).hasPermission("ADMINISTRATOR")) {
                    if (args.length <= 2) return message.channel.send(":x: Expected 3 arguments. eg. config token newtoken")
                    fs.readFile('./config/config.json', 'utf8', function readFileCallback(err, data) {
                        if (err) {
                            console.log(err)
                            logger.run("error", err)
                        } else {
                            obj = JSON.parse(data); //now it an object
                            for (let [key, value] of Object.entries(obj)) {}
                            //add some data
                            // json = JSON.stringify(obj); //convert it back to json
                            // fs.writeFile('myjsonfile.json', json, 'utf8', callback); // write it back 
                        }
                    });

                }
                break;

            case "reload":

                break;

            default:

                break;
        }
    } catch (error) {
        console.log(error)
        logger.run("error", error)
    }
}

module.exports.help = {
    name: "edit"
}