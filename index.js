require('dotenv').config();
const Discord = require('discord.js');

const commands = require('./commands');
const botConfig = require('./botConfig');

const client = new Discord.Client(botConfig);

client.on('ready', function () {
    console.log(`[LOGIN] Logged in as ${client.user.tag}!`);

    // if the bot is actually not connected to the specific server
    if (this.guilds.cache.has(384349653254275082)){
        console.log('[LOGOUT] Not connected to any server');
        this.destroy();
    }
});

client.on('message', msg => {
    if (msg.content[0] !== '!') return;

    const mapping = {
        ping: () => msg.reply(commands.pong()),
        say : (text) => {
            msg.delete();
            msg.channel.send(commands.say(text));
        },
        link: () => {
            msg.delete();
            msg.channel.send(commands.say(text));
        }
    };

    const words = msg.content.split(' ');

    const command = words.shift().substr(1);
    const message = words.join(' ');

    if (!(command in mapping)) return;

    mapping[command](message);
});

client.login(process.env.TOKEN);