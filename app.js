const logger = require("./modules/logger.js")
let config = require("./config/config.json");
const discord = require("discord.js");
const watch = require("node-watch");
const fs = require('fs');
const newdate = new Date();
const client = new discord.Client({
    disableEveryone: true,
    autoReconnect: true
});

client.commands = new discord.Collection();


//load modules out of modules directory
try {
    logger.run("info", `===Loading Modules===`, __filename.split('\\').pop())
    fs.readdirSync(__dirname + '/modules/').forEach(function(file) {
        if (file.match(/\.js$/) !== null && file !== 'index.js') {
            logger.run("info", `${file} loaded!`, __filename.split('\\').pop())
            let name = file.replace('.js', '');
            exports[name] = require('./modules/' + file);
        }
    });
} catch (err) {
    logger.run("error", err, __filename.split('\\').pop());
}

//load commands out of commands directory
try {
    fs.readdir("./commands/", (err, files) => {
        let jsfile = files.filter(f => f.split(".").pop() === "js")
        if (jsfile.length <= 0) {
            logger.run("info", `Couldn't find commands.`, __filename.split('\\').pop())
            return;
        }
        logger.run("info", `===Loading Commands===`, __filename.split('\\').pop())
        jsfile.forEach((f, i) => {
            let props = require(`./commands/${f}`);
            logger.run("info", `${f} loaded!`, __filename.split('\\').pop())
            client.commands.set(props.help.name, props);
        });
    });
} catch (err) {
    logger.run("error", err, __filename.split('\\').pop());
}

//Ready event ( Set Activity & refresh config in case of change)
client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels.`);
    logger.run("info", `Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels.`, __filename.split('\\').pop());
    client.user.setActivity(`https://discord.gg/9AQv2pF`);
    watch('./config/config.json', function(evt, name) {
        logger.run("info", `${evt} ${name}`, __filename.split('\\').pop());
        if (evt === 'update') {
            delete require.cache[require.resolve('./config/config.json')];
            config = require('./config/config.json');
        }
    }); //refresh config.json whenever a change happens
});

//Handle Commands
client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type === "dm") return;
    if (message.content.indexOf(config.prefix) !== 0) return;
    let prefix = config.prefix;
    let content = message.content.replace(/\s+/g, ' ').trim().split(" ");
    let cmd = content[0];
    let args = content.slice(1);
    let file = client.commands.get(cmd.slice(prefix.length));
    if (file) file.run(client, message, args);
});

//Handle Modules
client.on("message", async message => {
    //exports.module.run(client,message);
});

client.on('guildMemberAdd', async member => {
    //exports.module.run(client,member);
});

client.on('channelCreate', async function(channel) {
    exports.autobot.run(client, channel, null)
})

client.on('guildMemberUpdate', async function(oldmember, newmember) {
    //exports.module.run(client, oldmember, newmember);
});

client.on("emojiCreate", (Emoji) => {
    //exports.module.run(Emoji);
});

client.on("emojiDelete", (Emoji) => {
    //exports.module.run(Emoji);
});

client.on("emojiUpdate", (oldEmoji, newEmoji) => {
    //exports.module.run(Emoji);
});

client.on("messageReactionAdd", async function(messageReaction, user) {
    //exports.autobot.run(client, null, messageReaction)
})

client.login(config.token);